export type ThemeCategory = 'apparel' | 'watch' | 'plant' | 'gacha' | 'vintage' | string;

export interface UserProfile {
  name: string;
  email: string;
  tag: string; // e.g. "스마트 컬렉터"
  bio: string; // e.g. "방출과 영입의 자금 순환을 실천하는 수집 생활"
  avatarIcon: string;
  avatarColor: string;
}

export interface CollectorTheme {
  id: string;
  name: string;
  icon: string; // Material symbol or Lucide icon name
  monthlyBudget: number;
  targetRecoveryRate: number; // e.g. 80%
  description: string;
}

export type TransactionType = 'resale' | 'purchase' | 'care';

export interface Transaction {
  id: string;
  themeId: string;
  month: string; // "YYYY-MM"
  type: TransactionType;
  title: string;
  amount: number; // positive for resale, negative for purchase/care
  date: string; // "YY.MM.DD"
  channel: string;
  badges: string[];
  subtext: string;
  imageUrl?: string;
  categoryTag?: string;
  notes?: string;
  originalPurchasePrice?: number;
  daysToSell?: number;
}

export interface VaultItem {
  id: string;
  themeId: string;
  name: string;
  brand: string;
  imageUrl: string;
  purchasePrice: number;
  purchaseDate: string;
  wearCount: number;
  status: 'keeping' | 'selling' | 'permanent';
  estimatedResalePrice: number;
  category: string;
  notes?: string;
}

export interface WishlistItem {
  id: string;
  themeId: string;
  name: string;
  brand: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
  imageUrl: string;
  linkedVaultItemIds?: string[];
  targetMonth?: string;
  notes?: string;
}

export interface ThemeMetrics {
  costPerWear: number;
  costPerWearStatus: string;
  avgDepreciationRate: number;
  avgDepreciationStatus: string;
  avgDaysToSell: number;
  avgDaysToSellStatus: string;
  reportTitle: string;
  reportDefenseStatus: string;
  reportContent: string;
}
