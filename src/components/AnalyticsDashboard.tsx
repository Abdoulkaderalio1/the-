import React from 'react';
import { BarChart3, Users, ShieldCheck, HeartHandshake, MapPin, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { NIGER_REGIONS } from '../utils/geo';

export const AnalyticsDashboard: React.FC = () => {
  const totalSingles = Object.values(NIGER_REGIONS).reduce(
    (acc, r) => acc + r.activeSinglesCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              Tableau de Bord Analytique de la Communauté Nikah
            </h2>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Suivi en temps réel de l'activité, de la démographie des célibataires et des unions facilitées à travers le Niger.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Données Agrégées & Anonymisées</span>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Célibataires Inscrits</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900">
            {totalSingles.toLocaleString('fr-FR')}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% ce mois-ci</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Taux de Vérification Photo</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-800">
            92.4%
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Contrôle anti-faux profils
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Mises en Contact Réussies</span>
            <HeartHandshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-900">
            1 820+
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Via My Nita & Amanata
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium text-stone-500">Mariages Bénis Conclus</span>
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900">
            412
          </div>
          <div className="mt-1 text-[11px] text-emerald-800 font-medium">
            Témoignages certifiés
          </div>
        </div>
      </div>

      {/* Regional Activity Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center justify-between">
          <span>Répartition Géographique des Célibataires par Région du Niger</span>
          <span className="text-xs font-normal text-stone-500">Base active</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(NIGER_REGIONS).map(([regionName, info]) => {
            const pct = Math.round((info.activeSinglesCount / totalSingles) * 100);

            return (
              <div key={regionName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    {regionName}
                  </span>
                  <div className="flex items-center gap-3 text-stone-500 font-mono">
                    <span className="tabular-nums">{info.activeSinglesCount} membres</span>
                    <span className="font-bold text-stone-800">{pct}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-800 rounded-full transition-all duration-700"
                    style={{ width: `${pct * 2.5}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sociological Insights & Islamic matrimonial ethics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2 text-xs">
          <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            Tranche d'Âge & Profils Représentés
          </h4>
          <p className="text-stone-600 leading-relaxed">
            Majorité d'inscrits âgés de 22 à 38 ans (diplômés universitaires, entrepreneurs, commerçants, fonctionnaires et enseignants). Forte volonté d'un engagement monogame ou polygame concerté selon les règles de la Sharia.
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2 text-xs">
          <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            Rôle Clé du Tuteur (Wali)
          </h4>
          <p className="text-stone-600 leading-relaxed">
            Dans 88% des démarches, le tuteur légal (père ou oncle) est contacté dès les 7 premiers jours de discussion, assurant le respect des familles et la baraka dans l'union.
          </p>
        </div>
      </div>
    </div>
  );
};
