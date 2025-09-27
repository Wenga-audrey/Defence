import React, { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus();
  }, [open]);

  if (!open) return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={dialogRef}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] max-w-lg w-full animate-fadein">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
      <style jsx>{`
        @keyframes fadein {
          from { opacity: 0; transform: scale(.97);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadein {
          animation: fadein .15s ease;
        }
      `}</style>
    </div>
  );
}