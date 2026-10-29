import React from 'react';
export default function NumberField({ id, label, value, onChange, min = 0, step = 'any', hint }) {
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(event) => onChange(event.target.value)} required />{hint && <small>{hint}</small>}</div>;
}
