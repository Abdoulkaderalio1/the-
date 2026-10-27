import React, { useState } from 'react';
import { X, Star, ShieldCheck, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Profile, ProfileReview, ReviewCriteria } from '../types';

interface RatingsReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onAddReview: (profileId: string, review: ProfileReview) => void;
}

export const RatingsReviewsModal: React.FC<RatingsReviewsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'write'>('view');
  const [rating, setRating] = useState(5);
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    seriousness: 5,
    respect: 5,
    authenticity: 5,
  });
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: ProfileReview = {
      id: `rev-${Date.now()}`,
      authorPseudonym: 'Membre Vérifié',
      date: new Date().toLocaleDateString('fr-FR'),
      rating,
      criteria,
      comment: comment.trim(),
      verifiedReviewer: true,
    };

    onAddReview(profile.id, newRev);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('view');
      setComment('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <h3 className="text-base font-bold text-stone-900">
              Avis & Notations Vérifiés
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
            onClick={() => setActiveTab('view')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'view'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Consulter les avis ({profile.reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'write'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Laisser une évaluation
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
          {/* Summary Box */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div>
              <div className="text-xs text-stone-500 font-medium">Profil évalué :</div>
              <div className="text-sm font-bold text-stone-900">{profile.pseudonym}</div>
              <div className="text-[11px] text-stone-500">{profile.region} · Nikah</div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-stone-900 flex items-center justify-end gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{profile.averageRating.toFixed(1)}</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Sur 5 ({profile.reviewsCount} avis)
              </div>
            </div>
          </div>

          {activeTab === 'view' ? (
            <div className="space-y-4">
              {profile.reviews.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  Aucun avis pour le moment. Soyez le premier à échanger avec ce profil.
                </div>
              ) : (
                profile.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-stone-200/80 bg-white space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900">
                          {rev.authorPseudonym}
                        </span>
                        {rev.verifiedReviewer && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      « {rev.comment} »
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                      <span>Sérieux : {rev.criteria.seriousness}/5 · Respect : {rev.criteria.respect}/5</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))
              )}

              {/* Confidentiality notice */}
              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Tous les avis sont anonymisés afin de préserver l'intimité et la réputation des familles nigériennes.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submittedSuccess ? (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-900">
                    Votre avis a été enregistré avec succès !
                  </h4>
                  <p className="text-xs text-stone-500">
                    Merci de contribuer à la sécurité et la sérénité de la communauté.
                  </p>
                </div>
              ) : (
                <>
                  {/* Global Note */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Note globale
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRating(val)}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              val <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-stone-700 ml-2">
                        {rating} / 5 étoiles
                      </span>
                    </div>
                  </div>

                  {/* Criteria Sliders */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs text-stone-600 mb-1">
                        <span>Sérieux dans le projet de Nikah :</span>
                        <span className="font-bold">{criteria.seriousness}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={criteria.seriousness}
                        onChange={(e) =>
                          setCriteria({ ...criteria, seriousness: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-800"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-600 mb-1">
                        <span>Respect des convenances & politesse :</span>
                        <span className="font-bold">{criteria.respect}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={criteria.respect}
                        onChange={(e) =>
                          setCriteria({ ...criteria, respect: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-800"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-600 mb-1">
                        <span>Exactitude des informations déclarées :</span>
                        <span className="font-bold">{criteria.authenticity}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={criteria.authenticity}
                        onChange={(e) =>
                          setCriteria({ ...criteria, authenticity: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Votre commentaire respectueux
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ex: Échanges très dignes et bienveillants, démarche sincère pour le mariage..."
                      required
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    Publier l'évaluation anonymisée
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
