class FreightCalculator {
  calculate(totalWeight, region, couponCode) {
    // Cada região tem um valor fixo e uma taxa por peso.
    const freightRules = {
      sudeste: { base: 20, rate: 4 },
      sul: { base: 28, rate: 5 },
      "centro-oeste": { base: 35, rate: 6 },
      nordeste: { base: 45, rate: 7 },
      norte: { base: 60, rate: 9 }
    };

    const rule = freightRules[region];

    // Se a região não estiver cadastrada, usa o valor padrão.
    const base = rule ? rule.base : 50;
    const rate = rule ? rule.rate : 8;

    let freight = base + totalWeight * rate;

    if (couponCode === "FRETEGRATIS") {
      freight = 0;
    }

    return freight;
  }
}

module.exports = FreightCalculator;
