/**
 * Client-Side Gmail API Service for Le Chemin pour le Nikah
 * Uses direct Google Workspace REST API with in-memory Bearer token
 */

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  sender?: string;
  subject?: string;
  date?: string;
}

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

// Fetch user profile from Gmail
export async function fetchGmailProfile(accessToken: string): Promise<GmailUserProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur profil Gmail (${res.status}): ${errorText}`);
  }

  return await res.json();
}

// Fetch recent messages
export async function listGmailMessages(
  accessToken: string,
  maxResults = 10,
  query?: string
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.set('q', query);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur récupération messages Gmail (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const messagesList = data.messages || [];

  // Fetch header snippets for top messages in parallel
  const detailedMessages: GmailMessageSummary[] = await Promise.all(
    messagesList.slice(0, 8).map(async (msg: { id: string; threadId: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (detailRes.ok) {
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(Sans objet)';
          const sender = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Inconnu';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

          return {
            id: msg.id,
            threadId: msg.threadId,
            snippet: detail.snippet,
            subject,
            sender,
            date,
          };
        }
      } catch {
        // Fallback
      }
      return {
        id: msg.id,
        threadId: msg.threadId,
        snippet: 'Message Gmail',
        subject: 'Notification',
        sender: '',
        date: '',
      };
    })
  );

  return detailedMessages;
}

// Helper: Base64URL encode for Gmail RFC 2822
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Send Email via Gmail API (MANDATORY: Requires explicit user confirmation in UI before calling)
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText,
  ];
  const message = messageParts.join('\r\n');
  const raw = base64UrlEncode(message);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Échec de l'envoi de l'email via Gmail (${res.status}): ${errorText}`);
  }

  return await res.json();
}
