"use client";

import React from "react";

export function AvatarGroup({ children, className = "flex items-center" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function Avatar({ children, className = "relative" }: { children: React.ReactNode; className?: string }) {
  return <div className={`inline-flex ${className}`}>{children}</div>;
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} className={`rounded-full object-cover ${props.className || ""}`} />;
}

export function AvatarFallback({ children, className = "bg-gray-200 text-gray-700" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-full flex items-center justify-center ${className}`} style={{ width: 48, height: 48 }}>
      {children}
    </div>
  );
}

export function AvatarGroupTooltip({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export default AvatarGroup;
