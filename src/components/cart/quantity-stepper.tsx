"use client";

export function QuantityStepper({
  value,
  onChange,
  min = 1
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex min-h-12 items-center overflow-hidden rounded-full border border-primary/15 bg-white">
      <button className="h-11 w-11 text-lg text-primary transition-colors hover:bg-muted" onClick={() => onChange(Math.max(min, value - 1))} type="button">
        -
      </button>
      <span className="w-11 text-center text-sm font-semibold">{value}</span>
      <button className="h-11 w-11 text-lg text-primary transition-colors hover:bg-muted" onClick={() => onChange(value + 1)} type="button">
        +
      </button>
    </div>
  );
}
