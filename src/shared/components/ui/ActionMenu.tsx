"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ActionItem {
  label: string;
  onClick: () => void;
}

interface ActionMenuProps {
  items: ActionItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[#45474c] hover:bg-[#f0edef]"
        aria-label="Open action menu"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-[#c5c6cd] bg-white p-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#1b1b1d] hover:bg-[#f5f3f4]"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
