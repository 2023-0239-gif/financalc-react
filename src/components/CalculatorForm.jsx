import React from 'react';
import NumberField from './NumberField.jsx';

export default function CalculatorForm({ values, onFieldChange, onSubmit, onReset, type, currency, onCurrencyChange }) {
  const symbol = currency === 'DOP' ? 'RD$' : 'US$';
  return <form onSubmit={onSubmit} className="panel form">
    <h2>Datos de la simulación</h2>
    <div className="field">
      <label htmlFor="currency">Moneda</label>
      <select id="currency" value={currency} onChange={(event) => onCurrencyChange(event.target.value)}>
        <option value="DOP">Peso dominicano (RD$)</option>
        <option value="USD">Dólar estadounidense (US$)</option>
      </select>
    </div>
    <NumberField id="principal" label={`Capital inicial (${symbol})`} value={values.principal} onChange={(value) => onFieldChange('principal', value)} min="0.01" step="0.01" hint="Monto inicial para la simulación" />
    <NumberField id="rate" label="Tasa anual nominal (%)" value={values.rate} onChange={(value) => onFieldChange('rate', value)} min="0" step="0.01" hint="Ejemplo: 12 equivale a 12% anual" />
    <NumberField id="years" label="Plazo (años)" value={values.years} onChange={(value) => onFieldChange('years', value)} min="0.01" step="0.01" hint={type === 'loan' ? 'El préstamo se redondea al mes más cercano.' : 'Se permiten años decimales.'} />
    {type === 'savings' && <NumberField id="monthlyContribution" label={`Aporte mensual (${symbol})`} value={values.monthlyContribution} onChange={(value) => onFieldChange('monthlyContribution', value)} min="0" step="0.01" hint="Opcional. Se deposita al final de cada mes." />}
    <div className="actions">
      <button className="primary" type="submit">Calcular</button>
      <button className="secondary" type="button" onClick={onReset}>Limpiar</button>
    </div>
  </form>;
}
