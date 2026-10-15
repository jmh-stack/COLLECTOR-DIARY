import React from 'react';
import { Transaction } from '../../types';
import { formatKRW } from '../../utils/formatters';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onDelete,
}) => {
  if (!transaction) return null;

  const isResale = transaction.type === 'resale';

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-[#27272a]/50">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              isResale ? 'bg-[#065f46] text-[#bbf7d0]' : 'bg-[#27272a] text-[#a1a1aa]'
            }`}>
              {isResale ? '방출/매각' : transaction.type === 'care' ? '케어/수선' : '신규영입'}
            </span>
            <span className="text-xs text-[#a1a1aa]">{transaction.date}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {transaction.imageUrl && (
          <div className="w-full h-44 rounded-lg bg-[#18181b] overflow-hidden border border-[#27272a]/50">
            <img
              src={transaction.imageUrl}
              alt={transaction.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-[#fafafa] mb-1">{transaction.title}</h3>
          <p className="text-xl font-bold tracking-tight" style={{ color: isResale ? '#34d399' : '#fafafa' }}>
            {formatKRW(transaction.amount, true)}
          </p>
        </div>

        <div className="bg-[#18181b] p-3 rounded-lg space-y-2 text-xs border border-[#27272a]/40">
          <div className="flex justify-between">
            <span className="text-[#a1a1aa]">거래 채널</span>
            <span className="text-[#fafafa] font-medium">{transaction.channel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a1a1aa]">거래 상태</span>
            <div className="flex gap-1">
              {transaction.badges.map((b, i) => (
                <span key={i} className="px-1.5 py-0.2 bg-[#27272a] text-[#a1a1aa] rounded text-[10px]">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a1a1aa]">정산 메모</span>
            <span className="text-[#34d399] font-medium">{transaction.subtext}</span>
          </div>
          {transaction.originalPurchasePrice && (
            <div className="flex justify-between pt-1 border-t border-[#27272a]/40">
              <span className="text-[#a1a1aa]">취득 원가</span>
              <span className="text-[#fafafa]">{formatKRW(transaction.originalPurchasePrice)}</span>
            </div>
          )}
          {transaction.linkedVaultItemId && (
            <div className="flex justify-between pt-1 border-t border-[#27272a]/40">
              <span className="text-[#a1a1aa]">보관함 연동</span>
              <span className="text-[#34d399] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">sync</span>
                소장품 실시간 동기화됨
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-[#27272a]/50">
          <button
            onClick={() => {
              if (window.confirm('이 거래 기록을 삭제하시겠습니까? 연동된 보관함 소장품 정보도 함께 자동 동기화되어 정리됩니다.')) {
                onDelete(transaction.id);
                onClose();
              }
            }}
            className="flex-1 py-2 rounded-lg bg-[#3b1111] hover:bg-[#ef4444]/30 text-[#fca5a5] text-xs font-medium transition-colors"
          >
            기록 삭제
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-[#a78bfa] text-[#0a0012] text-xs font-semibold hover:opacity-90 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
