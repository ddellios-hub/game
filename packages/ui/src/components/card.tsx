import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  actions?: ReactNode;
}

export function Card({ title, actions, className, children, ...props }: CardProps) {
  return (
    <section
      role="group"
      className={clsx(
        "rounded-xl border border-primary/30 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-slate-900/70",
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {actions}
        </header>
      )}
      <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">{children}</div>
    </section>
  );
}
