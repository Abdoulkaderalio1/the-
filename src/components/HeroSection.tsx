import React from 'react';
import { Search, ShieldCheck, HeartHandshake, Phone, Smartphone } from 'lucide-react';
import { NigerRegion } from '../types';

interface HeroSectionProps {
  genderFilter: 'all' | 'female' | 'male';
  setGenderFilter: (val: 'all' | 'female' | 'male') => void;
  regionFilter: 'all' | NigerRegion;
  setRegionFilter: (val: 'all' | NigerRegion) => void;
  onlyVerified: boolean;
  setOnlyVerified: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenVerification: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  genderFilter,
  setGenderFilter,
  regionFilter,
  setRegionFilter,
  onlyVerified,
  setOnlyVerified,
  searchQuery,
  setSearchQuery,
  onOpenVerification,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 border-b border-stone-800">
      {/* Background Image with calibrated scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_nikah_niger_1793124810013.jpg"
          alt="Mariage traditionnel et anneaux bénis au Niger"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-950/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300">
              <span className="font-serif-cultural text-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span aria-hidden="true">·</span>
              <span>Plateforme Matrimoniale du Niger</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trouvez votre moitié pour le <span className="text-amber-400">Nikah</span> avec dignité et sérénité.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Une démarche noble et sincère dédiée aux célibataires musulmans du Niger (Niamey, Maradi, Zinder, Tahoua et tout le pays). Profils certifiés par photo, géolocalisation respectueuse de la vie privée et mise en relation directe avec accord familial.
            </p>

            {/* Cultural & Islamic reassurance banners */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Vérification photo anti-usurpation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Médiation respectueuse & Tuteur (Wali)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Paiement My Nita & Amanata (+227 99 61 40 98)</span>
              </div>
            </div>
          </div>

          {/* Quick Search & Filtering Console */}
          <div className="lg:col-span-5 bg-white text-stone-900 rounded-2xl p-6 shadow-xl border border-stone-200">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center justify-between">
              <span>Recherche de Profils</span>
              <span className="text-xs font-normal text-stone-500">Niger</span>
            </h2>

            <div className="space-y-4">
              {/* Gender Segmented Control */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Je recherche
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGenderFilter('female')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      genderFilter === 'female'
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Femme (Nikah)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter('male')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      genderFilter === 'male'
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Homme (Nikah)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter('all')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      genderFilter === 'all'
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Tous
                  </button>
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Région du Niger
                </label>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value as 'all' | NigerRegion)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="all">Tout le Niger (8 Régions)</option>
                  <option value="Niamey">Niamey (Capitale & arrondissements)</option>
                  <option value="Maradi">Maradi</option>
                  <option value="Zinder">Zinder</option>
                  <option value="Tahoua">Tahoua</option>
                  <option value="Agadez">Agadez</option>
                  <option value="Tillabéri">Tillabéri</option>
                  <option value="Dosso">Dosso</option>
                  <option value="Diffa">Diffa</option>
                </select>
              </div>

              {/* Search input by keyword / profession */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Profession, valeurs ou mot-clé
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Enseignant, Agronome, Haoussa, Tajweed..."
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg py-2.5 pl-9 pr-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Verified Filter checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 cursor-pointer"
                  />
                  <span>Uniquement les profils vérifiés par photo</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenVerification}
                  className="text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  Comment certifier ?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Adjacency Strip */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300">
          <div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">3 850+</div>
            <div className="text-xs text-stone-400 mt-0.5">Célibataires engagés au Niger</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">92%</div>
            <div className="text-xs text-stone-400 mt-0.5">Taux de profils vérifiés par photo</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">100%</div>
            <div className="text-xs text-stone-400 mt-0.5">Chiffrement E2EE garanti</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">410+</div>
            <div className="text-xs text-stone-400 mt-0.5">Mariages & Nikah concrétisés</div>
          </div>
        </div>
      </div>
    </section>
  );
};
