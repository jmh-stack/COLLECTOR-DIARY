import React, { useState } from 'react';
import { CollectorTheme, VaultItem } from '../../types';
import { ImagePicker } from '../common/ImagePicker';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  onAddItem: (item: Omit<VaultItem, 'id'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  theme,
  onAddItem,
}) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [purchasePriceStr, setPurchasePriceStr] = useState('');
  const [category, setCategory] = useState('');
  const [wearCount, setWearCount] = useState('1');
  const [status, setStatus] = useState<'keeping' | 'selling' | 'permanent'>('keeping');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Dynamic placeholders based on current active theme
  const getPlaceholders = (themeId: string) => {
    switch (themeId) {
      case 'watch':
        return {
          brand: '예: 롤렉스, 오메가, 세이코, 해밀턴',
          category: '예: 다이버, 드레스, 필드워치',
          name: '예: 서브마리너 41, 카키필드 메카니컬',
          wearLabel: '초기 착용 횟수',
        };
      case 'plant':
        return {
          brand: '예: 몬스테라, 안스리움, 아가베',
          category: '예: 관엽, 다육, 유묘, 분재',
          name: '예: 몬스테라 알보 2엽, 베이치',
          wearLabel: '보유/관리 개월수',
        };
      case 'gacha':
        return {
          brand: '예: 베어브릭, 팝마트, 레고, 반다이',
          category: '예: 피규어, 아트토이, 굿즈',
          name: '예: 몰리 스페이스 100%, 카우스 피규어',
          wearLabel: '전시/소장 개월수',
        };
      case 'vintage':
        return {
          brand: '예: 브라운, 허먼밀러, 아르텍, 뱅앤올룹슨',
          category: '예: 오디오, 조명, 의자, 시계',
          name: '예: 디터람스 SK4 턴테이블, 임스 체어',
          wearLabel: '사용/소장 횟수',
        };
      case 'apparel':
      default:
        return {
          brand: '예: 르메르, 아워레가시, 바버, 나이키',
          category: '예: 아우터, 상의, 팬츠, 신발',
          name: '예: 비데일 왁스 자켓, 와이드 슬랙스',
          wearLabel: '초기 실착 횟수',
        };
    }
  };

  const placeholders = getPlaceholders(theme.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(purchasePriceStr.replace(/[^0-9]/g, ''), 10);
    if (!name.trim() || isNaN(price) || price <= 0) return;

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    onAddItem({
      themeId: theme.id,
      brand: brand.trim() || 'Custom',
      name: name.trim(),
      purchasePrice: price,
      purchaseDate: dateStr,
      wearCount: Math.max(1, parseInt(wearCount, 10) || 1),
      status,
      estimatedResalePrice: Math.round(price * 0.7),
      category: category.trim() || '기타',
      imageUrl: imageUrl.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">{theme.icon || 'inventory_2'}</span>
            {theme.name} 소장품 등록
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Direct Album Photo Picker */}
          <ImagePicker
            value={imageUrl}
            onChange={setImageUrl}
            label={`${theme.name} 소장품 사진 (내 앨범에서 선택)`}
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">브랜드 / 제조사</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={placeholders.brand}
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">카테고리</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={placeholders.category}
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">제품명 / 모델명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholders.name}
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">구입가 (원)</label>
              <input
                type="text"
                value={purchasePriceStr}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, '');
                  setPurchasePriceStr(num ? Number(num).toLocaleString() : '');
                }}
                placeholder="예: 420,000"
                className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa] font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">{placeholders.wearLabel}</label>
              <input
                type="number"
                min="0"
                value={wearCount}
                onChange={(e) => setWearCount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa] font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-[#a1a1aa] font-medium">소장 상태</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['keeping', 'selling', 'permanent'] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    status === s
                      ? s === 'selling'
                        ? 'bg-[#3b1111] text-[#fca5a5] border border-[#ef4444]/40 font-semibold'
                        : 'bg-[#7c3aed] text-white font-semibold'
                      : 'bg-[#18181b] text-[#a1a1aa]'
                  }`}
                >
                  {s === 'keeping' ? '실착/보유' : s === 'selling' ? '방출 예정' : '영구 소장'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">소장 메모 (선택)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 보증서 풀셋 소장, 2026년 봄 정기점검 완료"
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
              className="flex-1 py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              소장품 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
