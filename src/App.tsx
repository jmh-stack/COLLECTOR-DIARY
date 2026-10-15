/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CollectorTheme, Transaction, VaultItem, WishlistItem, ThemeMetrics, UserProfile } from './types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_THEMES,
  INITIAL_TRANSACTIONS,
  INITIAL_VAULT_ITEMS,
  INITIAL_WISHLISTS,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { LedgerTab } from './components/LedgerTab';
import { VaultTab } from './components/VaultTab';
import { WishlistTab } from './components/WishlistTab';
import { ThemesTab } from './components/ThemesTab';

// Modals
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { SettlementAnalysisModal } from './components/modals/SettlementAnalysisModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { AddItemModal } from './components/modals/AddItemModal';
import { AddWishlistModal } from './components/modals/AddWishlistModal';
import { AddThemeModal } from './components/modals/AddThemeModal';
import { FilterSearchModal } from './components/modals/FilterSearchModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { MetricsDetailModal } from './components/modals/MetricsDetailModal';
import { VaultItemDetailModal } from './components/modals/VaultItemDetailModal';

// Clear old dummy data for existing users once to ensure 100% pristine state
const STORAGE_CLEAN_VERSION_KEY = 'collector_clean_v3';
try {
  if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_CLEAN_VERSION_KEY) !== 'true') {
    localStorage.removeItem('collector_transactions');
    localStorage.removeItem('collector_vault');
    localStorage.removeItem('collector_wishlist');
    localStorage.setItem(STORAGE_CLEAN_VERSION_KEY, 'true');
  }
} catch (e) {
  console.warn('Storage check warning', e);
}

export default function App() {
  // User Profile State (Stored locally per user browser)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('collector_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // Themes State
  const [themes, setThemes] = useState<CollectorTheme[]>(() => {
    try {
      const saved = localStorage.getItem('collector_themes');
      return saved ? JSON.parse(saved) : INITIAL_THEMES;
    } catch {
      return INITIAL_THEMES;
    }
  });

  const [activeThemeId, setActiveThemeId] = useState<string>('apparel');
  const [currentTab, setCurrentTab] = useState<NavTab>('ledger');

  // Month navigation: default to current year-month
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Transactions State (Empty by default, stored locally)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('collector_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Vault Items State (Empty by default, stored locally)
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('collector_vault');
      return saved ? JSON.parse(saved) : INITIAL_VAULT_ITEMS;
    } catch {
      return INITIAL_VAULT_ITEMS;
    }
  });

  // Wishlist State (Empty by default, stored locally)
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('collector_wishlist');
      return saved ? JSON.parse(saved) : INITIAL_WISHLISTS;
    } catch {
      return INITIAL_WISHLISTS;
    }
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [selectedChannel, setSelectedChannel] = useState('');

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddWishlistOpen, setIsAddWishlistOpen] = useState(false);
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMetricsDetailOpen, setIsMetricsDetailOpen] = useState(false);

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(null);
  const [prefilledTx, setPrefilledTx] = useState<Partial<Transaction> | undefined>(undefined);

  // Sync to local browser storage
  useEffect(() => {
    try {
      localStorage.setItem('collector_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('collector_themes', JSON.stringify(themes));
      localStorage.setItem('collector_transactions', JSON.stringify(transactions));
      localStorage.setItem('collector_vault', JSON.stringify(vaultItems));
      localStorage.setItem('collector_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [userProfile, themes, transactions, vaultItems, wishlist]);

  // Active theme object
  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0] || INITIAL_THEMES[0];

  // Dynamic Metrics computed purely from real user data
  const calculateRealMetrics = (themeId: string, themeName: string): ThemeMetrics => {
    const themeVault = vaultItems.filter((i) => i.themeId === themeId);
    const themeTx = transactions.filter((t) => t.themeId === themeId);

    // 1. 회당 착용 원가
    const totalWears = themeVault.reduce((acc, i) => acc + (i.wearCount || 0), 0);
    const totalVaultVal = themeVault.reduce((acc, i) => acc + i.purchasePrice, 0);
    const costPerWear = totalWears > 0 ? Math.round(totalVaultVal / totalWears) : 0;

    // 2. 평균 방출 감가율
    const resaleTx = themeTx.filter((t) => t.type === 'resale');
    const withOrig = resaleTx.filter((t) => t.originalPurchasePrice && t.originalPurchasePrice > 0);
    let avgDeprec = 0;
    if (withOrig.length > 0) {
      const sum = withOrig.reduce((acc, t) => {
        const diff = (t.originalPurchasePrice || 0) - t.amount;
        return acc + (diff > 0 ? (diff / t.originalPurchasePrice!) * 100 : 0);
      }, 0);
      avgDeprec = Math.round((sum / withOrig.length) * 10) / 10;
    }

    // 3. 중고 매각 소요일
    const withDays = resaleTx.filter((t) => t.daysToSell && t.daysToSell > 0);
    const avgDays =
      withDays.length > 0
        ? Math.round((withDays.reduce((acc, t) => acc + t.daysToSell!, 0) / withDays.length) * 10) / 10
        : 0;

    // Report
    const expenseTx = themeTx.filter((t) => t.type === 'purchase' || t.type === 'care');
    const totalResale = resaleTx.reduce((acc, t) => acc + Math.max(0, t.amount), 0);
    const totalExpense = expenseTx.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const recoveryRate = totalExpense > 0 ? Math.round((totalResale / totalExpense) * 1000) / 10 : 0;

    if (themeTx.length === 0 && themeVault.length === 0) {
      return {
        costPerWear: 0,
        costPerWearStatus: '보관함 등록 필요',
        avgDepreciationRate: 0,
        avgDepreciationStatus: '방출 내역 필요',
        avgDaysToSell: 0,
        avgDaysToSellStatus: '매각 내역 필요',
        reportTitle: `${themeName} 컬렉션 순환 리포트`,
        reportDefenseStatus: '기록 대기',
        reportContent: `${themeName} 카테고리에 첫 거래나 소장품을 등록해보세요. 방출 및 영입 내역을 바탕으로 유동성과 감가 방어율이 실시간으로 자동 산출됩니다.`,
      };
    }

    const spaceName =
      themeId === 'apparel'
        ? '옷장 공간'
        : themeId === 'watch'
        ? '보관함 공간'
        : themeId === 'plant'
        ? '온실/베란다 공간'
        : themeId === 'gacha'
        ? '진열장 공간'
        : themeId === 'vintage'
        ? '실내 공간'
        : '보관 공간';

    const wearFrequencyStatus =
      themeId === 'plant'
        ? costPerWear > 0
          ? '소장 관리 안정'
          : '관리 기록 필요'
        : themeId === 'gacha'
        ? costPerWear > 0
          ? '전시 소장 우수'
          : '소장 기록 필요'
        : costPerWear > 0
        ? costPerWear <= 10000
          ? '실착 빈도 우수'
          : '적정 활용 중'
        : '사용/착용 기록 필요';

    return {
      costPerWear,
      costPerWearStatus: wearFrequencyStatus,
      avgDepreciationRate: avgDeprec,
      avgDepreciationStatus: avgDeprec > 0 ? (avgDeprec < 30 ? '감가 방어 양호' : '보통 감가') : '데이터 집계 중',
      avgDaysToSell: avgDays,
      avgDaysToSellStatus: avgDays > 0 ? (avgDays <= 5 ? '신속 정리' : '일반 소요일') : '데이터 집계 중',
      reportTitle: `${themeName} 컬렉션 회전율 분석 리포트`,
      reportDefenseStatus: recoveryRate >= 70 ? '방어율 양호' : '순환 관리 중',
      reportContent:
        totalResale > 0
          ? `방출 ${resaleTx.length}건으로 신규 지출의 ${recoveryRate}%를 충당했습니다. ${spaceName} 부담 없이 스마트한 순환 컬렉팅이 유지되고 있습니다.`
          : `현재 누적 지출 ${totalExpense.toLocaleString()}원이 기록되었습니다. 미사용 소장품을 방출하여 순환 자금을 회수해보세요.`,
    };
  };

  const activeMetrics = calculateRealMetrics(activeTheme.id, activeTheme.name);

  // Month navigation
  const handleChangeMonth = (delta: number) => {
    const [y, m] = currentMonth.split('-').map(Number);
    let newM = m + delta;
    let newY = y;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    } else if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setCurrentMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };

  // Add Transaction with full bidirectional synchronization to Vault
  const handleAddTransaction = (
    newTx: Omit<Transaction, 'id'>,
    options?: { syncToVault?: boolean; selectedVaultItemId?: string }
  ) => {
    const timestamp = Date.now();
    const txId = `tx-${timestamp}`;
    const syncToVault = options?.syncToVault !== false;
    const selectedVaultItemId = options?.selectedVaultItemId;

    let linkedVaultId = selectedVaultItemId;

    // 1. If purchase: Sync to Vault as a new collection item
    if (newTx.type === 'purchase' && syncToVault && !selectedVaultItemId) {
      const vaultId = `vault-${timestamp}`;
      linkedVaultId = vaultId;

      // Extract brand & name cleanly
      let brand = '소장품';
      let name = newTx.title;
      const bracketMatch = newTx.title.match(/^\[(.*?)\]\s*(.*)$/);
      if (bracketMatch) {
        brand = bracketMatch[1];
        name = bracketMatch[2];
      } else if (newTx.title.includes(' ')) {
        const spaceIdx = newTx.title.indexOf(' ');
        brand = newTx.title.substring(0, spaceIdx);
        name = newTx.title.substring(spaceIdx + 1);
      }

      // Format purchase date "20YY.MM.DD"
      let purchaseDate = newTx.date;
      if (purchaseDate && purchaseDate.length === 8 && purchaseDate.split('.').length === 3) {
        purchaseDate = `20${purchaseDate}`;
      } else if (!purchaseDate) {
        const today = new Date();
        purchaseDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
      }

      const newVaultItem: VaultItem = {
        id: vaultId,
        themeId: newTx.themeId,
        name: name || newTx.title,
        brand: brand || '소장품',
        imageUrl: newTx.imageUrl || '',
        purchasePrice: Math.abs(newTx.amount),
        purchaseDate,
        wearCount: 1,
        status: 'keeping',
        estimatedResalePrice: Math.round(Math.abs(newTx.amount) * 0.7),
        category: newTx.categoryTag || '영입 소장품',
        notes: newTx.notes || newTx.subtext || '가계부에서 등록된 영입품',
        linkedTransactionId: txId,
      };

      setVaultItems((prev) => [newVaultItem, ...prev]);
    } else if (newTx.type === 'resale') {
      // 2. If resale: Update the corresponding Vault Item to 'sold'
      if (selectedVaultItemId) {
        setVaultItems((prev) =>
          prev.map((item) =>
            item.id === selectedVaultItemId
              ? {
                  ...item,
                  status: 'sold' as const,
                  resaleTransactionId: txId,
                  actualResalePrice: Math.abs(newTx.amount),
                  resaleDate: newTx.date,
                }
              : item
          )
        );
      } else {
        // Auto-match by name in the same category
        const matchedItem = vaultItems.find(
          (i) =>
            i.themeId === newTx.themeId &&
            i.status !== 'sold' &&
            (i.name.toLowerCase().includes(newTx.title.toLowerCase()) ||
              newTx.title.toLowerCase().includes(i.name.toLowerCase()))
        );

        if (matchedItem) {
          linkedVaultId = matchedItem.id;
          setVaultItems((prev) =>
            prev.map((item) =>
              item.id === matchedItem.id
                ? {
                    ...item,
                    status: 'sold' as const,
                    resaleTransactionId: txId,
                    actualResalePrice: Math.abs(newTx.amount),
                    resaleDate: newTx.date,
                  }
                : item
            )
          );
        } else if (syncToVault) {
          // If no item existed, create a sold collection record so vault history is 100% complete
          const vaultId = `vault-${timestamp}`;
          linkedVaultId = vaultId;
          const newVaultItem: VaultItem = {
            id: vaultId,
            themeId: newTx.themeId,
            name: newTx.title,
            brand: '방출품',
            imageUrl: newTx.imageUrl || '',
            purchasePrice: newTx.originalPurchasePrice || Math.abs(newTx.amount),
            purchaseDate: newTx.date,
            wearCount: 1,
            status: 'sold',
            estimatedResalePrice: Math.abs(newTx.amount),
            category: '방출 완료',
            notes: `매각 완료: ${Math.abs(newTx.amount).toLocaleString()}원`,
            resaleTransactionId: txId,
            actualResalePrice: Math.abs(newTx.amount),
            resaleDate: newTx.date,
          };
          setVaultItems((prev) => [newVaultItem, ...prev]);
        }
      }
    }

    const createdTx: Transaction = {
      ...newTx,
      id: txId,
      linkedVaultItemId: linkedVaultId,
    };

    setTransactions((prev) => [createdTx, ...prev]);
  };

  // Delete Transaction (synchronizes deletion with Vault)
  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (tx?.linkedVaultItemId) {
      if (tx.type === 'purchase') {
        // Remove the linked vault item
        setVaultItems((prev) => prev.filter((item) => item.id !== tx.linkedVaultItemId));
      } else if (tx.type === 'resale') {
        // Revert vault item status back from 'sold' to 'selling'
        setVaultItems((prev) =>
          prev.map((item) =>
            item.id === tx.linkedVaultItemId
              ? {
                  ...item,
                  status: 'selling' as const,
                  resaleTransactionId: undefined,
                  actualResalePrice: undefined,
                  resaleDate: undefined,
                }
              : item
          )
        );
      }
    }
  };

  // Add Item to Vault with bidirectional synchronization to Ledger
  const handleAddVaultItem = (newItem: Omit<VaultItem, 'id'>, syncToLedger: boolean = true) => {
    const timestamp = Date.now();
    const vaultId = `vault-${timestamp}`;
    const txId = `tx-${timestamp}`;

    let linkedTxId: string | undefined = undefined;

    if (syncToLedger) {
      linkedTxId = txId;

      // Determine month e.g. "2026-09"
      let txMonth = currentMonth;
      if (newItem.purchaseDate && newItem.purchaseDate.includes('.')) {
        const parts = newItem.purchaseDate.split('.');
        if (parts.length >= 2) {
          txMonth = `${parts[0]}-${parts[1].padStart(2, '0')}`;
        }
      }

      // Convert "2026.09.15" to "26.09.15"
      let txDate = '';
      if (newItem.purchaseDate && newItem.purchaseDate.includes('.')) {
        const parts = newItem.purchaseDate.split('.');
        const yy = parts[0].length === 4 ? parts[0].slice(2) : parts[0];
        const mm = parts[1].padStart(2, '0');
        const dd = (parts[2] || '01').padStart(2, '0');
        txDate = `${yy}.${mm}.${dd}`;
      } else {
        const today = new Date();
        const yy = String(today.getFullYear()).slice(2);
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        txDate = `${yy}.${mm}.${dd}`;
      }

      const displayTitle =
        newItem.brand && newItem.brand !== 'Custom' && newItem.brand !== '기타'
          ? `[${newItem.brand}] ${newItem.name}`
          : newItem.name;

      const createdTx: Transaction = {
        id: txId,
        themeId: newItem.themeId,
        month: txMonth,
        type: 'purchase',
        title: displayTitle,
        amount: -newItem.purchasePrice,
        date: txDate,
        channel: '보관함 소장품 등록',
        badges: ['신규영입', newItem.category || '소장품'],
        subtext: '지출 확정',
        imageUrl: newItem.imageUrl || undefined,
        categoryTag: newItem.category,
        notes: newItem.notes,
        originalPurchasePrice: newItem.purchasePrice,
        linkedVaultItemId: vaultId,
      };

      setTransactions((prev) => [createdTx, ...prev]);
    }

    const createdVaultItem: VaultItem = {
      ...newItem,
      id: vaultId,
      linkedTransactionId: linkedTxId,
    };

    setVaultItems((prev) => [createdVaultItem, ...prev]);
  };

  // Delete Vault Item (synchronizes deletion with Ledger)
  const handleDeleteVaultItem = (id: string) => {
    const item = vaultItems.find((i) => i.id === id);
    setVaultItems((prev) => prev.filter((i) => i.id !== id));

    // Also remove any linked transaction in ledger
    setTransactions((prev) =>
      prev.filter(
        (t) =>
          t.linkedVaultItemId !== id &&
          t.id !== item?.linkedTransactionId &&
          t.id !== item?.resaleTransactionId
      )
    );
  };

  // Toggle Vault Item Status
  const handleToggleVaultItemStatus = (id: string, newStatus: VaultItem['status']) => {
    setVaultItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Increment Wear Count
  const handleIncrementWear = (itemId: string) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, wearCount: item.wearCount + 1 } : item
      )
    );
  };

  // Initiate Resale from Vault
  const handleInitiateResale = (item: VaultItem) => {
    setPrefilledTx({
      type: 'resale',
      title: item.name,
      amount: item.estimatedResalePrice,
      imageUrl: item.imageUrl,
      channel: '번개장터 택배거래 · 안전결제',
      subtext: `구입가 ${Math.round(item.purchasePrice / 10000)}만 대비 매각`,
      originalPurchasePrice: item.purchasePrice,
    });
    setIsAddTxOpen(true);
  };

  // Add Wishlist item
  const handleAddWishlist = (newItem: Omit<WishlistItem, 'id'>) => {
    const created: WishlistItem = {
      ...newItem,
      id: `wish-${Date.now()}`,
    };
    setWishlist((prev) => [created, ...prev]);
  };

  // Fulfill Wishlist
  const handleFulfillWishlist = (item: WishlistItem) => {
    const today = new Date();
    const dateFormatted = `${String(today.getFullYear()).slice(2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    handleAddTransaction({
      themeId: item.themeId,
      month: currentMonth,
      type: 'purchase',
      title: `${item.brand} ${item.name}`,
      amount: -item.price,
      date: dateFormatted,
      channel: '위시리스트 목표 영입 달성',
      badges: ['신규영입', '위시달성'],
      subtext: '지출 확정',
      imageUrl: item.imageUrl,
    });

    handleAddVaultItem({
      themeId: item.themeId,
      name: item.name,
      brand: item.brand,
      purchasePrice: item.price,
      purchaseDate: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
      wearCount: 1,
      status: 'keeping',
      estimatedResalePrice: Math.round(item.price * 0.75),
      category: 'New Item',
      imageUrl: item.imageUrl,
      notes: item.notes || '위시리스트에서 영입 전환',
    });

    setWishlist((prev) => prev.filter((w) => w.id !== item.id));
    setCurrentTab('ledger');
  };

  // Add Theme
  const handleAddTheme = (newTheme: CollectorTheme) => {
    setThemes((prev) => [...prev, newTheme]);
    setActiveThemeId(newTheme.id);
  };

  // Delete Theme
  const handleDeleteTheme = (themeId: string) => {
    setThemes((prev) => prev.filter((t) => t.id !== themeId));
    if (activeThemeId === themeId) {
      setActiveThemeId('apparel');
    }
  };

  // Complete clean reset (Clears all local storage data)
  const handleClearAllData = () => {
    setTransactions([]);
    setVaultItems([]);
    setWishlist([]);
    setUserProfile(DEFAULT_USER_PROFILE);
    localStorage.clear();
    localStorage.setItem(STORAGE_CLEAN_VERSION_KEY, 'true');
  };

  // Import Backup Data
  const handleImportData = (data: {
    userProfile?: UserProfile;
    themes?: CollectorTheme[];
    transactions?: Transaction[];
    vaultItems?: VaultItem[];
    wishlist?: WishlistItem[];
  }) => {
    if (data.userProfile) setUserProfile(data.userProfile);
    if (data.themes) setThemes(data.themes);
    if (data.transactions) setTransactions(data.transactions);
    if (data.vaultItems) setVaultItems(data.vaultItems);
    if (data.wishlist) setWishlist(data.wishlist);
  };

  // Filtered & Sorted Transactions
  const processedTransactions = transactions
    .filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchChannel = t.channel.toLowerCase().includes(q);
        const matchBadge = t.badges.some((b) => b.toLowerCase().includes(q));
        if (!matchTitle && !matchChannel && !matchBadge) return false;
      }
      if (selectedChannel && !t.channel.includes(selectedChannel)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

  return (
    <div className="bg-[#09090b] text-[#fafafa] font-['Geist',sans-serif] antialiased flex flex-col min-h-screen selection:bg-[#7c3aed]/40 selection:text-white">
      {/* Sticky Header with customizable profile */}
      <Header
        themes={themes}
        activeThemeId={activeThemeId}
        userProfile={userProfile}
        onSelectTheme={(id) => setActiveThemeId(id)}
        onOpenAddTheme={() => setIsAddThemeOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex flex-col relative w-full max-w-md mx-auto px-4 pt-30 pb-24 bg-[#09090b] min-h-screen">
        {/* Active Tab Router */}
        {currentTab === 'ledger' && (
          <LedgerTab
            theme={activeTheme}
            transactions={processedTransactions}
            metrics={activeMetrics}
            currentMonth={currentMonth}
            onChangeMonth={handleChangeMonth}
            onOpenAddModal={() => {
              setPrefilledTx(undefined);
              setIsAddTxOpen(true);
            }}
            onOpenAnalysisModal={() => setIsAnalysisOpen(true)}
            onSelectTransaction={(tx) => setSelectedTx(tx)}
            onOpenMetricsDetail={() => setIsMetricsDetailOpen(true)}
          />
        )}

        {currentTab === 'vault' && (
          <VaultTab
            theme={activeTheme}
            vaultItems={vaultItems}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onIncrementWear={handleIncrementWear}
            onInitiateResale={handleInitiateResale}
            onSelectItem={(item) => setSelectedVaultItem(item)}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistTab
            theme={activeTheme}
            wishlist={wishlist}
            vaultItems={vaultItems}
            onOpenAddWishlist={() => setIsAddWishlistOpen(true)}
            onFulfillWishlist={handleFulfillWishlist}
            onDeleteWishlist={(id) => setWishlist((prev) => prev.filter((w) => w.id !== id))}
          />
        )}

        {currentTab === 'themes' && (
          <ThemesTab
            themes={themes}
            activeThemeId={activeThemeId}
            transactions={transactions}
            currentMonth={currentMonth}
            onSelectTheme={(id) => setActiveThemeId(id)}
            onOpenAddTheme={() => setIsAddThemeOpen(true)}
            onUpdateThemeBudget={() => {}}
            onDeleteTheme={handleDeleteTheme}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        vaultBadgeCount={vaultItems.filter((i) => i.themeId === activeThemeId && i.status === 'selling').length}
        wishlistBadgeCount={wishlist.filter((w) => w.themeId === activeThemeId).length}
      />

      {/* Modals & Dialogs */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setPrefilledTx(undefined);
        }}
        theme={activeTheme}
        currentMonth={currentMonth}
        vaultItems={vaultItems}
        onAddTransaction={handleAddTransaction}
        initialData={prefilledTx}
      />

      <SettlementAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        theme={activeTheme}
        currentMonth={currentMonth}
        transactions={transactions}
        metrics={activeMetrics}
      />

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onDelete={handleDeleteTransaction}
      />

      <VaultItemDetailModal
        item={selectedVaultItem}
        theme={activeTheme}
        onClose={() => setSelectedVaultItem(null)}
        onInitiateResale={(item) => {
          setSelectedVaultItem(null);
          handleInitiateResale(item);
        }}
        onDelete={(id) => {
          handleDeleteVaultItem(id);
          setSelectedVaultItem(null);
        }}
        onToggleStatus={(id, newStatus) => {
          handleToggleVaultItemStatus(id, newStatus);
          if (selectedVaultItem && selectedVaultItem.id === id) {
            setSelectedVaultItem((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        }}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        theme={activeTheme}
        onAddItem={handleAddVaultItem}
      />

      <AddWishlistModal
        isOpen={isAddWishlistOpen}
        onClose={() => setIsAddWishlistOpen(false)}
        theme={activeTheme}
        vaultItems={vaultItems}
        onAddWishlist={handleAddWishlist}
      />

      <AddThemeModal
        isOpen={isAddThemeOpen}
        onClose={() => setIsAddThemeOpen(false)}
        onAddTheme={handleAddTheme}
      />

      <FilterSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        themes={themes}
        transactions={transactions}
        vaultItems={vaultItems}
        onClearAllData={handleClearAllData}
        onImportData={handleImportData}
      />

      <MetricsDetailModal
        isOpen={isMetricsDetailOpen}
        onClose={() => setIsMetricsDetailOpen(false)}
        theme={activeTheme}
        metrics={activeMetrics}
      />
    </div>
  );
}
