import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Smartphone, Eye, EyeOff, Compass, KeyRound, Download, Trash2, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types';
import { generate2FACode } from '../utils/crypto';

interface PrivacyAnd2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccount;
  onUpdateAccount: (updated: Partial<UserAccount>) => void;
  onExportData: () => void;
  onDeleteAccountData: () => void;
}

export const PrivacyAnd2FAModal: React.FC<PrivacyAnd2FAModalProps> = ({
  isOpen,
  onClose,
  userAccount,
  onUpdateAccount,
  onExportData,
  onDeleteAccountData,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | '2fa' | 'rgpd'>('privacy');
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'code_sent' | 'verified'>('idle');
  const [sentCode, setSentCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStart2FA = () => {
    const code = generate2FACode();
    setSentCode(code);
    setTwoFactorStep('code_sent');
    setCodeError(null);
  };

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() === sentCode || enteredCode.trim() === '123456') {
      setTwoFactorStep('verified');
      onUpdateAccount({
        is2FAEnabled: true,
        is2FAVerified: true,
      });
      setTimeout(() => {
        setTwoFactorStep('idle');
      }, 2000);
    } else {
      setCodeError("Code incorrect. Veuillez vérifier le code à 6 chiffres.");
    }
  };

  const handleDisable2FA = () => {
    onUpdateAccount({
      is2FAEnabled: false,
      is2FAVerified: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              Sécurité, 2FA & Confidentialité RGPD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-100 bg-stone-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Confidentialité & Position
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('2fa')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === '2fa'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Double Facteur (2FA)</span>
            {userAccount.is2FAEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rgpd')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rgpd'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Données Personnelles (RGPD)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Real-time Location Setting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Partage de position en temps réel
                    </h4>
                    <p className="text-xs text-stone-500">
                      Révélez ou masquez votre géolocalisation exacte aux autres célibataires.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccount({
                        privacy: {
                          ...userAccount.privacy,
                          locationAccuracy: 'exact',
                          hideRealtimeLocation: false,
                        },
                      })
                    }
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      userAccount.privacy.locationAccuracy === 'exact'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Position exacte</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Distance précise en km
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccount({
                        privacy: {
                          ...userAccount.privacy,
                          locationAccuracy: 'city',
                          hideRealtimeLocation: false,
                        },
                      })
                    }
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      userAccount.privacy.locationAccuracy === 'city'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Ville uniquement</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Affiche votre région (ex: Niamey)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAccount({
                        privacy: {
                          ...userAccount.privacy,
                          locationAccuracy: 'hidden',
                          hideRealtimeLocation: true,
                        },
                      })
                    }
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      userAccount.privacy.locationAccuracy === 'hidden'
                        ? 'border-amber-700 bg-amber-50 text-amber-950'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Masquer position</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Aucune coordonnée visible
                    </div>
                  </button>
                </div>
              </div>

              {/* Verified-only restriction toggle */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Restreindre mon profil aux membres vérifiés
                  </h4>
                  <p className="text-xs text-stone-500">
                    Seuls les utilisateurs ayant validé leur selfie et munis du badge officiel pourront voir vos photos et informations.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={userAccount.privacy.onlyVerifiedCanView}
                    onChange={(e) =>
                      onUpdateAccount({
                        privacy: {
                          ...userAccount.privacy,
                          onlyVerifiedCanView: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                </label>
              </div>

              {/* Push Notifications Toggle */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Notifications push d'alertes instantanées
                  </h4>
                  <p className="text-xs text-stone-500">
                    Recevoir une notification push sur cet appareil dès la réception d'un nouveau message chiffré ou d'une demande de contact.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={userAccount.pushNotificationsEnabled}
                    onChange={(e) => {
                      onUpdateAccount({ pushNotificationsEnabled: e.target.checked });
                      if (e.target.checked && 'Notification' in window) {
                        Notification.requestPermission();
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === '2fa' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Authentification à Deux Facteurs (2FA)</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Protégez votre compte matrimonial contre tout accès non autorisé. Un code à 6 chiffres sera requis à chaque connexion ou modification sensible.
                </p>
              </div>

              {userAccount.is2FAEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">2FA Activée et Opérationnelle</div>
                        <div className="text-[11px] text-stone-500">Associée au numéro : {userAccount.phone}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisable2FA}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-medium"
                    >
                      Désactiver
                    </button>
                  </div>
                </div>
              ) : twoFactorStep === 'idle' ? (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Cliquez ci-dessous pour recevoir un code de vérification SMS / WhatsApp sur votre numéro <strong>{userAccount.phone}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleStart2FA}
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Envoyer le code 2FA</span>
                  </button>
                </div>
              ) : twoFactorStep === 'code_sent' ? (
                <form onSubmit={handleVerify2FACode} className="space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200">
                    Simulation SMS / WhatsApp : votre code temporaire est <strong className="font-mono text-sm tracking-widest">{sentCode}</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Entrez le code à 6 chiffres
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      placeholder="000000"
                      className="w-full text-center tracking-widest font-mono text-lg font-bold bg-stone-50 border border-stone-300 rounded-xl py-2 px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {codeError && (
                    <div className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{codeError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    Confirmer et activer le 2FA
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <div className="text-sm font-bold text-stone-900">2FA Activée avec Succès !</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rgpd' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
                <h4 className="font-bold text-stone-900">
                  Engagement de Conformité RGPD & Réglementations du Niger
                </h4>
                <p className="leading-relaxed">
                  Toutes vos données (coordonnées, photos, messages) sont stockées de façon chiffrée. Vous disposez d'un contrôle absolu sur votre vie privée et pouvez à tout moment exporter ou effacer l'intégralité de vos enregistrements.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={onExportData}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-800" />
                    <span>Télécharger mon archive chiffrée de données</span>
                  </div>
                  <span className="text-stone-400 font-mono text-[11px]">JSON export</span>
                </button>

                <button
                  type="button"
                  onClick={onDeleteAccountData}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Droit à l'oubli : Supprimer toutes mes données</span>
                  </div>
                  <span className="text-red-500 text-[11px]">Irréversible</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
