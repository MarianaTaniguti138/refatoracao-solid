class PaymentMethod {
  process(subtotal, installments = 1) {
    throw new Error(
      "O método process() deve ser implementado pela forma de pagamento."
    );
  }
}

module.exports = PaymentMethod;