class PixPayment {
  process(subtotal) {
    return {
      paymentFee: 0,
      paymentStatus: "approved",
      discount: subtotal * 0.03
    };
  }
}

module.exports = PixPayment;
