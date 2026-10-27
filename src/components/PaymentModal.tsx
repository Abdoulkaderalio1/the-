import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Profile, PaymentTransaction } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  profile,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'My Nita' | 'Amanata'>('My Nita');
  const [senderPhone, setSenderPhone] = useState('+227 ');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const officialNumber = '+227 99 61 40 98';
  const amountFcfa = 2000;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+22799614098');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone number
    const cleanPhone = senderPhone.replace(/\s+/g, '');
    if (!cleanPhone.startsWith('+227') || cleanPhone.length < 11) {
      setErrorMsg("Veuillez saisir un numéro de téléphone nigérien valide (+227 XX XX XX XX).");
      return;
    }

    if (!transactionRef.trim() || transactionRef.trim().length < 4) {
      setErrorMsg("Veuillez entrer la référence ou le numéro de reçu de votre transfert My Nita / Amanata.");
      return;
    }

    setIsSubmitting(true);

    // Simulate instant transaction verification
    setTimeout(() => {
      setIsSubmitting(false);
      const tx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        profileId: profile.id,
        profileName: profile.pseudonym,
        method: selectedMethod,
        amountFcfa,
        officialRecipientPhone: officialNumber,
        senderPhone: cleanPhone,
        transactionRef: transactionRef.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'verified',
      };
      onPaymentSuccess(tx);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              Déblocage de la Mise en Contact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitPayment} className="p-6 space-y-5">
          {/* Target Profile Summary */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <img
              src={profile.photoUrl}
              alt={profile.pseudonym}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <div className="text-xs text-stone-500 font-medium">Mise en contact pour le Nikah avec :</div>
              <div className="text-sm font-bold text-stone-900">
                {profile.pseudonym} ({profile.age} ans, {profile.region})
              </div>
              <div className="text-[11px] text-emerald-800 font-medium">
                Tuteur : {profile.wali.relationship}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Choisissez votre moyen de paiement au Niger
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('My Nita')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMethod === 'My Nita'
                    ? 'border-emerald-800 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-800/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-sm text-stone-900">My Nita</div>
                <div className="text-[11px] text-stone-500 mt-1">Transfert instantané mobile</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Amanata')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMethod === 'Amanata'
                    ? 'border-emerald-800 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-800/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-sm text-stone-900">Amanata</div>
                <div className="text-[11px] text-stone-500 mt-1">Dépôt & transfert d'argent</div>
              </button>
            </div>
          </div>

          {/* Transfer Instruction Box with Official Number */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-950">
                Numéro Officiel de Réception :
              </span>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/80">
              <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                {officialNumber}
              </span>
              <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                {amountFcfa} FCFA
              </span>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              Effectuez un transfert de <strong>2 000 FCFA</strong> par {selectedMethod} vers le numéro officiel <strong>{officialNumber}</strong>, puis entrez ci-dessous votre numéro expéditeur et la référence du reçu.
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Votre numéro de téléphone émetteur ({selectedMethod})
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="+227 99 XX XX XX"
                required
                className="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Référence / Numéro de transaction (ID Reçu)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Ex: NITA-99482103 ou TXN-78451"
                required
                className="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 disabled:bg-stone-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Vérification instantanée en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Valider mon paiement et débloquer le contact</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Déblocage garanti et surveillé par l'administration Nikah Niger.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
