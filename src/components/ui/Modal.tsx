"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = "md",
      closeOnOverlayClick = true,
      closeOnEscape = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose();
        }
      };

      const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === overlayRef.current && closeOnOverlayClick) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      overlayRef.current?.addEventListener("click", handleOverlayClick);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        overlayRef.current?.removeEventListener("click", handleOverlayClick);
        document.body.style.overflow = "";
      };
    }, [isOpen, closeOnEscape, closeOnOverlayClick, onClose]);

    if (!isOpen) return null;

    const modalContent = (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div
          ref={contentRef}
          className={cn(
            "w-full bg-white rounded-2xl shadow-2xl animate-slide-up",
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {(title) && (
            <div className="flex items-start justify-between p-6 border-b border-neutral-200">
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="mt-1 text-sm text-neutral-500">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );

    if (typeof window === "undefined") return null;
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: AlertDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title} description={description}>
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            "px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50",
            variant === "danger"
              ? "bg-error-500 hover:bg-error-600"
              : "bg-brand-500 hover:bg-brand-600"
          )}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}