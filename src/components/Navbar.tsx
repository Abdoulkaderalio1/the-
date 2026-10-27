import React from 'react';
import { ShieldCheck, MessageCircle, MapPin, BarChart3, UserCheck, Lock, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab: 'profiles' | 'map' | 'messages' | 'verification' | 'analytics' | 'gmail';
  setActiveTab: (tab: 'profiles' | 'map' | 'messages' | 'verification' | 'analytics' | 'gmail') => void;
  openPrivacy2FA: () => void;
  is2FAEnabled: boolean;
  unreadCount: number;
  userVerified: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openPrivacy2FA,
  is2FAEnabled,
  unreadCount,
  userVerified,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('profiles')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-serif-cultural text-lg font-bold shadow-sm">
              ن
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-stone-900 text-base md:text-lg whitespace-nowrap">
                Le Chemin pour le Nikah
              </span>
              <span className="text-[11px] text-stone-500 font-medium -mt-1 hidden sm:inline">
                Rencontre & Mariage Célibataire au Niger
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Concise single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`whitespace-nowrap transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'profiles'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Découvrir
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'map'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Carte & Proximité</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer relative pb-0.5 ${
              activeTab === 'messages'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Messagerie E2EE</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'verification'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vérification Photo</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'analytics'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tableau de Bord</span>
          </button>
          <button
            onClick={() => setActiveTab('gmail')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'gmail'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-600" />
            <span>Gmail</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Security Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openPrivacy2FA}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
            title="Paramètres de sécurité, 2FA et confidentialité RGPD"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            <span>Sécurité & 2FA</span>
            {is2FAEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </button>

          {userVerified ? (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-md whitespace-nowrap">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Compte Vérifié</span>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('verification')}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Faire vérifier mon profil
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
