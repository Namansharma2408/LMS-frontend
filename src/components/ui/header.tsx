import type { ReactNode } from "react";

export interface HeaderProps {
  title: string;
  text: string;
  actions?: ReactNode;
}

export function Header({ title, text, actions }: HeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{text}</p>
      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
}
