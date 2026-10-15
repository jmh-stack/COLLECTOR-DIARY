import React from 'react';
import { VaultItem, CollectorTheme } from '../../types';
import { formatKRW } from '../../utils/formatters';

interface VaultItemDetailModalProps {
  item: VaultItem | null;
  theme: CollectorTheme;
  onClose: () => void;
  onInitiateResale: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: VaultItem['status']) => void;
}

export const VaultItemDetailModal: React.FC<VaultItemDetailModalProps> = ({
  item,
  theme,
  onClose,
  onInitiateResale,
  onDelete,
  onToggleStatus,
}) => {
  if (!item) return null;

  const costPerWear = item.wearCount > 0 ? Math.round(item.purchasePrice / item.wearCount) : item.purchasePrice;

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">{theme.icon || 'inventory_2'}</span>
            <h3 className="text-sm font-semibold text-[#fafafa]">{theme.name} 소장품 상세 정보</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Photo */}
        {item.imageUrl ? (
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#18181b] border border-[#27272a]">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-28 rounded-xl flex items-center justify-center bg-[#18181b] border border-[#27272a] text-[#52525b]">
            <span className="material-symbols-outlined text-4xl">{theme.icon || 'inventory_2'}</span>
          </div>
        )}

        {/* Info */}
        <div>
          <span className="text-[10px] text-[#a78bfa] font-medium uppercase tracking-wider block">
            {item.brand} · {item.category || '소장품'}
          </span>
          <h2 className="text-base font-bold text-[#fafafa] mt-0.5">{item.name}</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-[#fafafa]">{formatKRW(item.purchasePrice)}</span>
            <span className="text-xs text-[#34d399] font-medium">회당 {formatKRW(costPerWear)}</span>
          </div>
        </div>

        {/* Status switcher */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#a1a1aa] font-medium">소장 상태 변경</label>
          <div className="grid grid-cols-4 gap-1 text-xs">
            {(['keeping', 'selling', 'permanent', 'sold'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onToggleStatus(item.id, st)}
                className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                  item.status === st
                    ? st === 'selling'
                      ? 'bg-[#3b1111] text-[#fca5a5] border-[#ef4444]/40 font-semibold'
                      : st === 'sold'
                      ? 'bg-[#064e3b] text-[#34d399] border-[#059669] font-semibold'
                      : 'bg-[#7c3aed] text-white border-[#a78bfa] font-semibold'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:text-[#fafafa]'
                }`}
              >
                {st === 'keeping'
                  ? '실착/보유'
                  : st === 'selling'
                  ? '방출 예정'
                  : st === 'permanent'
                  ? '영구 소장'
                  : '방출 완료'}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Sync Status */}
        <div className="p-2.5 rounded-lg bg-[#0f0f12] border border-[#27272a] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#a1a1aa] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#34d399] text-[14px]">sync</span>
              가계부 양방향 동기화
            </span>
            <span className="text-[#34d399] font-medium">
              {item.status === 'sold' ? '방출 매각 정산 연동됨' : '영입 지출 가계부 연동됨'}
            </span>
          </div>
          <div className="text-[10px] text-[#71717a] space-y-0.5">
            <p>• 취득일: {item.purchaseDate || '기록일'}</p>
            <p>• 누적 착용/사용: {item.wearCount}회</p>
            {item.actualResalePrice ? (
              <p className="text-[#34d399]">• 실매각 대금: {formatKRW(item.actualResalePrice)} ({item.resaleDate || '매각일'})</p>
            ) : (
              <p>• 예상 방출가: {formatKRW(item.estimatedResalePrice)}</p>
            )}
            {item.notes && <p>• 소장 메모: {item.notes}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#27272a]/50">
          <button
            onClick={() => {
              if (window.confirm('이 소장품을 삭제하시겠습니까? 연동된 가계부 내역도 함께 자동 정리됩니다.')) {
                onDelete(item.id);
                onClose();
              }
            }}
            className="px-3 py-2 rounded-lg bg-[#3b1111] hover:bg-[#ef4444]/30 text-[#fca5a5] text-xs font-medium transition-colors"
          >
            삭제
          </button>

          {item.status !== 'sold' ? (
            <button
              onClick={() => {
                onClose();
                onInitiateResale(item);
              }}
              className="flex-1 py-2 rounded-lg bg-[#065f46] hover:bg-[#047857] text-[#bbf7d0] text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">sell</span>
              <span>가계부에 매각/방출 등록</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-semibold transition-colors"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
