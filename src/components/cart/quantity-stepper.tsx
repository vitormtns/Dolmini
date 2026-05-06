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
    <div className="inline-flex h-10 items-center overflow-hidden rounded-md border">
      <button className="h-10 w-10 text-lg" onClick={() => onChange(Math.max(min, value - 1))} type="button">
        -
      </button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <button className="h-10 w-10 text-lg" onClick={() => onChange(value + 1)} type="button">
        +
      </button>
    </div>
  );
}
