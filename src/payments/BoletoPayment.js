const PaymentMethod = require("./contracts/PaymentMethod");

class BoletoPayment extends PaymentMethod {
  process() {
    return {
      paymentFee: 0,
      paymentStatus: "waiting_payment",
      discount: 0
    };
  }
}

module.exports = BoletoPayment;

