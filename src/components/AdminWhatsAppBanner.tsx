import React, { useState } from 'react';
import { MessageCircle, Phone, ShieldCheck, X, ExternalLink, HelpCircle } from 'lucide-react';

export const AdminWhatsAppBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const adminWhatsApp = '+227 99 66 40 98';
  const cleanPhone = '22799664098';

  return (
    <>
      {/* Floating Quick WhatsApp Support Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-full p-3.5 shadow-xl border border-emerald-700/50 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer group"
          title="Assistance Admin WhatsApp Business (+227 99 66 40 98)"
        >
          <MessageCircle className="w-5 h-5 text-emerald-300" />
          <span className="hidden group-hover:inline text-xs font-bold pr-1">
            Assistance WhatsApp
          </span>
        </button>
      </div>

      {/* Admin WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Assistance Officielle de l'Administrateur
                  </h3>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    WhatsApp Business Vérifié
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600">
              <p>
                Un besoin technique, une question sur votre paiement My Nita / Amanata ou une demande d'assistance personnalisée ? L'équipe de modération du <strong>Chemin pour le Nikah</strong> est à votre écoute directe.
              </p>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="text-[11px] text-stone-500 font-medium">
                  Numéro d'administration officiel :
                </div>
                <div className="font-mono text-base font-bold text-stone-900">
                  {adminWhatsApp}
                </div>
                <div className="text-[10px] text-stone-400">
                  Ligne sécurisée chiffrée de bout en bout
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/${cleanPhone}?text=Salam%20Aleykoum%20Admin%2C%20je%20vous%20contacte%20depuis%20l%27application%20Le%20Chemin%20pour%20le%20Nikah%20au%20Niger`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir sur WhatsApp Business</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={`tel:${adminWhatsApp.replace(/\s+/g, '')}`}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-800" />
                <span>Appel téléphonique direct</span>
              </a>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5 pt-2 border-t border-stone-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Support bénévole et confidentiel au Niger</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
