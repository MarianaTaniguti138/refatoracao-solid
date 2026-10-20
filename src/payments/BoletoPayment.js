class BoletoPayment {
  process() {
    return {
      paymentFee: 0,
      paymentStatus: "waiting_payment",
      discount: 0
    };
  }
}

module.exports = BoletoPayment;
