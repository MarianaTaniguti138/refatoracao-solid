class CreditCardPayment {
  process(subtotal, installments = 1) {
    return {
      paymentFee: installments > 1 ? subtotal * 0.025 : 0,
      paymentStatus: "approved",
      discount: 0
    };
  }
}

module.exports = CreditCardPayment;
