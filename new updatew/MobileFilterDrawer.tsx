"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  filterCount?: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  children,
  filterCount = 0,
}: MobileFilterDrawerProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => onClose()}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-kraft-cream-dark rounded-kraft-sm text-sm font-medium text-kraft-ink"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {filterCount > 0 && (
          <span className="bg-kraft-maroon text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-kraft-cream z-50 overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-kraft-cream z-10 flex items-center justify-between p-5 border-b border-kraft-cream-dark">
                <h2 className="text-lg font-bold text-kraft-ink">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
