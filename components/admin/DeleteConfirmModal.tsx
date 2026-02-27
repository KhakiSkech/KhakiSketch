'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제 확인',
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  const defaultMessage = itemName
    ? `"${itemName}"을(를) 삭제하시겠습니까?`
    : '이 항목을 삭제하시겠습니까?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Icon */}
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-brand-primary mb-2">{title}</h3>

        {/* Message */}
        <p className="text-center text-brand-muted mb-6">{message || defaultMessage}</p>

        <p className="text-center text-sm text-red-500 mb-6">이 작업은 되돌릴 수 없습니다.</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-brand-primary/5 text-brand-text rounded-full font-medium hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
