import React from 'react';

export type NavTab = 'vault' | 'ledger' | 'wishlist' | 'themes';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  vaultBadgeCount?: number;
  wishlistBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  vaultBadgeCount,
  wishlistBadgeCount
}) => {
  const navItems = [
    {
      id: 'vault' as NavTab,
      label: '보관함',
      icon: 'inventory_2',
      badge: vaultBadgeCount
    },
    {
      id: 'ledger' as NavTab,
      label: '가계부',
      icon: 'receipt_long'
    },
    {
      id: 'wishlist' as NavTab,
      label: '위시리스트',
      icon: 'bookmark_heart',
      badge: wishlistBadgeCount
    },
    {
      id: 'themes' as NavTab,
      label: '테마 관리',
      icon: 'category'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0c0c0f]/90 backdrop-blur-xl border-t border-[#27272a]/40 shadow-[0_-1px_12px_rgba(0,0,0,0.5)] select-none">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 w-18 h-12 rounded-lg transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 [-webkit-tap-highlight-color:transparent] ${
                isActive
                  ? 'text-[#a78bfa] font-semibold'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold bg-[#7c3aed] text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
              {/* Removed pointer dot indicator as requested */}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
