class FreightCalculator {
  constructor() {
    this.freightRules = {
      sudeste: { base: 20, rate: 4 },
      sul: { base: 28, rate: 5 },
      "centro-oeste": { base: 35, rate: 6 },
      nordeste: { base: 45, rate: 7 },
      norte: { base: 60, rate: 9 },
      default: { base: 50, rate: 8 }
    };
  }

  calculate(totalWeight, region, couponCode) {
    // Seleciona a regra da região ou a regra padrão.
    const rule = this.freightRules[region] || this.freightRules.default;

    let freight = rule.base + totalWeight * rule.rate;

    // Aplica o benefício do frete grátis.
    if (couponCode === "FRETEGRATIS") {
      freight = 0;
    }

    return freight;
  }
}

module.exports = FreightCalculator;
