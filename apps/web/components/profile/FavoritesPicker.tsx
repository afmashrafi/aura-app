"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FavoriteCategory } from "@aura/types";

const MIN_ITEMS = 3;

export const FAVORITE_CATEGORY_META = [
  { id: "music",    label: "Music",      emoji: "🎵", placeholder: "e.g. Bohemian Rhapsody" },
  { id: "artists",  label: "Artists",    emoji: "🎤", placeholder: "e.g. The Weeknd" },
  { id: "movies",   label: "Movies",     emoji: "🎬", placeholder: "e.g. Inception" },
  { id: "shows",    label: "TV Shows",   emoji: "📺", placeholder: "e.g. Breaking Bad" },
  { id: "anime",    label: "Anime",      emoji: "⛩️", placeholder: "e.g. Attack on Titan" },
  { id: "books",    label: "Books",      emoji: "📚", placeholder: "e.g. Dune" },
  { id: "games",    label: "Games",      emoji: "🎮", placeholder: "e.g. The Last of Us" },
  { id: "podcasts", label: "Podcasts",   emoji: "🎙️", placeholder: "e.g. Lex Fridman" },
  { id: "albums",   label: "Albums",     emoji: "💿", placeholder: "e.g. After Hours" },
  { id: "directors",label: "Directors",  emoji: "🎥", placeholder: "e.g. Christopher Nolan" },
] as const;

interface FavoritesPickerProps {
  favorites: FavoriteCategory[];
  onChange: (favorites: FavoriteCategory[]) => void;
}

function CategoryInput({
  meta,
  items,
  onAdd,
  onRemove,
}: {
  meta: (typeof FAVORITE_CATEGORY_META)[number];
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = Math.max(0, MIN_ITEMS - items.length);

  function commit() {
    const trimmed = value.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
    }
    setValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Backspace" && value === "" && items.length > 0) {
      onRemove(items[items.length - 1]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border-2 border-divider bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2 flex items-center gap-2">
        <span className="text-lg">{meta.emoji}</span>
        <span className="text-sm font-bold text-ink">{meta.label}</span>
        <span className="ml-auto text-xs text-ink-muted">
          {items.length >= MIN_ITEMS ? (
            <span className="text-success font-medium">✓ {items.length} added</span>
          ) : (
            `${remaining} more needed`
          )}
        </span>
      </div>

      {/* Chips + input */}
      <div
        className="flex flex-wrap gap-1.5 px-4 pb-3 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.span
              key={item}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-pale border border-primary/20 text-sm font-medium text-primary"
            >
              {item}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(item); }}
                className="text-primary/60 hover:text-primary transition-colors leading-none"
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (value.trim()) commit(); }}
          placeholder={items.length === 0 ? meta.placeholder : "Add more…"}
          className="flex-1 min-w-[120px] py-1.5 text-sm text-ink placeholder-ink-muted bg-transparent outline-none"
        />
      </div>

      <p className="px-4 pb-3 text-[11px] text-ink-muted">
        Press <kbd className="bg-surface px-1 py-0.5 rounded text-[10px]">Enter</kbd> or{" "}
        <kbd className="bg-surface px-1 py-0.5 rounded text-[10px]">,</kbd> to add each one
      </p>
    </motion.div>
  );
}

export function FavoritesPicker({ favorites, onChange }: FavoritesPickerProps) {
  const selectedIds = favorites.map((f) => f.category);

  function toggleCategory(id: string) {
    if (selectedIds.includes(id)) {
      onChange(favorites.filter((f) => f.category !== id));
    } else {
      onChange([...favorites, { category: id, items: [] }]);
    }
  }

  function addItem(categoryId: string, item: string) {
    onChange(
      favorites.map((f) =>
        f.category === categoryId ? { ...f, items: [...f.items, item] } : f
      )
    );
  }

  function removeItem(categoryId: string, item: string) {
    onChange(
      favorites.map((f) =>
        f.category === categoryId
          ? { ...f, items: f.items.filter((i) => i !== item) }
          : f
      )
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Category picker */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Choose categories
        </p>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_CATEGORY_META.map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                whileTap={{ scale: 0.93 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-150 select-none
                  ${isSelected
                    ? "border-primary bg-primary text-white shadow-[0_2px_12px_rgba(124,58,237,0.25)]"
                    : "border-divider bg-white text-ink hover:border-primary-light"
                  }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
        {selectedIds.length === 0 && (
          <p className="text-xs text-ink-muted mt-2">Pick at least one to continue.</p>
        )}
      </div>

      {/* Inputs for selected categories */}
      <AnimatePresence>
        {favorites.map((fav) => {
          const meta = FAVORITE_CATEGORY_META.find((c) => c.id === fav.category);
          if (!meta) return null;
          return (
            <CategoryInput
              key={fav.category}
              meta={meta}
              items={fav.items}
              onAdd={(item) => addItem(fav.category, item)}
              onRemove={(item) => removeItem(fav.category, item)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
