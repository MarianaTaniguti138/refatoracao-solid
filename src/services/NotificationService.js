class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log(
      `Confirmação enviada para ${customer.name}. ` +
      `Pedido: ${orderId}. ` +
      `Total do pedido: R$ ${total.toFixed(2)}`
    );
  }
}

module.exports = NotificationService;