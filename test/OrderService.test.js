const test = require("node:test");
const assert = require("node:assert/strict");
const OrderService = require("../src/services/OrderService");

test("deve aceitar dependências externas pelo construtor", () => {
  const productRepository = {};
  const orderRepository = {};
  const notificationService = {};
  const logger = {};

  const service = new OrderService({
    productRepository,
    orderRepository,
    notificationService,
    logger
  });

  assert.equal(service.productRepository, productRepository);
  assert.equal(service.orderRepository, orderRepository);
  assert.equal(service.notificationService, notificationService);
  assert.equal(service.logger, logger);
});
