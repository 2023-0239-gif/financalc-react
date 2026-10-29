# FinanCalc

Calculadora financiera educativa hecha con React y Vite. Incluye cuatro simulaciones, selector de moneda, tabla de amortización, ahorro con aportes mensuales opcionales e historial local.

## Requisitos y ejecución

Necesitas Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abre la dirección que muestre Vite. Para generar una compilación de producción usa `npm run build`; para correr las pruebas usa `npm test`.

## Modalidades y fórmulas

- **Interés simple:** `I = P * r * t`; total `P + I`.
- **Interés compuesto:** `A = P * (1 + r/12) ** (12*t)`.
- **Préstamo:** cuota fija `C = P * i / (1 - (1+i)**(-n))`; `i = r/12` y `n = round(12*t)`. Si `i = 0`, `C = P/n`. Incluye tabla mensual de capital, interés y saldo.
- **Ahorro:** depósito inicial capitalizado mensualmente y aportes mensuales opcionales al final del mes. Sin aporte, queda la proyección de un depósito único. Los meses completos de aportación se cuentan con `floor(12*t)`.

La tasa se introduce como porcentaje anual nominal (por ejemplo, `12` equivale a 12%) y se convierte a decimal dividiendo entre 100. Los cálculos son estimaciones; no incluyen comisiones, impuestos, seguros ni condiciones específicas de entidades financieras.

## Funciones adicionales

- Moneda seleccionable entre DOP y USD.
- Últimas cinco simulaciones guardadas en `localStorage` del navegador actual. El historial puede borrarse desde la interfaz.
- Pruebas automatizadas con `node:test` para tasas cero, entradas inválidas, ahorro y tabla de amortización.

## Estructura

- `src/App.jsx`: estado, eventos y coordinación.
- `src/components/`: encabezado, selector, formulario, campo numérico, resultados e historial.
- `src/utils/finance.js`: fórmulas y formato monetario, sin dependencias de React.
- `src/styles.css`: estilos adaptables a móvil y escritorio.
- `tests/finance.test.js`: pruebas de las funciones financieras.
