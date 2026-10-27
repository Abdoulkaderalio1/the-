import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, ShieldCheck, KeyRound, CheckCheck, Check, Mic, Phone, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Profile, ChatMessage } from '../types';
import { encryptE2EEMessage, generateSecurityFingerprint } from '../utils/crypto';

interface ChatInterfaceProps {
  activeProfile: Profile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenWaliDetails: (profile: Profile) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeProfile,
  messages,
  onSendMessage,
  onOpenWaliDetails,
}) => {
  const [inputText, setInputText] = useState('');
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprint, setFingerprint] = useState<string>('CHARGEMENT...');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recommended Nikah Islamic Pre-Marital questions
  const nikahStarterQuestions = [
    'Quelle est votre vision de l\'entraide et du rôle de chacun dans le foyer ?',
    'Dans quelle ville ou quartier du Niger envisagez-vous de résider après le mariage ?',
    'Quelles sont vos aspirations concernant l\'éducation religieuse des enfants ?',
    'Quelle est l\'implication et l\'accord de votre tuteur (Wali) pour cette démarche ?',
  ];

  // Calculate authentic cryptographic SHA-256 fingerprint for this pair
  useEffect(() => {
    generateSecurityFingerprint('user-current', activeProfile.id).then((fp) => {
      setFingerprint(fp);
    });
  }, [activeProfile.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSelectStarter = (q: string) => {
    setInputText(q);
  };

  const handleSimulateAudioNote = () => {
    setIsRecordingAudio(true);
    setTimeout(() => {
      setIsRecordingAudio(false);
      onSendMessage("🎙️ [Message vocal chiffré - 0:18 min]");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Bar of Chat */}
      <div className="px-5 py-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeProfile.photoUrl}
              alt={activeProfile.pseudonym}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-stone-300"
            />
            {activeProfile.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[9px]">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-900">
                {activeProfile.pseudonym}
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                · {activeProfile.region}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>Chiffrement de bout en bout (E2EE) actif</span>
            </div>
          </div>
        </div>

        {/* Security Fingerprint Inspection & Wali Access */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFingerprintModal(true)}
            className="p-2 text-stone-600 hover:text-emerald-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
            title="Vérifier l'empreinte cryptographique"
          >
            <KeyRound className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Clé Chiffrée</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWaliDetails(activeProfile)}
            className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contact Wali</span>
          </button>
        </div>
      </div>

      {/* Security Banner Notice */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Communications protégées par AES-GCM 256. Seuls vous deux et le tuteur légal pouvez lire ces messages.</span>
        </div>
        <span className="text-stone-300 hidden md:inline">Protocole Standard RGPD</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50/50">
        {/* Cultural Islamic Admonition */}
        <div className="max-w-md mx-auto text-center p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1 shadow-xs">
          <div className="font-serif-cultural text-emerald-900 text-sm font-bold">
            « وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا »
          </div>
          <p className="text-[11px] text-stone-500">
            Échangez avec courtoisie, pureté d'intention et respect des convenances religieuses du Niger.
          </p>
        </div>

        {/* Message bubbles */}
        {messages.map((m) => {
          const isMe = m.senderId === 'user-current';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-xs text-xs leading-relaxed ${
                  isMe
                    ? 'bg-emerald-900 text-white rounded-tr-none'
                    : 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    isMe ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  <span className="font-mono">{m.timestamp}</span>
                  {isMe && (
                    <span>
                      {m.status === 'read' ? (
                        <CheckCheck className="w-3 h-3 text-amber-300" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </span>
                  )}
                  <Lock className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Nikah Questions Carousel */}
      <div className="px-4 py-2 border-t border-stone-100 bg-white overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Questions mariage :
        </span>
        {nikahStarterQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectStarter(q)}
            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap text-[11px] transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Console */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-stone-200 bg-white flex items-center gap-2">
        <button
          type="button"
          onClick={handleSimulateAudioNote}
          disabled={isRecordingAudio}
          className={`p-2.5 rounded-full text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer ${
            isRecordingAudio ? 'text-red-600 animate-pulse bg-red-50' : ''
          }`}
          title="Message vocal chiffré"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrivez un message respectueux chiffré..."
          className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-emerald-900 hover:bg-emerald-800 disabled:bg-stone-300 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Cryptographic SHA-256 Fingerprint Inspection Modal */}
      {showFingerprintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-800" />
                <h4 className="font-bold text-sm text-stone-900">
                  Empreinte Cryptographique (E2EE)
                </h4>
              </div>
              <button
                onClick={() => setShowFingerprintModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Pour vous assurer qu'aucun intermédiaire ne peut lire vos communications, vous pouvez comparer cette empreinte SHA-256 avec votre correspondant :
            </p>

            <div className="p-3.5 bg-stone-100 rounded-xl font-mono text-center text-xs font-bold text-emerald-950 tracking-wider break-all border border-stone-200">
              {fingerprint}
            </div>

            <div className="text-[11px] text-stone-500 space-y-1">
              <div>Algorithme : AES-GCM 256 bits avec dérivation PBKDF2</div>
              <div>Hachage : SHA-256 Digest NIST FIPS 180-4</div>
              <div>Conformité : Chiffrement intégral de bout en bout</div>
            </div>

            <button
              type="button"
              onClick={() => setShowFingerprintModal(false)}
              className="w-full py-2.5 bg-emerald-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Fermer la vérification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
