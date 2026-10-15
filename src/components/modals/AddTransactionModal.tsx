import React, { useState } from 'react';
import { CollectorTheme, Transaction, TransactionType } from '../../types';
import { ImagePicker } from '../common/ImagePicker';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  currentMonth: string;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  initialData?: Partial<Transaction>;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentMonth,
  onAddTransaction,
  initialData,
}) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'resale');
  const [title, setTitle] = useState(initialData?.title || '');
  const [amountStr, setAmountStr] = useState(
    initialData?.amount ? String(Math.abs(initialData.amount)) : ''
  );
  const [channel, setChannel] = useState(initialData?.channel || '번개장터 택배거래 · 안전결제');
  const [subtext, setSubtext] = useState(initialData?.subtext || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [badgeText, setBadgeText] = useState('');

  if (!isOpen) return null;

  const quickChannels = [
    '번개장터 택배거래 · 안전결제',
    '중고나라 직거래 완료',
    '당근마켓 동네 직거래',
    'KREAM 검수 즉시 거래',
    '공식 매장 / 백화점 영입',
    '해외직구 / 구매대행 영입',
    '전문 수리 / 오버홀 / 세탁',
  ];

  // Dynamic placeholder based on theme
  const getThemeTitlePlaceholder = (themeId: string, txType: TransactionType) => {
    if (txType === 'care') return '예: 오버홀 점검, 전문 클리닝 & 수선';
    switch (themeId) {
      case 'watch':
        return txType === 'resale' ? '예: 세이코 다이버 커스텀 방출' : '예: 해밀턴 카키필드 영입';
      case 'plant':
        return txType === 'resale' ? '예: 몬스테라 알보 2엽 분양' : '예: 안스리움 베이치 영입';
      case 'gacha':
        return txType === 'resale' ? '예: 중복 베어브릭 매각' : '예: 팝마트 한정판 영입';
      case 'vintage':
        return txType === 'resale' ? '예: 빈티지 램프 매각' : '예: 브라운 턴테이블 영입';
      case 'apparel':
      default:
        return txType === 'resale' ? '예: 바버 비데일 왁스 자켓 방출' : '예: 스튜디오 니콜슨 팬츠 영입';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    if (!title.trim() || isNaN(rawAmount) || rawAmount <= 0) return;

    const finalAmount = type === 'resale' ? rawAmount : -rawAmount;

    // Badges construction
    const badges: string[] = [];
    if (type === 'resale') {
      badges.push('방출완료');
      if (channel.includes('직거래')) badges.push('직거래');
      else badges.push('택배거래');
    } else if (type === 'purchase') {
      badges.push('신규영입');
      if (channel.includes('직구') || channel.includes('구매대행')) badges.push('해외직구');
      else badges.push('국내구매');
    } else {
      badges.push('케어비용');
      badges.push('정비/세탁');
    }
    if (badgeText.trim()) badges.push(badgeText.trim());

    // Generate formatted date e.g. "26.10.15"
    const today = new Date();
    const yy = String(today.getFullYear()).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateFormatted = `${yy}.${mm}.${dd}`;

    onAddTransaction({
      themeId: theme.id,
      month: currentMonth,
      type,
      title: title.trim(),
      amount: finalAmount,
      date: dateFormatted,
      channel: channel || '일반 거래',
      badges,
      subtext: subtext.trim() || (type === 'resale' ? '정산 완료' : '지출 확정'),
      imageUrl: imageUrl.trim() || undefined,
      originalPurchasePrice: initialData?.originalPurchasePrice,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">receipt_long</span>
            {theme.name} 거래 기록 추가
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Transaction Type Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[#a1a1aa] font-medium">거래 유형</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setType('resale')}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  type === 'resale'
                    ? 'bg-[#065f46] text-[#bbf7d0] font-semibold border border-[#34d399]/40'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                방출/매각 (+)
              </button>
              <button
                type="button"
                onClick={() => setType('purchase')}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  type === 'purchase'
                    ? 'bg-[#7c3aed] text-[#ede9fe] font-semibold border border-[#a78bfa]/40'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                신규영입 (-)
              </button>
              <button
                type="button"
                onClick={() => setType('care')}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  type === 'care'
                    ? 'bg-[#27272a] text-[#fafafa] font-semibold border border-[#52525b]'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                케어/정비 (-)
              </button>
            </div>
          </div>

          {/* Album Photo Picker */}
          <ImagePicker
            value={imageUrl}
            onChange={setImageUrl}
            label="거래 물품 사진 (내 앨범에서 선택)"
          />

          {/* Item Title */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">아이템명 / 거래 내용</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getThemeTitlePlaceholder(theme.id, type)}
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa]"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">금액 (원)</label>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9]/g, '');
                setAmountStr(numeric ? Number(numeric).toLocaleString() : '');
              }}
              placeholder="예: 280,000"
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa] font-mono text-base"
              required
            />
          </div>

          {/* Channel Presets */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">거래 채널 / 결제 방식</label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="직접 입력하거나 아래 버튼 터치"
              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa] mb-1.5"
            />
            <div className="flex flex-wrap gap-1">
              {quickChannels.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setChannel(c)}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#1e1e22] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
                >
                  {c.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Subtext / Remark */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">정산 요약 코멘트</label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              placeholder={type === 'resale' ? '예: 감가 방어 선방 / 시세 차익 실현' : '예: 지출 확정 / 풀구성 영입'}
              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2 border-t border-[#27272a]/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-[#18181b] text-xs text-[#a1a1aa] hover:text-[#fafafa] font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
