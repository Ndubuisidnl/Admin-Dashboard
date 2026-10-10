"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-warm-white rounded-xl shadow-xl max-w-md w-full border border-border-warm overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-xl font-serif font-bold text-dark-wood mb-2">
          {title}
        </h3>
        <p className="text-text-muted text-sm mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-text-dark bg-cream hover:bg-cream-card rounded-lg border border-border-warm transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center space-x-2 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-warm-amber hover:bg-warm-amber-hover"
            }`}
          >
            {isLoading && <LoadingSpinner size="sm" className="border-white" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
