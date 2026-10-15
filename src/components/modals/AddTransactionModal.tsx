import React, { useState } from 'react';
import { CollectorTheme, Transaction, TransactionType } from '../../types';

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
    'KREAM 검수 합격 즉시 구매',
    '가을 신상 구매대행 영입',
    '백화점/디자이너 편집숍 영입',
    '명품 의류 전문 세탁소 케어',
  ];

  const quickImages = [
    { label: '바버 왁스 자켓', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0eWlXmq6iQ1WjZ6ErowEVb79T39wv9Z16uWaR8WC1Hd4rwx17RjXwf2Iy_B9fiuhXMBbdeyATT61wrL0zwKoaf8pEc-s8RIovNSK4oIzIQnk9wVyNWFb-IZcA8fUQRpO48tklvAKEdZD3QQOLKu6jH3i-P8urh3eBeNJm2fhMEP-JJn3-neWGoG620tymiWj1pEyNOK19MfAJKHJr8D7A-eLmZD6NVUnCLsL_9ZtmmJuq_xHar58' },
    { label: '엔가 베드포드 울', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDopysbAeOStVfJA8KtvHEfpTXx9HV5nfr3M-eZL5aM0bE2j2ghWdRfrJx8Rpl73wIMeyGnZQx7At4EqEoaL9VpRzsIVcXxhe2NL4aNN_BaL4tspbOFj5x1WIJRtnOWTiSaMS7uchuFctGb_cOEZTn4L5MFTX5e7vH5EF_x1LR664ipAjO711YHmm_t_8ZwNre3S0GCRuSUKOUuyNjTMZ5uLjgBMHd1PRJwfrQdMz2DOle3_qiIHJM' },
    { label: '니콜슨 도브 팬츠', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQSnDsY8LYCUunHyez8ocnZ7Yd8SOf5AGs8idKupJtdTg-glWh_mLcul8Ft-EBWdc378fZEuZfCM92qkPmNXlhmhDMs_FKzqiqM-Fr8Ys7aPghZOZ5RHqKrYxmSF-eBdpNFFwcQc58ZH0MHHiz8j-TfQgPMVg98f4yhwQECmipxliDkjZvFoXIiPMq9EadomhphJAvzZ2vacD8DN5LvD8NOoZy6su8jVSHUrWYwZq1GMG0nbxcOXs' },
    { label: '아워레가시 부츠', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80' },
  ];

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
      badges.push('수선/세탁');
    }
    if (badgeText.trim()) badges.push(badgeText.trim());

    // Generate formatted date e.g. "26.09.29"
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
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in duration-200">
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
                케어/세탁 (-)
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">아이템명 / 거래 내용</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 바버 비데일 왁스 자켓 세이지 38"
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
              placeholder="직접 입력하거나 아래 추천 클릭"
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

          {/* Subtext / Defense remark */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">정산 요약 코멘트</label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              placeholder={type === 'resale' ? '예: 영입 42만 대비 감가 -14만 방어' : '예: 지출 확정 / 정산 완료'}
              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          {/* Photo quick selector or URL */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">사진 선택 (선택)</label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {quickImages.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border transition-all ${
                    imageUrl === img.url ? 'border-[#a78bfa] scale-105' : 'border-[#27272a] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="또는 이미지 URL 직접 입력"
              className="w-full px-3 py-1 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] text-[11px] placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa]"
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
