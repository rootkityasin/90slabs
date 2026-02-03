"use client";

import React, { useState } from "react";

interface User {
  name: string;
  role?: string;
  image?: string;
}

interface Props {
  users: User[];
  variant?: "centered" | "left" | "stack";
  size?: number;
  sizeStep?: number;
  overlap?: number; // negative to overlap
  ringColor?: string; // tailwind ring class e.g. 'ring-[#008f7d]'
  hoverScale?: number;
  tooltipBg?: string; // tailwind bg class
}

export function AvatarSmartGroup({
  users,
  variant = "left",
  size = 48,
  sizeStep = 8,
  overlap = -12,
  ringColor = "ring-white",
  hoverScale = 1.06,
  tooltipBg = "bg-white",
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (!users || users.length === 0) return null;

  return (
    <div className={`flex items-center ${variant === "centered" ? "justify-center" : "justify-start"}`}>
      {users.map((u, i) => {
        const sizeOffset = Math.max(24, size - i * sizeStep);
        const marginLeft = i === 0 ? 0 : overlap;
        const imgSrc = u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=fff&color=000`;

        return (
          <div
            key={u.name + i}
            className="group relative"
            style={{ marginLeft }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={`rounded-full overflow-hidden transition-transform duration-200 ${ringColor} ring-2`}
              style={{ width: sizeOffset, height: sizeOffset, transform: hovered === i ? `scale(${hoverScale})` : "scale(1)" }}
            >
              <img src={imgSrc} alt={u.name} width={sizeOffset} height={sizeOffset} className="object-cover w-full h-full" />
            </div>

            {hovered === i && (
              <div
                className={`absolute left-1/2 -top-12 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-md text-sm shadow-md text-slate-800 ${tooltipBg}`}
                style={{ zIndex: 40 }}
              >
                <div className="font-medium">{u.name}</div>
                {u.role && <div className="text-xs text-slate-600">{u.role}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AvatarSmartGroup;
