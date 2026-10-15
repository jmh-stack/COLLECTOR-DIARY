export type ThemeCategory = 'apparel' | 'watch' | 'plant' | 'gacha' | 'vintage' | string;

export interface UserProfile {
  name: string;
  email: string;
  tag: string;
  bio: string;
  avatarIcon: string;
  avatarColor: string;
}

export interface CollectorTheme {
  id: string;
  name: string;
  icon: string;
  monthlyBudget: number;
  targetRecoveryRate: number;
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
  linkedVaultItemId?: string; // Linked vault item ID
}

export type VaultItemStatus = 'keeping' | 'selling' | 'permanent' | 'sold';

export interface VaultItem {
  id: string;
  themeId: string;
  name: string;
  brand: string;
  imageUrl: string;
  purchasePrice: number;
  purchaseDate: string;
  wearCount: number;
  status: VaultItemStatus;
  estimatedResalePrice: number;
  category: string;
  notes?: string;
  linkedTransactionId?: string; // Linked purchase transaction ID
  resaleTransactionId?: string; // Linked resale transaction ID
  actualResalePrice?: number;
  resaleDate?: string;
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
