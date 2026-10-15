import React, { useState } from 'react';
import { CollectorTheme, Transaction, VaultItem, UserProfile } from '../../types';
import { formatKRW } from '../../utils/formatters';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  themes: CollectorTheme[];
  transactions: Transaction[];
  vaultItems: VaultItem[];
  onClearAllData: () => void;
  onImportData: (data: {
    userProfile?: UserProfile;
    themes?: CollectorTheme[];
    transactions?: Transaction[];
    vaultItems?: VaultItem[];
  }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  themes,
  transactions,
  vaultItems,
  onClearAllData,
  onImportData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [tag, setTag] = useState(userProfile.tag);
  const [bio, setBio] = useState(userProfile.bio);
  const [avatarIcon, setAvatarIcon] = useState(userProfile.avatarIcon || 'person');
  const [avatarColor, setAvatarColor] = useState(userProfile.avatarColor || '#a78bfa');

  if (!isOpen) return null;

  const totalVaultValue = vaultItems.reduce((acc, item) => acc + item.purchasePrice, 0);
  const totalResaleAllTime = transactions
    .filter((t) => t.type === 'resale')
    .reduce((acc, t) => acc + Math.max(0, t.amount), 0);
  const totalExpenseAllTime = transactions
    .filter((t) => t.type === 'purchase' || t.type === 'care')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const availableIcons = ['person', 'star', 'diamond', 'favorite', 'palette', 'bolt', 'watch', 'eco', 'local_mall'];
  const availableColors = ['#a78bfa', '#34d399', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || '컬렉터',
      email: email.trim(),
      tag: tag.trim() || '스마트 컬렉터',
      bio: bio.trim(),
      avatarIcon,
      avatarColor,
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = {
      userProfile,
      themes,
      transactions,
      vaultItems,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collector-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportData(parsed);
        alert('데이터를 성공적으로 복원했습니다.');
      } catch {
        alert('올바른 백업 JSON 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">account_circle</span>
            컬렉터 프로필 관리
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Details or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-2.5 bg-[#18181b] p-3 rounded-xl border border-[#27272a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#fafafa]">개인 정보 수정</span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[11px] text-[#a1a1aa] hover:underline"
              >
                취소
              </button>
            </div>

            {/* Avatar picker */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#a1a1aa]">아바타 아이콘 & 색상</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#0a0012] flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span className="material-symbols-outlined text-[20px]">{avatarIcon}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {availableColors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setAvatarColor(c)}
                      className={`w-5 h-5 rounded-full transition-transform ${avatarColor === c ? 'scale-125 ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-1 overflow-x-auto no-scrollbar pt-1">
                {availableIcons.map((ic) => (
                  <button
                    type="button"
                    key={ic}
                    onClick={() => setAvatarIcon(ic)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      avatarIcon === ic ? 'bg-[#7c3aed] text-white border-[#a78bfa]' : 'bg-[#1e1e22] text-[#a1a1aa] border-[#27272a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{ic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#a1a1aa]">이름 / 닉네임</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동, 빈티지러버"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#a1a1aa]">컬렉터 칭호 / 수집 분야</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="예: 아카이브 컬렉터, 시계 애호가"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#a1a1aa]">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@example.com"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#a1a1aa]">한 줄 소개 / 수집 모토</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="예: 안 입는 옷은 방출하고 위시를 영입하는 순환 라이프"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#a78bfa] text-[#0a0012] font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
            >
              프로필 저장
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[#0a0012] flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: userProfile.avatarColor || '#a78bfa' }}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {userProfile.avatarIcon || 'person'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-[#fafafa] truncate">{userProfile.name}</h4>
                    {userProfile.tag && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#065f46] text-[#bbf7d0]">
                        {userProfile.tag}
                      </span>
                    )}
                  </div>
                  {userProfile.email ? (
                    <p className="text-[11px] text-[#a1a1aa] truncate mt-0.5">{userProfile.email}</p>
                  ) : (
                    <p className="text-[10px] text-[#71717a] mt-0.5">이메일 미등록</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setName(userProfile.name);
                  setEmail(userProfile.email);
                  setTag(userProfile.tag);
                  setBio(userProfile.bio);
                  setAvatarIcon(userProfile.avatarIcon || 'person');
                  setAvatarColor(userProfile.avatarColor || '#a78bfa');
                  setIsEditing(true);
                }}
                className="px-2.5 py-1 rounded-md bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[13px]">edit</span>
                <span>수정</span>
              </button>
            </div>

            {userProfile.bio && (
              <p className="text-[11px] text-[#a1a1aa] bg-[#121215] p-2 rounded-lg leading-relaxed border border-[#27272a]/50">
                💬 {userProfile.bio}
              </p>
            )}
          </div>
        )}

        {/* Local Storage Isolated Notice */}
        <div className="p-2.5 rounded-lg bg-[#0f0f12] border border-[#27272a]/50 text-[11px] text-[#a1a1aa] flex items-start gap-2">
          <span className="material-symbols-outlined text-[#34d399] text-[16px] mt-0.5">lock</span>
          <p className="leading-relaxed">
            모든 데이터는 현재 브라우저의 <strong className="text-[#fafafa]">로컬 스토리지(Local Storage)</strong>에만 안전하게 저장됩니다. 다른 사용자와 정보가 공유되지 않습니다.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[#a1a1aa]">내 수집 자산 요약</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]/40">
              <span className="text-[10px] text-[#a1a1aa] block mb-0.5">보관함 자산 가치</span>
              <span className="font-bold text-[#fafafa]">{formatKRW(totalVaultValue)}</span>
              <span className="text-[9px] text-[#a1a1aa] block mt-0.5">총 {vaultItems.length}개 소장</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a]/40">
              <span className="text-[10px] text-[#a1a1aa] block mb-0.5">누적 방출 회수액</span>
              <span className="font-bold text-[#34d399]">+{formatKRW(totalResaleAllTime)}</span>
              <span className="text-[9px] text-[#a1a1aa] block mt-0.5">지출 {formatKRW(totalExpenseAllTime)}</span>
            </div>
          </div>
        </div>

        {/* Data Management Actions */}
        <div className="space-y-1.5 pt-1 border-t border-[#27272a]/40">
          <span className="text-[11px] font-medium text-[#a1a1aa]">데이터 백업 및 초기화</span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[#18181b] hover:bg-[#1e1e22] text-xs text-[#fafafa] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#a78bfa]">download</span>
                <span>가계부 데이터 백업 (JSON 다운로드)</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-[#a1a1aa]">chevron_right</span>
            </button>

            <label className="w-full flex items-center justify-between p-2 rounded-lg bg-[#18181b] hover:bg-[#1e1e22] text-xs text-[#fafafa] transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#34d399]">upload</span>
                <span>백업 파일 복원 (JSON 파일 선택)</span>
              </div>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              <span className="material-symbols-outlined text-[14px] text-[#a1a1aa]">chevron_right</span>
            </label>

            <button
              onClick={() => {
                if (window.confirm('저장된 모든 가계부, 보관함, 프로필 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[#18181b] hover:bg-[#ef4444]/20 text-xs text-[#fca5a5] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ef4444]">delete_forever</span>
                <span>모든 데이터 초기화 (완전 삭제)</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-[#a1a1aa]">chevron_right</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 mt-1 rounded-lg bg-[#18181b] text-xs text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
