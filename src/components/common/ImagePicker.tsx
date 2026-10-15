import React, { useRef, useState } from 'react';
import { compressImageFile } from '../../utils/imageCompressor';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  label = '소장품 사진 등록',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const compressedDataUrl = await compressImageFile(file, 800, 0.8);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Failed to load image', err);
      alert('사진을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      // Reset input value so the same file can be picked again if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-[11px] text-[#a1a1aa] font-medium">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] text-[#ef4444] hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[12px]">delete</span>
            사진 삭제
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full h-36 rounded-xl overflow-hidden bg-[#18181b] border border-[#27272a] cursor-pointer group flex items-center justify-center"
        >
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-medium">
            <span className="material-symbols-outlined text-[16px]">photo_library</span>
            <span>앨범에서 다른 사진 선택</span>
          </div>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] bg-black/70 text-white backdrop-blur-sm">
            터치하여 사진 변경
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full py-4 px-3 rounded-xl border border-dashed border-[#3f3f46] hover:border-[#a78bfa] bg-[#18181b]/60 hover:bg-[#18181b] flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.99] text-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-[#a78bfa]">
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>사진 불러오는 중...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#27272a] text-[#a78bfa] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#fafafa] flex items-center justify-center gap-1">
                  <span>내 앨범에서 사진 가져오기</span>
                </p>
                <p className="text-[10px] text-[#a1a1aa]">
                  휴대폰 사진첩 또는 갤러리에서 사진을 선택하세요
                </p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
};
