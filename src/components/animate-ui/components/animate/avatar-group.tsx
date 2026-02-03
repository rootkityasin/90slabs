"use client";

import * as React from "react";

export function AvatarGroup({
  children,
  className = "",
  invertOverlap = true,
  translateX = "-30%",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  invertOverlap?: boolean;
  translateX?: string | number;
}) {
  const overlapClass = invertOverlap ? "-space-x-3" : "space-x-3";
  const translateStyle =
    typeof translateX === "number" ? `${translateX}px` : translateX;

  return (
    <div
      className={`flex items-center ${overlapClass} ${className}`}
      style={{ transform: `translateX(${translateStyle})` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarGroupTooltip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs text-slate-800 shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${className}`}
    >
      {children}
    </span>
  );
}
