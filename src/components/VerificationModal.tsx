import React, { useState } from 'react';
import { X, ShieldCheck, Camera, CheckCircle2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifiedSuccess: () => void;
  userAlreadyVerified: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerifiedSuccess,
  userAlreadyVerified,
}) => {
  const [step, setStep] = useState<'intro' | 'capture' | 'analyzing' | 'success'>('intro');
  const [poseIndex, setPoseIndex] = useState(0);

  const poses = [
    { title: 'Regard direct face à l\'objectif', hint: 'Gardez votre visage bien éclairé sans lunettes sombres.' },
    { title: 'Léger signe de la main ou inclinaison', hint: 'Prouve que la photo est prise en temps réel et n\'est pas téléchargée du web.' },
  ];

  if (!isOpen) return null;

  const handleStartCapture = () => {
    setStep('capture');
  };

  const handleTakeSelfie = () => {
    if (poseIndex < poses.length - 1) {
      setPoseIndex(poseIndex + 1);
    } else {
      setStep('analyzing');
      // Simulate biometric verification check
      setTimeout(() => {
        setStep('success');
        onVerifiedSuccess();
      }, 2500);
    }
  };

  const handleReset = () => {
    setStep('intro');
    setPoseIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              Vérification Photo Officielle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {userAlreadyVerified && step === 'intro' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">
                Votre profil est déjà certifié Nikah !
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Votre identité et votre photo ont été validées avec succès. Le badge officiel de confiance est visible sur votre compte.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : step === 'intro' ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Pourquoi certifier votre profil ?
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Sur <strong>Le Chemin pour le Nikah</strong>, le mariage est un engagement sacré. La vérification photo garantit que chaque célibataire est une vraie personne résidant au Niger, éliminant 100% des faux profils et des escroqueries.
                </p>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold flex items-center justify-center shrink-0 text-stone-800">
                    1
                  </div>
                  <div>
                    <strong>Prise de selfie dynamique :</strong> Un geste simple demandé en direct pour prouver votre présence physique.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold flex items-center justify-center shrink-0 text-stone-800">
                    2
                  </div>
                  <div>
                    <strong>Comparaison biométrique chiffrée :</strong> Validation de la concordance avec vos photos de profil enregistrées.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 font-bold flex items-center justify-center shrink-0 text-stone-800">
                    3
                  </div>
                  <div>
                    <strong>Attribution du Badge Vert Certifié :</strong> Votre profil inspire immédiatement confiance aux familles et tuteurs.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Démarrer la vérification photo</span>
                </button>
              </div>
            </div>
          ) : step === 'capture' ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-dashed border-emerald-600/50">
                {/* Visual Camera Simulation */}
                <div className="w-48 h-48 rounded-full border-2 border-emerald-400 flex items-center justify-center relative animate-pulse">
                  <Camera className="w-12 h-12 text-emerald-400/80" />
                  <div className="absolute inset-0 border-t-2 border-amber-400 rounded-full animate-spin" />
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center px-4">
                  <div className="inline-block bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-emerald-300">
                    Étape {poseIndex + 1}/2 : {poses[poseIndex].title}
                  </div>
                  <p className="text-[11px] text-stone-300 mt-1">
                    {poses[poseIndex].hint}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTakeSelfie}
                  className="flex-1 py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
                >
                  {poseIndex < poses.length - 1 ? 'Valider cette pose & continuer' : 'Prendre le selfie de validation finale'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : step === 'analyzing' ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-700" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                Analyse de conformité en cours...
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Contrôle anti-deepfake, vérification de la vivacité et chiffrement sécurisé des métadonnées de vérification.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">
                Félicitations ! Profil Certifié Nikah
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Votre authenticité a été vérifiée avec succès. Vous avez désormais accès aux profils réservés aux membres vérifiés.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}

          {/* Privacy reassurance */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 border-t border-stone-100 pt-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Les images de vérification ne sont jamais rendues publiques ni partagées à des tiers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
