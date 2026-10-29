// Las tasas se reciben como porcentaje anual nominal: 12 significa 12%.
export const currencies = {
  DOP: { locale: 'es-DO', label: 'Peso dominicano (RD$)' },
  USD: { locale: 'en-US', label: 'Dólar estadounidense (US$)' },
};

export function money(amount, currency = 'DOP') {
  const code = currencies[currency] ? currency : 'DOP';
  return new Intl.NumberFormat(currencies[code].locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculate(type, principal, annualRate, years, monthlyContribution = 0) {
  const P = Number(principal);
  const r = Number(annualRate) / 100;
  const t = Number(years);
  const contribution = Number(monthlyContribution ?? 0);

  if (![P, r, t, contribution].every(Number.isFinite) || P <= 0 || r < 0 || t <= 0 || contribution < 0) {
    throw new Error('Introduce un capital y plazo mayores que cero, una tasa no negativa y aportes mensuales iguales o mayores que cero.');
  }

  if (type === 'simple') {
    const interest = P * r * t;
    return { main: interest, mainLabel: 'Interés generado', total: P + interest, interest };
  }

  if (type === 'compound') {
    const total = P * Math.pow(1 + r / 12, 12 * t);
    return { main: total, mainLabel: 'Monto futuro', total, interest: total - P };
  }

  if (type === 'savings') {
    const months = Math.floor(t * 12 + Number.EPSILON);
    const monthlyRate = r / 12;
    const initialGrowth = P * Math.pow(1 + monthlyRate, 12 * t);
    const contributionsGrowth = monthlyRate === 0
      ? contribution * months
      : contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const total = initialGrowth + contributionsGrowth;
    const contributionsTotal = contribution * months;
    const interest = total - P - contributionsTotal;
    return {
      main: total,
      mainLabel: 'Ahorro proyectado',
      total,
      interest,
      months,
      monthlyContribution: contribution,
      contributionsTotal,
    };
  }

  if (type === 'loan') {
    const months = Math.round(t * 12);
    if (months < 1) throw new Error('El plazo del préstamo debe ser de al menos un mes.');
    const monthlyRate = r / 12;
    const payment = monthlyRate === 0
      ? P / months
      : (P * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    let balance = P;
    const schedule = [];
    for (let month = 1; month <= months; month += 1) {
      const interest = balance * monthlyRate;
      const principalPaid = month === months ? balance : payment - interest;
      const actualPayment = principalPaid + interest;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({ month, payment: actualPayment, principalPaid, interest, balance });
    }

    const total = schedule.reduce((sum, row) => sum + row.payment, 0);
    const interest = total - P;
    return { main: payment, mainLabel: 'Cuota mensual', total, interest, months, schedule };
  }

  throw new Error('Selecciona un cálculo válido.');
}
