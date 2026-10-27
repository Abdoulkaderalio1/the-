import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, RefreshCw, LogOut, 
  ShieldCheck, FileText, Sparkles, User, Inbox, AlertTriangle 
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  initAuth 
} from '../utils/workspaceAuth';
import { 
  fetchGmailProfile, 
  listGmailMessages, 
  sendGmailMessage, 
  GmailMessageSummary, 
  GmailUserProfile 
} from '../utils/gmailApi';
import { Profile } from '../types';

interface GmailNotificationCenterProps {
  profiles: Profile[];
  onNotifyToast: (title: string, msg: string) => void;
}

export const GmailNotificationCenter: React.FC<GmailNotificationCenterProps> = ({
  profiles,
  onNotifyToast,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profileData, setProfileData] = useState<GmailUserProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email Compose State
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mandatory User Confirmation Modal for Mutating Action (Sending Email)
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadGmailData(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setProfileData(null);
        setMessages([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Load Gmail profile & messages
  const loadGmailData = async (accessToken: string) => {
    setIsLoadingMessages(true);
    setErrorMsg(null);
    try {
      const [prof, msgs] = await Promise.all([
        fetchGmailProfile(accessToken),
        listGmailMessages(accessToken, 6),
      ]);
      setProfileData(prof);
      setMessages(msgs);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erreur lors du chargement des données Gmail.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        await loadGmailData(result.accessToken);
        onNotifyToast(
          'Compte Gmail connecté',
          `Connecté en tant que ${result.user.email} pour la gestion des alertes Nikah.`
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Échec de la connexion à Gmail.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setProfileData(null);
    setMessages([]);
    onNotifyToast('Déconnexion Gmail', 'Votre session Google a été fermée.');
  };

  // Pre-fill templates for respectful Nigerien Nikah communications
  const handleApplyTemplate = (type: 'wali' | 'admin' | 'receipt') => {
    if (type === 'wali') {
      setSubject('Demande formelle de renseignement et prise de contact pour le Nikah');
      setBody(
        `Salam Aleykoum wa Rahmatoullah,\n\n` +
        `Monsieur le tuteur légal (Wali),\n\n` +
        `Je vous adresse ce courriel par le biais de la plateforme "Le Chemin pour le Nikah" au Niger. Animé d'une intention pure et sincère en vue de sceller une union respectueuse selon les préceptes de l'Islam et nos traditions familiales nigériennes, je sollicite votre bienveillance pour échanger formellement.\n\n` +
        `Je me tiens à votre entière disposition pour tout entretien à Niamey ou par appel téléphonique.\n\n` +
        `Qu'Allah bénisse nos foyers,\n` +
        `Fraternellement en Islam.`
      );
    } else if (type === 'admin') {
      setRecipient('abdoulkader.alio@gmail.com');
      setSubject('Demande d\'assistance ou validation de dossier Nikah - Niger');
      setBody(
        `Salam Aleykoum Admin Nikah,\n\n` +
        `Je vous contacte concernant la validation de mon dossier ou une question technique relative aux transferts My Nita / Amanata (+227 99 61 40 98).\n\n` +
        `Merci pour votre accompagnement bienveillant.\n\n` +
        `Cordialement.`
      );
    } else if (type === 'receipt') {
      setSubject('Notification de mise en relation débloquée - Le Chemin pour le Nikah');
      setBody(
        `Salam Aleykoum,\n\n` +
        `Nous vous confirmons que la mise en relation avec le tuteur a été validée avec succès sur Le Chemin pour le Nikah suite à votre paiement via My Nita/Amanata.\n\n` +
        `Vous pouvez désormais initier vos échanges chiffrés en toute sérénité.\n\n` +
        `Administration Le Chemin pour le Nikah (Niger).`
      );
    }
  };

  // Trigger Confirmation Modal before sending email
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !body.trim()) {
      setErrorMsg('Veuillez renseigner le destinataire, le sujet et le message.');
      return;
    }
    setErrorMsg(null);
    setShowConfirmModal(true);
  };

  // Execute Sending after explicit user confirmation
  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    if (!token) {
      setErrorMsg('Session expirée. Veuillez vous reconnecter à Gmail.');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);
    try {
      await sendGmailMessage(token, recipient.trim(), subject.trim(), body.trim());
      onNotifyToast('Email envoyé via Gmail', `Votre message a été transmis avec succès à ${recipient}.`);
      setRecipient('');
      setSubject('');
      setBody('');
      // Refresh messages list
      loadGmailData(token);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Impossible d\'envoyer l\'email via Gmail.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-stone-900">
              Espace Gmail & Alertes Matrimoniales Nikah
            </h2>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Connectez votre compte Gmail pour envoyer des courriers formels aux tuteurs (Wali), recevoir vos alertes de mariage et échanger en conformité avec les standards Google Workspace.
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-bold text-stone-900 truncate max-w-[200px]">
                {user.email}
              </div>
              <div className="text-emerald-700 text-[11px] font-medium flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connecté à Gmail</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
              title="Se déconnecter de Google"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!user ? (
        /* Sign in with Google (Styled following official Google Identity Services guidelines) */
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-lg mx-auto shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-stone-900">
              Connexion avec votre compte Gmail
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Permet d'envoyer des lettres de recommandation formelles aux familles et tuteurs légaux au Niger, de recevoir des confirmations de mise en contact et de gérer vos alertes matrimoniales par email.
            </p>
          </div>

          {/* Official Google Sign-In Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center justify-center gap-3 px-5 py-3 border border-stone-300 rounded-xl shadow-xs bg-white text-stone-700 hover:bg-stone-50 font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin text-stone-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span>{isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Google (Gmail)'}</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Autorisation sécurisée avec jeton conservé uniquement en mémoire.</span>
          </div>
        </div>
      ) : (
        /* Connected Workspace Gmail Center */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inbox Messages & Profile Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Account Info Box */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>Compte Gmail Actif</span>
                </span>
                <button
                  type="button"
                  onClick={() => token && loadGmailData(token)}
                  disabled={isLoadingMessages}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="Actualiser la boîte"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {profileData && (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                  <div className="font-mono text-stone-800 font-bold truncate">
                    {profileData.emailAddress}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Messages totaux : <span className="font-mono font-bold text-stone-700">{profileData.messagesTotal}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-stone-500" />
                  <span>Derniers Emails Reçus</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {messages.length} message(s)
                </span>
              </div>

              {isLoadingMessages ? (
                <div className="text-center py-6 text-xs text-stone-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-800" />
                  <span>Chargement des messages Gmail...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-500">
                  Aucun message récent trouvé dans votre boîte de réception.
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50/70 transition-all text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 truncate max-w-[180px]">
                          {m.sender?.replace(/<.*>/, '') || 'Correspondant'}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate">
                          {m.date ? new Date(m.date).toLocaleDateString('fr-FR') : ''}
                        </span>
                      </div>
                      <div className="font-medium text-emerald-950 truncate">
                        {m.subject}
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2">
                        {m.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Compose Email with Pre-formatted Islamic Nikah templates */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-800" />
                <span>Rédiger un Email Formel de Nikah</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                Envoi direct via l'API Gmail
              </span>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Modèles de courriers respectueux pour le Niger :
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('wali')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer text-[11px] font-medium"
                >
                  📜 Lettre au Tuteur (Wali)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('admin')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer text-[11px] font-medium"
                >
                  🛡️ Contact Administration Nikah
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('receipt')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer text-[11px] font-medium"
                >
                  ✅ Reçu & Accord de Médiation
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleInitiateSend} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adresse email du destinataire
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="ex: tuteur.wali@gmail.com ou abdoulkader.alio@gmail.com"
                  required
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Objet du message
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet du courriel..."
                  required
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Corps du message
                </label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Rédigez votre message avec bienveillance et clarté..."
                  required
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Envoi en cours via Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Vérifier et envoyer l'email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-stone-500 text-center">
                Un dialogue de confirmation s'affichera obligatoirement avant toute transmission.
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR EMAIL MUTATION */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-sm text-stone-900">
                Confirmation d'envoi d'email via Gmail
              </h4>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Vous êtes sur le point d'envoyer cet email officiel depuis votre adresse Gmail <strong>{user?.email}</strong>. Veuillez vérifier attentivement les détails avant de confirmer :
            </p>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-stone-700">Destinataire : </span>
                <span className="font-mono text-stone-900">{recipient}</span>
              </div>
              <div>
                <span className="font-bold text-stone-700">Objet : </span>
                <span className="text-stone-900">{subject}</span>
              </div>
              <div className="pt-1 border-t border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">Aperçu du contenu :</span>
                <p className="text-stone-700 text-[11px] whitespace-pre-wrap max-h-36 overflow-y-auto italic bg-white p-2.5 rounded-lg border border-stone-200">
                  {body}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmSend}
                className="flex-1 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Confirmer l'envoi de l'email
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
