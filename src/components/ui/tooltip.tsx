"use client";

import * as React from "react";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children, asChild = false }: { children: React.ReactNode; asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {});
  }
  return <button className="inline-flex">{children}</button>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-3 py-1 text-sm text-slate-800 shadow-md">
      {children}
    </div>
  );
}

export default Tooltip;
