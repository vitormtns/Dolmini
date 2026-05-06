import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  action
}: {
  label: string;
  value: string | number;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className="text-3xl font-semibold">{value}</strong>
        {action}
      </div>
    </div>
  );
}
