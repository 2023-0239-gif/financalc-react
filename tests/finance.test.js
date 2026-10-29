import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, money } from '../src/utils/finance.js';

test('interés simple aplica I = P * r * t', () => {
  const result = calculate('simple', 1000, 12, 2);
  assert.equal(result.interest, 240);
  assert.equal(result.total, 1240);
});

test('interés compuesto conserva el capital cuando la tasa es cero', () => {
  const result = calculate('compound', 1000, 0, 2);
  assert.equal(result.total, 1000);
  assert.equal(result.interest, 0);
});

test('préstamo a tasa cero reparte el capital entre las cuotas', () => {
  const result = calculate('loan', 1200, 0, 1);
  assert.equal(result.main, 100);
  assert.equal(result.schedule.length, 12);
  assert.equal(result.schedule.at(-1).balance, 0);
  assert.ok(Math.abs(result.total - 1200) < 1e-9);
});

test('rechaza capital, tasa, plazo y aportes inválidos', () => {
  assert.throws(() => calculate('simple', -1, 12, 2), /capital y plazo/);
  assert.throws(() => calculate('simple', 100, -1, 2), /capital y plazo/);
  assert.throws(() => calculate('simple', 100, 12, 0), /capital y plazo/);
  assert.throws(() => calculate('savings', 100, 12, 1, -5), /capital y plazo/);
});

test('ahorro con tasa cero suma aportes mensuales sin interés', () => {
  const result = calculate('savings', 1000, 0, 1, 100);
  assert.equal(result.months, 12);
  assert.equal(result.contributionsTotal, 1200);
  assert.equal(result.total, 2200);
  assert.equal(result.interest, 0);
});

test('tabla del préstamo termina en saldo cero y reconcilia totales', () => {
  const result = calculate('loan', 100000, 12, 2);
  assert.equal(result.schedule.length, 24);
  assert.equal(result.schedule.at(-1).balance, 0);
  const scheduleTotal = result.schedule.reduce((sum, row) => sum + row.payment, 0);
  assert.ok(Math.abs(scheduleTotal - result.total) < 1e-8);
});

test('formatea monedas seleccionadas', () => {
  assert.match(money(1000, 'DOP'), /RD\$/);
  assert.match(money(1000, 'USD'), /\$/);
});
