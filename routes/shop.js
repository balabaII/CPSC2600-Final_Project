(() => {
  const express = require("express");
  const router = express.Router();

  const isAuth = require("../middlewear/is-auth");
  const shopController = require("../controllers/shop");

  router.get("/", shopController.getIndex);

  router.get("/products", shopController.getProducts);
  router.get("/products/:productId", shopController.getProduct);

  router.get("/cart", isAuth, shopController.getCart);
  router.post("/cart", isAuth, shopController.postCart);
  router.post("/cart-delete-item", isAuth, shopController.postCartDeleteItem);

  module.exports = router;
})();
