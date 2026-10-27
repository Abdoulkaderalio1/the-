import React from 'react';
import { ShieldCheck, Star, MapPin, Lock, MessageCircle, HeartHandshake } from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  userDistanceKm?: number;
  userIsVerified: boolean;
  onSelect: (profile: Profile) => void;
  onInitiateContact: (profile: Profile) => void;
  onOpenReviews: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  userDistanceKm,
  userIsVerified,
  onSelect,
  onInitiateContact,
  onOpenReviews,
}) => {
  // If profile is restricted to verified members and current user is not verified
  const isRestricted = profile.privacySettings.onlyVerifiedCanView && !userIsVerified;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-emerald-700/50 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Photo Slot with calibrated aspect ratio and fallback container */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          <img
            src={profile.photoUrl}
            alt={`Photo de profil de ${profile.pseudonym}`}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isRestricted ? 'blur-xl scale-110 filter brightness-75' : ''
            }`}
          />

          {/* Verification Shield Badge */}
          {profile.isVerified && !isRestricted && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-950 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Certifié Nikah</span>
            </div>
          )}

          {/* Distance Indicator */}
          {userDistanceKm !== undefined && !isRestricted && (
            <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span className="font-mono tabular-nums">{userDistanceKm} km</span>
            </div>
          )}

          {/* Restricted Privacy Overlay */}
          {isRestricted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-stone-900/60 backdrop-blur-sm text-white">
              <Lock className="w-6 h-6 text-amber-400 mb-1.5" />
              <p className="text-xs font-semibold">Profil réservé aux membres vérifiés</p>
              <p className="text-[11px] text-stone-300 mt-1">
                Faites vérifier votre photo pour débloquer l'accès à ce profil.
              </p>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Unboxed Metadata Line (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
            <span className="font-semibold text-stone-700">{profile.age} ans</span>
            <span aria-hidden="true">·</span>
            <span>{profile.maritalStatus}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-800 font-medium">{profile.region}</span>
            {profile.district && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500">{profile.district}</span>
              </>
            )}
          </div>

          {/* Profile Name / Pseudonym */}
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
            {profile.pseudonym}
          </h3>

          {/* Occupation & Cultural roots */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-1 font-medium">
            {profile.occupation}
          </p>

          {/* Bio snippet */}
          <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>

          {/* Ratings & Reviews trigger */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onOpenReviews(profile)}
              className="flex items-center gap-1 text-xs text-stone-700 hover:text-emerald-800 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold font-mono tabular-nums">{profile.averageRating.toFixed(1)}</span>
              <span className="text-stone-400">({profile.reviewsCount} avis)</span>
            </button>

            <span className="text-[11px] text-stone-500">
              Tuteur : <strong className="text-stone-700">{profile.wali.relationship}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelect(profile)}
          className="w-full py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap"
        >
          Détails & Wali
        </button>

        <button
          type="button"
          onClick={() => onInitiateContact(profile)}
          className={`w-full py-2 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm ${
            profile.contactUnlocked
              ? 'bg-emerald-900 text-white hover:bg-emerald-800'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {profile.contactUnlocked ? (
            <>
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Discuter</span>
            </>
          ) : (
            <>
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Mettre en contact</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
