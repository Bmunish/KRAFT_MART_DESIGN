"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  description?: string;
  features?: string[];
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  if (!product) return null;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-kraft max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-kraft-cream transition-colors"
            >
              <X className="w-5 h-5 text-kraft-ink" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative bg-kraft-cream aspect-square md:aspect-auto md:min-h-[500px] flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-kraft-maroon text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {product.badge}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute bottom-4 left-4 bg-kraft-ink text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                    Save {discount}%
                  </div>
                )}
              </div>

              {/* Details Side */}
              <div className="p-8 flex flex-col">
                <p className="text-xs font-bold tracking-[0.2em] text-kraft-gold uppercase mb-2">
                  KraftMart
                </p>
                <h2 className="text-2xl font-bold text-kraft-ink mb-3 leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-kraft-gold text-kraft-gold"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-kraft-maroon">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {product.description ||
                    "Handcrafted with precision by master artisans. Each piece is unique and carries the legacy of traditional craftsmanship. Made from premium materials with attention to every detail."}
                </p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Truck, label: "Free Shipping" },
                    { icon: Shield, label: "2-Year Warranty" },
                    { icon: RotateCcw, label: "30-Day Returns" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 p-3 bg-kraft-cream rounded-kraft-sm text-center"
                    >
                      <feature.icon className="w-5 h-5 text-kraft-maroon" />
                      <span className="text-[10px] font-semibold text-kraft-ink uppercase tracking-wider">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3.5 bg-kraft-maroon text-white rounded-kraft-sm font-semibold text-sm tracking-wide hover:bg-kraft-maroon-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3.5 border-2 border-kraft-cream-dark rounded-kraft-sm text-gray-400 hover:border-kraft-maroon hover:text-kraft-maroon transition-all"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
