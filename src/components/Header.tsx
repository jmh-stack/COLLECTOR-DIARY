import React from 'react';
import { CollectorTheme, UserProfile } from '../types';

interface HeaderProps {
  themes: CollectorTheme[];
  activeThemeId: string;
  userProfile?: UserProfile;
  onSelectTheme: (id: string) => void;
  onOpenAddTheme: () => void;
  onOpenFilter: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  themes,
  activeThemeId,
  userProfile,
  onSelectTheme,
  onOpenAddTheme,
  onOpenFilter,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0c0c0f]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-[#27272a]/40 pt-safe">
      <div className="max-w-md mx-auto h-28 px-4 flex flex-col justify-center gap-2">
        {/* Top App Title & Action Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center flex-shrink-0 text-[#a78bfa] shadow-sm border border-[#27272a]/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M19 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2"></path>
                <rect height="8" rx="2" width="7" x="15" y="8"></rect>
                <circle cx="18.5" cy="12" fill="currentColor" r="0.75"></circle>
              </svg>
            </div>
            <div className="flex items-center min-w-0">
              <h1 className="text-sm font-semibold text-[#fafafa] truncate tracking-tight">컬렉팅 가계부</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOpenFilter}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] active:scale-95 transition-all"
              title="검색 및 필터"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
              style={{ backgroundColor: userProfile?.avatarColor || '#a78bfa' }}
              title={`${userProfile?.name || '프로필'} 관리`}
            >
              <span className="material-symbols-outlined text-[#0a0012] text-[18px]">
                {userProfile?.avatarIcon || 'person'}
              </span>
            </button>
          </div>
        </div>

        {/* Category / Theme Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {themes.map((theme) => {
            const isActive = theme.id === activeThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#7c3aed] text-[#ede9fe] shadow-sm font-semibold'
                    : 'bg-[#121215] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{theme.icon}</span>
                <span>{theme.name}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenAddTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#18181b] text-[#a78bfa] hover:text-[#fafafa] hover:bg-[#1e1e22] flex-shrink-0 transition-all border border-[#27272a]/50"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>테마 추가</span>
          </button>
        </div>
      </div>
    </header>
  );
};
