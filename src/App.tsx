import React, { useState, useEffect } from 'react';
import { 
  Heart, ShieldCheck, MapPin, MessageCircle, BarChart3, Lock,
  Smartphone, Filter, Star, CheckCircle2, Bell, AlertCircle, RefreshCw, Mail
} from 'lucide-react';
import { Profile, NigerRegion, ChatMessage, PaymentTransaction, UserAccount, ProfileReview } from './types';
import { INITIAL_PROFILES } from './data/mockProfiles';
import { calculateDistanceKm } from './utils/geo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { GeoMapFilter } from './components/GeoMapFilter';
import { VerificationModal } from './components/VerificationModal';
import { PaymentModal } from './components/PaymentModal';
import { ChatInterface } from './components/ChatInterface';
import { RatingsReviewsModal } from './components/RatingsReviewsModal';
import { PrivacyAnd2FAModal } from './components/PrivacyAnd2FAModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdminWhatsAppBanner } from './components/AdminWhatsAppBanner';
import { OfflineBanner } from './components/OfflineBanner';
import { GmailNotificationCenter } from './components/GmailNotificationCenter';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'profiles' | 'map' | 'messages' | 'verification' | 'analytics' | 'gmail'>('profiles');

  // User Account & Privacy State
  const [userAccount, setUserAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('nikah_user_account');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      id: 'user-current',
      pseudonym: 'Chercheur Nikah Niger',
      phone: '+227 99 61 40 98',
      gender: 'male',
      region: 'Niamey',
      isVerified: false,
      is2FAEnabled: false,
      is2FAVerified: false,
      privacy: {
        hideRealtimeLocation: false,
        locationAccuracy: 'city',
        onlyVerifiedCanView: false,
      },
      pushNotificationsEnabled: true,
    };
  });

  // Profiles Database
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('nikah_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PROFILES;
  });

  // User Current Location Coordinates (Default: Niamey Center)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; city: NigerRegion }>({
    latitude: 13.5116,
    longitude: 2.1254,
    city: 'Niamey',
  });

  // Filters
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | NigerRegion>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState(500);

  // Active Modals & Selection
  const [selectedProfileForDetail, setSelectedProfileForDetail] = useState<Profile | null>(null);
  const [selectedProfileForPayment, setSelectedProfileForPayment] = useState<Profile | null>(null);
  const [selectedProfileForReviews, setSelectedProfileForReviews] = useState<Profile | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPrivacy2FAOpen, setIsPrivacy2FAOpen] = useState(false);

  // Messaging State (Conversations stored by profile ID)
  const [activeChatProfileId, setActiveChatProfileId] = useState<string>('nikah-p1');
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('nikah_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      'nikah-p1': [
        {
          id: 'm1',
          conversationId: 'nikah-p1',
          senderId: 'nikah-p1',
          text: 'Salam Aleykoum. Bienvenue sur mon profil pour le Nikah. N\'hésitez pas si vous avez des questions sur mon parcours ou la démarche avec mon tuteur.',
          timestamp: '10:45',
          status: 'read',
          isE2EE: true,
        },
      ],
    };
  });

  // Push notifications in-app toast
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Offline and auto-sync state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<string[]>([]);

  // Persist account & profiles
  useEffect(() => {
    localStorage.setItem('nikah_user_account', JSON.stringify(userAccount));
  }, [userAccount]);

  useEffect(() => {
    localStorage.setItem('nikah_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('nikah_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Show push notification helper
  const triggerNotification = (title: string, body: string) => {
    setToastNotification(`${title} : ${body}`);
    setTimeout(() => setToastNotification(null), 5000);

    if (userAccount.pushNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback to in-app toast
      }
    }
  };

  // Payment Success Handler
  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === tx.profileId) {
          return {
            ...p,
            contactUnlocked: true,
            wali: { ...p.wali, isUnlocked: true },
          };
        }
        return p;
      })
    );

    setSelectedProfileForPayment(null);
    triggerNotification(
      "Mise en relation débloquée !",
      `Paiement My Nita/Amanata validé pour ${tx.profileName}. Coordonnées du tuteur et messagerie chiffrée accessibles.`
    );

    // Switch to chat with this profile
    setActiveChatProfileId(tx.profileId);
    setActiveTab('messages');
  };

  // Verification Success
  const handleVerificationSuccess = () => {
    setUserAccount((prev) => ({ ...prev, isVerified: true }));
    triggerNotification(
      "Profil Certifié Nikah",
      "Félicitations ! Votre vérification par selfie en direct a été approuvée par l'administration."
    );
  };

  // Send Chat Message
  const handleSendMessage = (text: string) => {
    const activeProf = profiles.find((p) => p.id === activeChatProfileId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeChatProfileId,
      senderId: 'user-current',
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      isE2EE: true,
    };

    setConversations((prev) => ({
      ...prev,
      [activeChatProfileId]: [...(prev[activeChatProfileId] || []), newMsg],
    }));

    if (isOffline) {
      setPendingSyncQueue((prev) => [...prev, `Message chiffré vers ${activeProf?.pseudonym}`]);
    }

    // Simulate polite reply after short delay
    setTimeout(() => {
      const replies = [
        "Wa Aleykoum Salam. Qu'Allah bénisse cette démarche sincère. Mon tuteur a été informé de notre premier échange.",
        "Merci pour votre message respectueux. Je partage pleinement cette vision d'un foyer pieux et serein.",
        "Alhamdulillah. Nous pouvons convenir d'un entretien téléphonique supervisé avec mon tuteur (Wali).",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        conversationId: activeChatProfileId,
        senderId: activeChatProfileId,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        isE2EE: true,
      };

      setConversations((prev) => ({
        ...prev,
        [activeChatProfileId]: [...(prev[activeChatProfileId] || []), replyMsg],
      }));

      triggerNotification(
        `Nouveau message de ${activeProf?.pseudonym || 'Correspondant'}`,
        randomReply
      );
    }, 2200);
  };

  // Add Review
  const handleAddReview = (profileId: string, review: ProfileReview) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          const updatedReviews = [review, ...p.reviews];
          const newAvg =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            averageRating: Math.round(newAvg * 10) / 10,
          };
        }
        return p;
      })
    );
  };

  // Export User Data (RGPD)
  const handleExportData = () => {
    const exportBundle = {
      app: 'Le Chemin pour le Nikah - Niger',
      exportDate: new Date().toISOString(),
      account: userAccount,
      conversations,
      timestamp: Date.now(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mes_donnees_nikah_niger.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Delete User Data (RGPD Right to be forgotten)
  const handleDeleteAccountData = () => {
    if (window.confirm("Êtes-vous certain de vouloir supprimer définitivement votre compte et effacer toutes vos données chiffrées ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Filtered Profiles computation
  const filteredProfiles = profiles.filter((p) => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (regionFilter !== 'all' && p.region !== regionFilter) return false;
    if (onlyVerified && !p.isVerified) return false;

    // Distance calculation
    const dist = calculateDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      p.coordinates.latitude,
      p.coordinates.longitude
    );
    if (dist > maxDistanceKm) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchOcc = p.occupation.toLowerCase().includes(q);
      const matchCult = p.culturalBackground.toLowerCase().includes(q);
      const matchRel = p.religiousPractice.toLowerCase().includes(q);
      const matchName = p.pseudonym.toLowerCase().includes(q);
      if (!matchBio && !matchOcc && !matchCult && !matchRel && !matchName) return false;
    }

    return true;
  });

  const activeChatProfile = profiles.find((p) => p.id === activeChatProfileId) || profiles[0];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Offline Status & Auto-Sync Banner */}
      <OfflineBanner
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        pendingSyncCount={pendingSyncQueue.length}
        onSyncNow={() => setPendingSyncQueue([])}
      />

      {/* Push Notification In-App Toast */}
      {toastNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 animate-bounce">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-amber-300">Alerte Nikah Niger</div>
            <p className="text-stone-200 mt-0.5 leading-snug">{toastNotification}</p>
          </div>
        </div>
      )}

      {/* Top Bar Navigation (Contract Compliant) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPrivacy2FA={() => setIsPrivacy2FAOpen(true)}
        is2FAEnabled={userAccount.is2FAEnabled}
        unreadCount={1}
        userVerified={userAccount.isVerified}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'profiles' && (
          <div>
            {/* Hero Section with Search Filters & Adjacency Proof */}
            <HeroSection
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              regionFilter={regionFilter}
              setRegionFilter={setRegionFilter}
              onlyVerified={onlyVerified}
              setOnlyVerified={setOnlyVerified}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenVerification={() => setIsVerificationModalOpen(true)}
            />

            {/* Profiles Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <span>Profils Célibataires Disponibles pour le Nikah</span>
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {filteredProfiles.length}
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Classés par proximité et respect des critères islamiques au Niger.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('map')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Vue Carte & Distance ({userLocation.city})</span>
                  </button>
                </div>
              </div>

              {filteredProfiles.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Aucun profil ne correspond à vos filtres actuels
                  </h3>
                  <p className="text-xs text-stone-500">
                    Essayez d'élargir le rayon géographique ou de sélectionner "Tout le Niger".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGenderFilter('all');
                      setRegionFilter('all');
                      setOnlyVerified(false);
                      setSearchQuery('');
                      setMaxDistanceKm(500);
                    }}
                    className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((p) => {
                    const dist = calculateDistanceKm(
                      userLocation.latitude,
                      userLocation.longitude,
                      p.coordinates.latitude,
                      p.coordinates.longitude
                    );

                    return (
                      <ProfileCard
                        key={p.id}
                        profile={p}
                        userDistanceKm={dist}
                        userIsVerified={userAccount.isVerified}
                        onSelect={(profile) => setSelectedProfileForDetail(profile)}
                        onInitiateContact={(profile) => {
                          if (profile.contactUnlocked) {
                            setActiveChatProfileId(profile.id);
                            setActiveTab('messages');
                          } else {
                            setSelectedProfileForPayment(profile);
                          }
                        }}
                        onOpenReviews={(profile) => setSelectedProfileForReviews(profile)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GeoMapFilter
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              locationPrivacy={userAccount.privacy.locationAccuracy}
              setLocationPrivacy={(acc) =>
                setUserAccount((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, locationAccuracy: acc, hideRealtimeLocation: acc === 'hidden' },
                }))
              }
              selectedRegion={regionFilter}
              setSelectedRegion={setRegionFilter}
              maxDistanceKm={maxDistanceKm}
              setMaxDistanceKm={setMaxDistanceKm}
              profiles={profiles}
              onSelectProfile={(profile) => setSelectedProfileForDetail(profile)}
            />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Conversations List sidebar */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-800" />
                    <span>Discussions Sécurisées E2EE</span>
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {profiles.filter((p) => p.contactUnlocked).length} active(s)
                  </span>
                </div>

                <div className="space-y-2">
                  {profiles.map((p) => {
                    const isSelected = p.id === activeChatProfileId;
                    const lastMsg = conversations[p.id]?.slice(-1)[0];

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (p.contactUnlocked) {
                            setActiveChatProfileId(p.id);
                          } else {
                            setSelectedProfileForPayment(p);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-800 bg-emerald-50/70 shadow-xs'
                            : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={p.photoUrl}
                            alt={p.pseudonym}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          {p.contactUnlocked && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-600 border-2 border-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 truncate">
                              {p.pseudonym}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {lastMsg?.timestamp || ''}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {p.contactUnlocked
                              ? lastMsg?.text || 'Débuter l\'échange chiffré...'
                              : '🔒 Débloquer le contact (2 000 FCFA)'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Chat Conversation */}
              <div className="lg:col-span-8">
                {activeChatProfile.contactUnlocked ? (
                  <ChatInterface
                    activeProfile={activeChatProfile}
                    messages={conversations[activeChatProfile.id] || []}
                    onSendMessage={handleSendMessage}
                    onOpenWaliDetails={(profile) => setSelectedProfileForDetail(profile)}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-sm text-center max-w-md mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900">
                      Mise en contact avec {activeChatProfile.pseudonym}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Conformément aux directives matrimoniales, la messagerie chiffrée de bout en bout et les coordonnées du tuteur sont accessibles après acquittement de la participation aux frais de mise en relation (2 000 FCFA via <strong>My Nita</strong> ou <strong>Amanata</strong> au <strong>+227 99 61 40 98</strong>).
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedProfileForPayment(activeChatProfile)}
                      className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                    >
                      Débloquer via My Nita / Amanata
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-800" />
                    <span>Système de Vérification des Profils par Photo</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Authenticité absolue, protection des sœurs et des frères contre les faux profils.
                  </p>
                </div>

                {userAccount.isVerified ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Votre compte est 100% Certifié</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
                  >
                    Démarrer ma vérification selfie
                  </button>
                )}
              </div>

              {/* Explanation & Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">Selfie Dynamique en Direct</h3>
                  <p className="leading-relaxed text-stone-600">
                    Une photo prise instantanément avec geste aléatoire afin d'empêcher l'utilisation d'images volées sur les réseaux sociaux.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">Contrôle de Résidence & Âge</h3>
                  <p className="leading-relaxed text-stone-600">
                    Vérification de concordance avec la région déclarée au Niger (Niamey, Maradi, Zinder...) et l'âge indiqué.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">Délivrance du Badge Certifié</h3>
                  <p className="leading-relaxed text-stone-600">
                    Le profil reçoit le badge vert officiel "Certifié Nikah Niger" et accède aux profils confidentiels des familles.
                  </p>
                </div>
              </div>

              {/* Start Verification Action Card */}
              <div className="p-6 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-amber-300">
                    Rejoignez les 92% de profils certifiés au Niger
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 max-w-lg">
                    Processus gratuit, rapide en moins de 2 minutes et strictement confidentiel. Vos clichés de vérification ne sont jamais divulgués.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                >
                  {userAccount.isVerified ? 'Refaire la vérification' : 'Lancer la vérification maintenant'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnalyticsDashboard />
          </div>
        )}

        {activeTab === 'gmail' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GmailNotificationCenter
              profiles={profiles}
              onNotifyToast={triggerNotification}
            />
          </div>
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Navigation (Pattern 1 from Mobile touch guideline) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 grid grid-cols-6 items-center h-16 pb-safe">
        <button
          type="button"
          onClick={() => setActiveTab('profiles')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activeTab === 'profiles' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-[9px] mt-1">Découvrir</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activeTab === 'map' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[9px] mt-1">Carte</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer relative ${
            activeTab === 'messages' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[9px] mt-1">Chat E2EE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activeTab === 'verification' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] mt-1">Vérif</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activeTab === 'analytics' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[9px] mt-1">Bilan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gmail')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer ${
            activeTab === 'gmail' ? 'text-emerald-900 font-bold' : 'text-stone-500'
          }`}
        >
          <Mail className="w-4 h-4 text-red-600" />
          <span className="text-[9px] mt-1">Gmail</span>
        </button>
      </nav>

      {/* Modals & Dialogs */}
      <ProfileDetailModal
        profile={selectedProfileForDetail}
        onClose={() => setSelectedProfileForDetail(null)}
        onUnlockContact={(profile) => {
          setSelectedProfileForDetail(null);
          setSelectedProfileForPayment(profile);
        }}
        onStartChat={(profile) => {
          setSelectedProfileForDetail(null);
          setActiveChatProfileId(profile.id);
          setActiveTab('messages');
        }}
        onOpenReviews={(profile) => {
          setSelectedProfileForDetail(null);
          setSelectedProfileForReviews(profile);
        }}
        onOpenGmail={(_profile) => {
          setSelectedProfileForDetail(null);
          setActiveTab('gmail');
        }}
        userDistanceKm={
          selectedProfileForDetail
            ? calculateDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                selectedProfileForDetail.coordinates.latitude,
                selectedProfileForDetail.coordinates.longitude
              )
            : undefined
        }
      />

      <PaymentModal
        isOpen={!!selectedProfileForPayment}
        onClose={() => setSelectedProfileForPayment(null)}
        profile={selectedProfileForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerifiedSuccess={handleVerificationSuccess}
        userAlreadyVerified={userAccount.isVerified}
      />

      <RatingsReviewsModal
        isOpen={!!selectedProfileForReviews}
        onClose={() => setSelectedProfileForReviews(null)}
        profile={selectedProfileForReviews}
        onAddReview={handleAddReview}
      />

      <PrivacyAnd2FAModal
        isOpen={isPrivacy2FAOpen}
        onClose={() => setIsPrivacy2FAOpen(false)}
        userAccount={userAccount}
        onUpdateAccount={(updated) => setUserAccount((prev) => ({ ...prev, ...updated }))}
        onExportData={handleExportData}
        onDeleteAccountData={handleDeleteAccountData}
      />

      {/* Floating Admin WhatsApp Business (+227 99 66 40 98) */}
      <AdminWhatsAppBanner />

      {/* Minimalist Respectful Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center font-serif-cultural text-xs font-bold">
              ن
            </span>
            <span className="font-bold text-stone-200">
              Le Chemin pour le Nikah · République du Niger
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Paiement My Nita / Amanata : +227 99 61 40 98</span>
            <span aria-hidden="true">·</span>
            <span>Admin WhatsApp : +227 99 66 40 98</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPrivacy2FAOpen(true)}
              className="text-stone-300 hover:text-white cursor-pointer underline"
            >
              Conformité RGPD
            </button>
          </div>

          <div className="text-stone-400 text-[11px]">
            © {new Date().getFullYear()} Le Chemin pour le Nikah. Foyer pieux & respectueux.
          </div>
        </div>
      </footer>
    </div>
  );
}
