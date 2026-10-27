export type NigerRegion = 
  | 'Niamey'
  | 'Maradi'
  | 'Zinder'
  | 'Tahoua'
  | 'Agadez'
  | 'Tillabéri'
  | 'Dosso'
  | 'Diffa';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city: NigerRegion;
  district?: string;
}

export interface ReviewCriteria {
  seriousness: number;    // Sérieux dans la démarche de mariage (1-5)
  respect: number;        // Respect des convenances & valeurs (1-5)
  authenticity: number;   // Fidélité aux informations du profil (1-5)
}

export interface ProfileReview {
  id: string;
  authorPseudonym: string;
  date: string;
  rating: number; // 1 to 5
  criteria: ReviewCriteria;
  comment: string;
  verifiedReviewer: boolean;
}

export interface WaliContact {
  relationship: string; // Ex: Père, Frère aîné, Oncle paternel, Tuteur légal
  pseudonym: string;
  phone: string;
  isUnlocked: boolean;
  notes?: string;
}

export interface Profile {
  id: string;
  pseudonym: string;
  gender: 'female' | 'male';
  age: number;
  region: NigerRegion;
  district: string; // Ex: Koira Kano, Plateau, Sabon Gari
  coordinates: LocationCoordinates;
  photoUrl: string;
  bio: string;
  occupation: string;
  education: string;
  religiousPractice: string; // Ex: Pratiquant assidu, Prière à la mosquée, Mémorisation Coran
  maritalStatus: 'Célibataire' | 'Divorcé(e)' | 'Veuf/Veuve';
  hasChildren: boolean;
  childrenCount?: number;
  wantsChildren: boolean;
  culturalBackground: string; // Ex: Haoussa, Zarma-Songhaï, Peul, Touareg, Kanouri
  languages: string[];
  wali: WaliContact;
  isVerified: boolean;
  verificationBadgeDate?: string;
  contactUnlocked: boolean; // Unlocked via My Nita or Amanata (+227 99 61 40 98)
  averageRating: number;
  reviewsCount: number;
  reviews: ProfileReview[];
  privacySettings: {
    hideRealtimeLocation: boolean;
    locationAccuracy: 'exact' | 'city' | 'hidden';
    onlyVerifiedCanView: boolean;
    photoPrivacyMode: 'public' | 'blurred_until_request';
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isE2EE: boolean;
  encryptedSnippet?: string;
  securityFingerprint?: string;
}

export interface PaymentTransaction {
  id: string;
  profileId: string;
  profileName: string;
  method: 'My Nita' | 'Amanata';
  amountFcfa: number;
  officialRecipientPhone: string; // +227 99 61 40 98
  senderPhone: string;
  transactionRef: string;
  timestamp: string;
  status: 'pending' | 'verified';
}

export interface UserAccount {
  id: string;
  pseudonym: string;
  phone: string;
  gender: 'female' | 'male';
  region: NigerRegion;
  isVerified: boolean;
  is2FAEnabled: boolean;
  is2FAVerified: boolean;
  privacy: {
    hideRealtimeLocation: boolean;
    locationAccuracy: 'exact' | 'city' | 'hidden';
    onlyVerifiedCanView: boolean;
  };
  pushNotificationsEnabled: boolean;
}
