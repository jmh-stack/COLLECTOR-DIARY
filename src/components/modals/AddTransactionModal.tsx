import React, { useState, useEffect } from 'react';
import { CollectorTheme, Transaction, TransactionType, VaultItem } from '../../types';
import { ImagePicker } from '../common/ImagePicker';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  currentMonth: string;
  vaultItems: VaultItem[];
  onAddTransaction: (
    tx: Omit<Transaction, 'id'>,
    options?: { syncToVault?: boolean; selectedVaultItemId?: string }
  ) => void;
  initialData?: Partial<Transaction>;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentMonth,
  vaultItems,
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
  const [selectedVaultItemId, setSelectedVaultItemId] = useState<string>(
    initialData?.linkedVaultItemId || ''
  );
  const [syncToVault, setSyncToVault] = useState<boolean>(true);

  // Available vault items in current theme that are not yet sold
  const activeVaultItems = vaultItems.filter(
    (item) => item.themeId === theme.id && item.status !== 'sold'
  );

  useEffect(() => {
    if (initialData) {
      if (initialData.type) setType(initialData.type);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.amount) setAmountStr(String(Math.abs(initialData.amount)));
      if (initialData.imageUrl) setImageUrl(initialData.imageUrl);
      if (initialData.subtext) setSubtext(initialData.subtext);
      if (initialData.channel) setChannel(initialData.channel);
      if (initialData.linkedVaultItemId) setSelectedVaultItemId(initialData.linkedVaultItemId);
    }
  }, [initialData]);

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

  const getThemeTitlePlaceholder = (themeId: string, txType: TransactionType) => {
    if (txType === 'care') return '예: 정기 오버홀 점검, 전문 클리닝 & 수선';
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

  const handleSelectVaultItem = (itemId: string) => {
    setSelectedVaultItemId(itemId);
    const item = vaultItems.find((i) => i.id === itemId);
    if (item) {
      setTitle(item.name);
      if (item.imageUrl) setImageUrl(item.imageUrl);
      if (!amountStr && item.estimatedResalePrice) {
        setAmountStr(item.estimatedResalePrice.toLocaleString());
      }
      setSubtext(`구입가 ${Math.round(item.purchasePrice / 10000)}만 대비 매각`);
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
      badges.push('정비/케어');
    }

    const today = new Date();
    const yy = String(today.getFullYear()).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateFormatted = `${yy}.${mm}.${dd}`;

    const linkedItem = selectedVaultItemId ? vaultItems.find((i) => i.id === selectedVaultItemId) : undefined;

    onAddTransaction(
      {
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
        originalPurchasePrice: linkedItem?.purchasePrice || initialData?.originalPurchasePrice,
        linkedVaultItemId: selectedVaultItemId || undefined,
      },
      {
        syncToVault,
        selectedVaultItemId: selectedVaultItemId || undefined,
      }
    );

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

          {/* If Resale: Link to existing Vault Item */}
          {type === 'resale' && activeVaultItems.length > 0 && (
            <div className="space-y-1 p-2 rounded-lg bg-[#18181b] border border-[#27272a]">
              <label className="text-[11px] text-[#34d399] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">link</span>
                방출할 보관함 소장품 선택 (자동 연동)
              </label>
              <select
                value={selectedVaultItemId}
                onChange={(e) => handleSelectVaultItem(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#34d399]"
              >
                <option value="">직접 입력 (보관함 연동 없음)</option>
                {activeVaultItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.brand}] {item.name} (구입 {item.purchasePrice.toLocaleString()}원)
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* If Purchase: Sync to Vault Checkbox */}
          {type === 'purchase' && (
            <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] cursor-pointer hover:border-[#a78bfa]/50 transition-colors">
              <input
                type="checkbox"
                checked={syncToVault}
                onChange={(e) => setSyncToVault(e.target.checked)}
                className="accent-[#a78bfa] rounded w-4 h-4 mt-0.5"
              />
              <div className="flex-1 text-[11px]">
                <span className="text-[#fafafa] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#a78bfa]">inventory_2</span>
                  보관함에 새 소장품으로 자동 등록 (동기화)
                </span>
                <span className="text-[10px] text-[#a1a1aa] block mt-0.5">
                  해당 아이템을 {theme.name} 보관함 리스트에 소장 상태로 즉시 추가합니다.
                </span>
              </div>
            </label>
          )}

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
