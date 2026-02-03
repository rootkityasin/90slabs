"use client";

import * as React from "react";

export function Avatar({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative group inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={`h-full w-full object-cover ${className}`} {...props} />;
}

export function AvatarFallback({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
