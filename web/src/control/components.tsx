// Small, touch-friendly control primitives for the phone settings panel.

import { useEffect, useState, type ReactNode } from "react";
import { round } from "@shared/index.js";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  );
}

export function Row({ label, children, hint, indent = false }: { label: string; children: ReactNode; hint?: string; indent?: boolean }) {
  return (
    <div className={`row ${indent ? "row-indent" : ""}`}>
      <div className="row-label">
        {label}
        {hint && <span className="row-hint">{hint}</span>}
      </div>
      <div className="row-control">{children}</div>
    </div>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`toggle ${value ? "on" : ""}`}
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

export function Slider({
  id,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  // Keep the handle under the pointer while dragging; parent value may lag after unit conversion.
  const [active, setActive] = useState(false);
  const [local, setLocal] = useState(value);
  useEffect(() => {
    if (!active) setLocal(value);
  }, [value, active]);

  const display = active ? local : value;
  const handleChange = (v: number) => {
    setLocal(v);
    onChange(v);
  };
  const release = () => setActive(false);

  return (
    <div className="slider">
      <input
        id={`${id}-slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={display}
        onPointerDown={() => setActive(true)}
        onPointerUp={release}
        onPointerCancel={release}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <span className="slider-value">
        <input
          id={`${id}-number`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={round(display, step >= 1 ? 0 : 1)}
          onFocus={() => setActive(true)}
          onBlur={release}
          onChange={(e) => handleChange(Number(e.target.value))}
        />
        {unit}
      </span>
    </div>
  );
}

export function TextInput({
  value,
  onCommit,
  placeholder,
  ariaLabel,
}: {
  value: string;
  /** Fired on blur / Enter with the trimmed value (only when it changed). */
  onCommit: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState(value);
  // Re-sync when the server's value changes (e.g. a rejected edit reverts).
  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== draft) setDraft(trimmed);
    if (trimmed !== value) onCommit(trimmed);
  };

  return (
    <input
      className="text-input"
      type="text"
      inputMode="url"
      value={draft}
      placeholder={placeholder}
      aria-label={ariaLabel}
      spellCheck={false}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o.value}
          className={`segment ${value === o.value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="color-row">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
