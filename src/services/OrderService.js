const ProductRepository = require("../repositories/ProductRepository");
const OrderRepository = require("../repositories/OrderRepository");
const NotificationService = require("./NotificationService");
const OrderSummaryPrinter = require("./OrderSummaryPrinter");
const Logger = require("../utils/Logger");
const FreightCalculator = require("../calculators/FreightCalculator");

class OrderService {
  constructor({
    productRepository = new ProductRepository(),
    orderRepository = new OrderRepository(),
    notificationService = new NotificationService(),
    orderSummaryPrinter = new OrderSummaryPrinter(),
    logger = new Logger(),
    freightCalculator = new FreightCalculator()
  } = {}) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.orderSummaryPrinter = orderSummaryPrinter;
    this.logger = logger;
    this.freightCalculator = freightCalculator;
  }

  process(order) {
    this.logger.info(
      `Iniciando processamento do pedido ${order.id}.`
    );

    // Valida os dados do cliente.
    if (!order.customer) {
      throw new Error("Cliente obrigatorio.");
    }

    if (
      !order.customer.email ||
      !order.customer.email.includes("@")
    ) {
      throw new Error("E-mail do cliente invalido.");
    }

    // Valida os itens do pedido.
    if (!order.items || order.items.length === 0) {
      throw new Error("Pedido sem itens.");
    }

    for (const item of order.items) {
      if (!item.product) {
        throw new Error("Item sem produto.");
      }

      if (item.quantity <= 0) {
        throw new Error("Quantidade invalida.");
      }

      const product = this.productRepository.findById(
        item.product.id
      );

      if (!product) {
        throw new Error(
          `Produto ${item.product.id} nao encontrado.`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Estoque insuficiente para ${product.name}.`
        );
      }
    }

    // Calcula o subtotal.
    let subtotal = 0;

    for (const item of order.items) {
      subtotal += item.product.price * item.quantity;
    }

    // Calcula os descontos.
    let discount = 0;

    if (order.customer.type === "vip") {
      discount += subtotal * 0.08;
    }

    if (order.customer.type === "employee") {
      discount += subtotal * 0.15;
    }

    if (order.couponCode === "TECH10") {
      discount += subtotal * 0.1;
    }

    if (subtotal > 8000) {
      discount += 250;
    }

    // Calcula o peso total dos itens.
    let totalWeight = 0;

    for (const item of order.items) {
      totalWeight +=
        item.product.weight * item.quantity;
    }

    // Calcula o frete em uma classe separada.
    const freight = this.freightCalculator.calculate(
      totalWeight,
      order.customer.getRegion(),
      order.couponCode
    );

    // Processa a forma de pagamento.
    let paymentFee = 0;
    let paymentStatus = "pending";

    if (order.paymentMethod === "pix") {
      paymentStatus = "approved";
      discount += subtotal * 0.03;
    } else if (order.paymentMethod === "credit_card") {
      if (order.installments > 1) {
        paymentFee = subtotal * 0.025;
      }

      paymentStatus = "approved";
    } else if (order.paymentMethod === "boleto") {
      paymentStatus = "waiting_payment";
    } else {
      throw new Error("Forma de pagamento invalida.");
    }

    // Calcula o total final.
    const total = Number(
      (subtotal - discount + freight + paymentFee).toFixed(2)
    );

    if (total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    // Atualiza o estoque dos produtos.
    for (const item of order.items) {
      this.productRepository.updateStock(
        item.product.id,
        item.quantity
      );
    }

    // Define o status do pedido.
    order.status =
      paymentStatus === "approved"
        ? "confirmed"
        : "waiting_payment";

    // Monta o resumo que será salvo no repositório.
    const orderSummary = {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: order.customer.getCity(),
      state: order.customer.getState(),
      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };

    // Salva o pedido.
    this.orderRepository.save(orderSummary);

    // Notifica o cliente ou registra que o pagamento está pendente.
    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(
        order.customer,
        order.id,
        total
      );
    } else {
      this.logger.warn(
        `Pedido ${order.id} aguardando pagamento.`
      );
    }

    // Delega a impressão do resumo para outra classe.
    this.orderSummaryPrinter.print(order, orderSummary);

    return orderSummary;
  }
}

module.exports = OrderService;