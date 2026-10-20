class FreightCalculator {
  constructor(customRules = {}) {
    this.freightRules = {
      sudeste: { base: 20, rate: 4 },
      sul: { base: 28, rate: 5 },
      "centro-oeste": { base: 35, rate: 6 },
      nordeste: { base: 45, rate: 7 },
      norte: { base: 60, rate: 9 },
      default: { base: 50, rate: 8 },
      ...customRules
    };
  }

  calculate(totalWeight, region, couponCode) {
    const rule =
      this.freightRules[region] || this.freightRules.default;

    let freight = rule.base + totalWeight * rule.rate;

    if (couponCode === "FRETEGRATIS") {
      freight = 0;
    }

    return freight;
  }
}

module.exports = FreightCalculator;
