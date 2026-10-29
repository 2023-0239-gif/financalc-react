import React from 'react';
export const options = [
  { value: 'loan', label: 'Préstamo' },
  { value: 'simple', label: 'Interés simple' },
  { value: 'compound', label: 'Interés compuesto' },
  { value: 'savings', label: 'Ahorro' },
];
export default function CalculatorTabs({ value, onChange }) {
  return <div className="tabs" role="group" aria-label="Tipo de cálculo">{options.map((option) => <button type="button" key={option.value} className={value === option.value ? 'tab active' : 'tab'} onClick={() => onChange(option.value)} aria-pressed={value === option.value}>{option.label}</button>)}</div>;
}
