import React, { useEffect } from 'react';
import { money } from '../utils/finance.js';

function OperationDetail({ operation, onClose }) {
  const result = operation.result;
  const date = new Date(operation.date).toLocaleString('es-DO', { dateStyle: 'long', timeStyle: 'short' });
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="operation-dialog" role="dialog" aria-modal="true" aria-labelledby="operation-title">
      <button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar detalle">×</button>
      <span className="eyebrow">DETALLE GUARDADO</span>
      <h2 id="operation-title">{operation.label}</h2>
      <p className="dialog-date">{date}</p>
      <div className="detail-grid">
        <div><span>Capital inicial</span><strong>{money(operation.principal, operation.currency)}</strong></div>
        <div><span>Tasa anual nominal</span><strong>{operation.rate}%</strong></div>
        <div><span>Plazo</span><strong>{operation.years} {operation.years === 1 ? 'año' : 'años'}</strong></div>
        {operation.type === 'savings' && <div><span>Aporte mensual</span><strong>{money(operation.monthlyContribution, operation.currency)}</strong></div>}
        <div className="detail-total"><span>{result.mainLabel}</span><strong>{money(result.main, operation.currency)}</strong></div>
        <div><span>Monto total</span><strong>{money(result.total, operation.currency)}</strong></div>
        <div><span>Intereses</span><strong>{money(result.interest, operation.currency)}</strong></div>
        {result.contributionsTotal > 0 && <div><span>Total aportado</span><strong>{money(result.contributionsTotal, operation.currency)}</strong></div>}
      </div>
      {result.schedule && <details className="schedule detail-schedule" open>
        <summary>Tabla de amortización · {result.months} meses</summary>
        <div className="table-scroll"><table><thead><tr><th>Mes</th><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr></thead><tbody>
          {result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment, operation.currency)}</td><td>{money(row.principalPaid, operation.currency)}</td><td>{money(row.interest, operation.currency)}</td><td>{money(row.balance, operation.currency)}</td></tr>)}
        </tbody></table></div>
      </details>}
      <button type="button" className="dialog-done" onClick={onClose}>Cerrar detalle</button>
    </section>
  </div>;
}

export default function SimulationHistory({ history, onClear, onSelect, selected, onClose }) {
  return <>
    <section className="panel history">
      <div className="history-heading"><div><span className="eyebrow">TU REGISTRO PERSONAL</span><h2>Operaciones guardadas</h2><p>Solo aparecen las simulaciones que eliges guardar.</p></div>{history.length > 0 && <button className="text-button" type="button" onClick={onClear}>Borrar registro</button>}</div>
      {history.length === 0 ? <div className="history-empty"><span>◷</span><p>Aún no hay operaciones guardadas.<br />Calcula una simulación y pulsa <strong>Guardar esta operación</strong>.</p></div> : <ol className="history-list">
        {history.map((item, index) => <li key={item.id}>
          <button className="history-item" type="button" onClick={() => onSelect(item)}>
            <span className="history-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="history-description"><strong>{item.label}</strong><small>{new Date(item.date).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })} · {item.years} {item.years === 1 ? 'año' : 'años'} · {item.rate}%</small></span>
            <span className="history-amount"><strong>{money(item.result.main, item.currency)}</strong><small>{item.type === 'loan' ? 'cuota mensual' : item.result.mainLabel}</small></span>
            <span className="history-arrow" aria-hidden="true">↗</span>
          </button>
        </li>)}
      </ol>}
    </section>
    {selected && <OperationDetail operation={selected} onClose={onClose} />}
  </>;
}
