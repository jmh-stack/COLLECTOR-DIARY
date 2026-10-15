import React, { useState } from 'react';
import { CollectorTheme, VaultItem } from '../../types';

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
  const [category, setCategory] = useState('Outer');
  const [wearCount, setWearCount] = useState('1');
  const [status, setStatus] = useState<'keeping' | 'selling' | 'permanent'>('keeping');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const quickCategories = ['Outer', 'Top', 'Pants', 'Shoes', 'Bag', 'Acc'];
  const sampleImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC0eWlXmq6iQ1WjZ6ErowEVb79T39wv9Z16uWaR8WC1Hd4rwx17RjXwf2Iy_B9fiuhXMBbdeyATT61wrL0zwKoaf8pEc-s8RIovNSK4oIzIQnk9wVyNWFb-IZcA8fUQRpO48tklvAKEdZD3QQOLKu6jH3i-P8urh3eBeNJm2fhMEP-JJn3-neWGoG620tymiWj1pEyNOK19MfAJKHJr8D7A-eLmZD6NVUnCLsL_9ZtmmJuq_xHar58',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDopysbAeOStVfJA8KtvHEfpTXx9HV5nfr3M-eZL5aM0bE2j2ghWdRfrJx8Rpl73wIMeyGnZQx7At4EqEoaL9VpRzsIVcXxhe2NL4aNN_BaL4tspbOFj5x1WIJRtnOWTiSaMS7uchuFctGb_cOEZTn4L5MFTX5e7vH5EF_x1LR664ipAjO711YHmm_t_8ZwNre3S0GCRuSUKOUuyNjTMZ5uLjgBMHd1PRJwfrQdMz2DOle3_qiIHJM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQSnDsY8LYCUunHyez8ocnZ7Yd8SOf5AGs8idKupJtdTg-glWh_mLcul8Ft-EBWdc378fZEuZfCM92qkPmNXlhmhDMs_FKzqiqM-Fr8Ys7aPghZOZ5RHqKrYxmSF-eBdpNFFwcQc58ZH0MHHiz8j-TfQgPMVg98f4yhwQECmipxliDkjZvFoXIiPMq9EadomhphJAvzZ2vacD8DN5LvD8NOoZy6su8jVSHUrWYwZq1GMG0nbxcOXs',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80'
  ];

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
      category,
      imageUrl: imageUrl.trim() || sampleImages[0],
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">inventory_2</span>
            {theme.name} 보관함 아이템 등록
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">브랜드 / 제조사</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="예: Lemaire"
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">카테고리</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">제품명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 트위스티드 벨티드 팬츠"
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
              <label className="text-[11px] text-[#a1a1aa] font-medium">초기 실착/사용 횟수</label>
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
            <label className="text-[11px] text-[#a1a1aa] font-medium">사진 선택</label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {sampleImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(img)}
                  className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border transition-all ${
                    imageUrl === img ? 'border-[#a78bfa] scale-105' : 'border-[#27272a] opacity-70'
                  }`}
                >
                  <img src={img} alt="sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
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
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
