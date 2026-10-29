import React from 'react';
import { money } from '../utils/finance.js';

export default function ResultCard({ result, currency, isSaved, onSave }) {
  if (!result) return <section className="panel empty result-empty" aria-live="polite"><div className="empty-icon">↗</div><span className="result-kicker">TU PRÓXIMO PASO</span><h2>Tu resultado<br />aparecerá aquí</h2><p>Completa los datos y calcula para ver una proyección.</p></section>;

  return <section className="panel results" aria-live="polite">
    <div className="result-heading"><div><span className="result-kicker">RESUMEN DE LA SIMULACIÓN</span><h2>Una mirada clara<br />a tus números.</h2></div><span className="result-badge">✓</span></div>
    <div className="hero-result"><span>{result.mainLabel}</span><strong>{money(result.main, currency)}</strong>{result.months && <small>{result.months} meses</small>}</div>
    <div className="metric"><span>Monto total</span><strong>{money(result.total, currency)}</strong></div>
    <div className="metric"><span>Intereses generados / pagados</span><strong>{money(result.interest, currency)}</strong></div>
    {result.contributionsTotal > 0 && <div className="metric"><span>Aportes realizados</span><strong>{money(result.contributionsTotal, currency)}</strong></div>}
    {result.schedule && <details className="schedule">
      <summary>Consultar tabla de amortización</summary>
      <div className="table-scroll"><table>
        <thead><tr><th>Mes</th><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr></thead>
        <tbody>{result.schedule.map((row) => <tr key={row.month}>
          <td>{row.month}</td><td>{money(row.payment, currency)}</td><td>{money(row.principalPaid, currency)}</td><td>{money(row.interest, currency)}</td><td>{money(row.balance, currency)}</td>
        </tr>)}</tbody>
      </table></div>
    </details>}
    <p className="disclaimer">Estimación educativa. No incluye comisiones, impuestos, seguros ni cargos particulares.</p>
    <button className={`save-operation ${isSaved ? 'is-saved' : ''}`} type="button" onClick={onSave} disabled={isSaved}>{isSaved ? '✓ Operación guardada' : '＋ Guardar esta operación'}</button>
  </section>;
}
