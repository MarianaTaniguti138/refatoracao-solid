const test = require("node:test");
const assert = require("node:assert/strict");
const FreightCalculator = require("../src/calculators/FreightCalculator");

test("deve calcular o frete para a região sudeste", () => {
  const calculator = new FreightCalculator();

  assert.equal(calculator.calculate(10, "sudeste"), 60);
});

test("deve zerar o frete com o cupom FRETEGRATIS", () => {
  const calculator = new FreightCalculator();

  assert.equal(calculator.calculate(10, "sudeste", "FRETEGRATIS"), 0);
});

test("deve calcular o frete padrão para uma região desconhecida", () => {
  const calculator = new FreightCalculator();

  assert.equal(calculator.calculate(10, "outra-regiao"), 130);
});
