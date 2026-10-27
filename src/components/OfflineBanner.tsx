import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  setIsOffline,
  pendingSyncCount,
  onSyncNow,
}) => {
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      onSyncNow();
      setTimeout(() => setJustReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOffline, onSyncNow]);

  if (!isOffline && !justReconnected) return null;

  return (
    <div className={`py-2 px-4 text-xs font-medium transition-all ${
      isOffline
        ? 'bg-amber-800 text-amber-50'
        : 'bg-emerald-900 text-emerald-100'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
              <span>
                Mode hors-ligne actif : consultation des profils en cache disponible. Vos actions seront synchronisées automatiquement dès le retour du réseau.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                Connexion rétablie ! Données synchronisées avec succès en temps réel.
              </span>
            </>
          )}
        </div>

        {isOffline && pendingSyncCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono tabular-nums text-amber-200">
              {pendingSyncCount} en attente
            </span>
            <button
              type="button"
              onClick={onSyncNow}
              className="px-2 py-0.5 bg-amber-900 hover:bg-amber-950 rounded text-[11px] cursor-pointer"
            >
              Forcer synchro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
