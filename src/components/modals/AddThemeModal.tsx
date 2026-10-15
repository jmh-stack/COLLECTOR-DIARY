import React, { useState } from 'react';
import { CollectorTheme } from '../../types';

interface AddThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTheme: (theme: CollectorTheme) => void;
}

export const AddThemeModal: React.FC<AddThemeModalProps> = ({
  isOpen,
  onClose,
  onAddTheme,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('category');
  const [budgetStr, setBudgetStr] = useState('500,000');
  const [targetRecovery, setTargetRecovery] = useState(80);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const availableIcons = [
    { id: 'checkroom', label: '의류' },
    { id: 'watch', label: '시계' },
    { id: 'potted_plant', label: '식물' },
    { id: 'casino', label: '가챠' },
    { id: 'radio', label: '빈티지' },
    { id: 'sports_esports', label: '게임' },
    { id: 'album', label: '바이닐' },
    { id: 'keyboard', label: '키보드' },
    { id: 'local_cafe', label: '커피용품' },
    { id: 'camera', label: '카메라' },
    { id: 'palette', label: '아트/공예' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budget = parseInt(budgetStr.replace(/[^0-9]/g, ''), 10) || 500000;
    const id = `theme-${Date.now()}`;

    onAddTheme({
      id,
      name: name.trim(),
      icon,
      monthlyBudget: budget,
      targetRecoveryRate: targetRecovery,
      description: description.trim() || `${name.trim()} 순환 컬렉팅 가계부`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">add_circle</span>
            새 컬렉팅 테마 추가
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">테마 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 스니커즈, LP 바이닐, 기계식 키보드"
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">대표 아이콘</label>
            <div className="grid grid-cols-4 gap-1.5">
              {availableIcons.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIcon(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs gap-1 transition-all ${
                    icon === item.id
                      ? 'bg-[#7c3aed] text-white border-[#a78bfa]'
                      : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:text-[#fafafa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.id}</span>
                  <span className="text-[9px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">월간 지출 예산 한도 (원)</label>
            <input
              type="text"
              value={budgetStr}
              onChange={(e) => {
                const num = e.target.value.replace(/[^0-9]/g, '');
                setBudgetStr(num ? Number(num).toLocaleString() : '');
              }}
              placeholder="예: 500,000"
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa] font-mono"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-[#a1a1aa]">
              <span>목표 방출 회수율</span>
              <span className="font-semibold text-[#34d399]">{targetRecovery}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={targetRecovery}
              onChange={(e) => setTargetRecovery(Number(e.target.value))}
              className="w-full accent-[#34d399]"
            />
            <p className="text-[10px] text-[#a1a1aa]">
              지출 대비 중고 방출로 회수할 목표 비율입니다.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">테마 한 줄 설명</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 한정판 발매 드롭 및 리셀 관리"
              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#27272a]/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-[#18181b] text-xs text-[#a1a1aa]"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all"
            >
              생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
