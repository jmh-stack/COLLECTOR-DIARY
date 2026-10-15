import { CollectorTheme, Transaction, VaultItem, WishlistItem, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '컬렉터',
  email: '',
  tag: '스마트 컬렉터',
  bio: '불필요한 지출은 줄이고 방출과 영입의 자금 순환을 관리합니다.',
  avatarIcon: 'person',
  avatarColor: '#a78bfa',
};

export const INITIAL_THEMES: CollectorTheme[] = [
  {
    id: 'apparel',
    name: '의류',
    icon: 'checkroom',
    monthlyBudget: 1000000,
    targetRecoveryRate: 80,
    description: '디자이너 및 아카이브 의류 순환 관리'
  },
  {
    id: 'watch',
    name: '시계',
    icon: 'watch',
    monthlyBudget: 2000000,
    targetRecoveryRate: 85,
    description: '타임피스 및 스트랩 컬렉션 관리'
  },
  {
    id: 'plant',
    name: '식물',
    icon: 'potted_plant',
    monthlyBudget: 300000,
    targetRecoveryRate: 60,
    description: '희귀 관엽 식물 및 화분 케어'
  },
  {
    id: 'gacha',
    name: '가챠',
    icon: 'casino',
    monthlyBudget: 200000,
    targetRecoveryRate: 70,
    description: '아트토이, 피규어 및 굿즈'
  },
  {
    id: 'vintage',
    name: '빈티지',
    icon: 'radio',
    monthlyBudget: 500000,
    targetRecoveryRate: 75,
    description: '빈티지 가구, 오디오 및 소품'
  }
];

// All dummy transaction/vault/wishlist data removed as requested by user
export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_VAULT_ITEMS: VaultItem[] = [];

export const INITIAL_WISHLISTS: WishlistItem[] = [];
