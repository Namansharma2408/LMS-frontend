import type { ReactNode } from "react";

export function Navbar({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <nav className={`flex items-center justify-between p-4 border-b border-border bg-background ${className}`}>{children}</nav>;
}
