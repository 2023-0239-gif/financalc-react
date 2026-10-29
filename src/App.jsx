import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import CalculatorTabs from './components/CalculatorTabs.jsx';
import CalculatorForm from './components/CalculatorForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import SimulationHistory from './components/SimulationHistory.jsx';
import { calculate, money } from './utils/finance.js';

const initial = { principal: '100000', rate: '12', years: '2', monthlyContribution: '0' };
const labels = { loan: 'Préstamo', simple: 'Interés simple', compound: 'Interés compuesto', savings: 'Ahorro' };
// La clave nueva evita mostrar operaciones que la versión anterior guardaba automáticamente.
const HISTORY_KEY = 'financalc-saved-operations';

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(stored) ? stored.slice(0, 5) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [type, setType] = useState('loan');
  const [values, setValues] = useState({ ...initial });
  const [currency, setCurrency] = useState('DOP');
  const [result, setResult] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(readHistory);
  const [selectedOperation, setSelectedOperation] = useState(null);

  useEffect(() => { document.title = 'FinanCalc | Calculadora financiera'; }, []);
  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5))); } catch { /* El almacenamiento puede estar deshabilitado. */ }
  }, [history]);

  function clearCurrentResult() {
    setResult(null);
    setCurrentOperation(null);
    setError('');
  }

  function changeField(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
    clearCurrentResult();
  }

  function submit(event) {
    event.preventDefault();
    try {
      const calculated = calculate(type, values.principal, values.rate, values.years, values.monthlyContribution);
      const operation = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        label: labels[type],
        date: new Date().toISOString(),
        currency,
        principal: Number(values.principal),
        rate: Number(values.rate),
        years: Number(values.years),
        monthlyContribution: Number(values.monthlyContribution || 0),
        result: calculated,
      };
      setResult(calculated);
      setCurrentOperation(operation);
      setError('');
    } catch (err) {
      clearCurrentResult();
      setError(err.message);
    }
  }

  function saveCurrentOperation() {
    if (!currentOperation || history.some((item) => item.id === currentOperation.id)) return;
    setHistory((previous) => [currentOperation, ...previous].slice(0, 5));
  }

  function reset() {
    setValues({ ...initial });
    clearCurrentResult();
  }

  const currentIsSaved = Boolean(currentOperation && history.some((item) => item.id === currentOperation.id));

  return <>
    <Header />
    <main className="shell">
      <div className="intro">
        <div><span className="eyebrow">PLANIFICACIÓN FINANCIERA PERSONAL</span><h1>Haz que tus números<br /><em>trabajen para ti.</em></h1><p>Simula escenarios, compara opciones y toma decisiones con más claridad.</p></div>
        <div className="intro-note"><span className="intro-note-icon">✳</span><span>Simple, privado<br />y a tu ritmo.</span></div>
      </div>
      <CalculatorTabs value={type} onChange={(next) => { setType(next); clearCurrentResult(); }} />
      {error && <p className="error" role="alert"><span>!</span>{error}</p>}
      <div className="layout">
        <CalculatorForm
          type={type}
          values={values}
          currency={currency}
          onCurrencyChange={(next) => { setCurrency(next); clearCurrentResult(); }}
          onFieldChange={changeField}
          onSubmit={submit}
          onReset={reset}
        />
        <ResultCard result={result} currency={currency} isSaved={currentIsSaved} onSave={saveCurrentOperation} />
      </div>
      <SimulationHistory
        history={history}
        onClear={() => setHistory([])}
        onSelect={setSelectedOperation}
        selected={selectedOperation}
        onClose={() => setSelectedOperation(null)}
        money={money}
      />
    </main>
    <footer className="shell footer"><span>FinanCalc</span><span>Simulación educativa · Tus datos permanecen en este navegador</span></footer>
  </>;
}
