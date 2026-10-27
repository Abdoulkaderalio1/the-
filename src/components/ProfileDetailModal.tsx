import React from 'react';
import { X, ShieldCheck, MapPin, Lock, Unlock, Phone, MessageCircle, Star, Heart, BookOpen, Briefcase, GraduationCap, Users, Mail } from 'lucide-react';
import { Profile } from '../types';

interface ProfileDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
  onUnlockContact: (profile: Profile) => void;
  onStartChat: (profile: Profile) => void;
  onOpenReviews: (profile: Profile) => void;
  onOpenGmail?: (profile: Profile) => void;
  userDistanceKm?: number;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onUnlockContact,
  onStartChat,
  onOpenReviews,
  onOpenGmail,
  userDistanceKm,
}) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Sticky Header with Close */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-900">
              Dossier Matrimonial Nikah
            </span>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vérifié le {profile.verificationBadgeDate}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 shadow-sm">
              <img
                src={profile.photoUrl}
                alt={profile.pseudonym}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-stone-900">
                  {profile.pseudonym}
                </h2>
                <button
                  type="button"
                  onClick={() => onOpenReviews(profile)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{profile.averageRating.toFixed(1)} / 5</span>
                  <span className="text-amber-700 font-normal">({profile.reviewsCount} avis)</span>
                </button>
              </div>

              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-600 flex-wrap">
                <span className="font-semibold text-stone-800">{profile.age} ans</span>
                <span aria-hidden="true">·</span>
                <span>{profile.maritalStatus}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.region} {profile.district ? `(${profile.district})` : ''}
                </span>
                {userDistanceKm !== undefined && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-stone-500">à {userDistanceKm} km</span>
                  </>
                )}
              </div>

              <p className="text-xs text-stone-600 pt-1 font-medium">
                {profile.occupation}
              </p>
            </div>
          </div>

          {/* Bio / Projet de Vie */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Projet de Vie & Vision du Foyer
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed italic">
              « {profile.bio} »
            </p>
          </div>

          {/* Structured Criteria Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-2 text-stone-500 font-semibold">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Pratique Religieuse (Dîn)</span>
              </div>
              <p className="text-stone-800 font-medium">{profile.religiousPractice}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-2 text-stone-500 font-semibold">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Niveau d'Études</span>
              </div>
              <p className="text-stone-800 font-medium">{profile.education}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-2 text-stone-500 font-semibold">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Origine Culturelle & Langues</span>
              </div>
              <p className="text-stone-800 font-medium">
                {profile.culturalBackground} · {profile.languages.join(', ')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-2 text-stone-500 font-semibold">
                <Heart className="w-4 h-4 text-emerald-700" />
                <span>Enfants & Foyer</span>
              </div>
              <p className="text-stone-800 font-medium">
                {profile.hasChildren ? `A des enfants (${profile.childrenCount || 1})` : 'Pas d\'enfants'}
                {profile.wantsChildren ? ' · Désire des enfants' : ' · Ne souhaite pas d\'enfants'}
              </p>
            </div>
          </div>

          {/* Wali / Guardian Card (The key cultural & payment gate) */}
          <div className={`p-5 rounded-2xl border transition-all ${
            profile.contactUnlocked
              ? 'bg-emerald-50/70 border-emerald-300'
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {profile.contactUnlocked ? (
                    <Unlock className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-700" />
                  )}
                  <h4 className="text-sm font-bold text-stone-900">
                    Contact du Tuteur (Wali) : {profile.wali.relationship}
                  </h4>
                </div>

                {profile.contactUnlocked ? (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-stone-700">
                      Représentant : <strong>{profile.wali.pseudonym}</strong>
                    </p>
                    <div className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-950 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      <span>{profile.wali.phone}</span>
                    </div>
                    {profile.wali.notes && (
                      <p className="text-[11px] text-stone-600 italic">
                        Note du tuteur : {profile.wali.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-stone-700 leading-relaxed pt-1">
                    Conformément à la bienséance islamique au Niger, les coordonnées du tuteur et la messagerie instantanée sont protégées. Débloquez la mise en contact sécurisée via <strong>My Nita</strong> ou <strong>Amanata</strong> au <strong>+227 99 61 40 98</strong> (Participation modique de 2 000 FCFA).
                  </p>
                )}
              </div>
            </div>

            {/* Unlock or Chat Action CTA */}
            <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-wrap gap-3 items-center justify-between">
              {profile.contactUnlocked ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onStartChat(profile)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ouvrir la Messagerie Chiffrée (E2EE)</span>
                  </button>
                  <a
                    href={`tel:${profile.wali.phone.replace(/\s+/g, '')}`}
                    className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Appeler</span>
                  </a>
                  {onOpenGmail && (
                    <button
                      type="button"
                      onClick={() => onOpenGmail(profile)}
                      className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Email (Gmail)</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onUnlockContact(profile)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Débloquer le Contact (2 000 FCFA - My Nita / Amanata)</span>
                </button>
              )}

              <span className="text-[11px] text-stone-500">
                Paiement direct sécurisé au +227 99 61 40 98
              </span>
            </div>
          </div>

          {/* Privacy & RGPD Notice */}
          <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
            <span>Données confidentielles protégées par chiffrement et conformes RGPD Niger.</span>
            <span className="text-stone-400">ID: {profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
