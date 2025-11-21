import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  title: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, text, isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800/80 z-50"
      onClick={onClose} // clicking backdrop closes modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-3">{title}</h2>

        {/* Body Text */}
        <div
          className="text-gray-800 text-md mb-4 space-y-2"
          dangerouslySetInnerHTML={{ __html: text }}
        />

        {/* Footer Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-op text-white text-sm rounded-md hover:bg-teal-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
