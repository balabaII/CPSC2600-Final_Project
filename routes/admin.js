(() => {
  const express = require("express");
  const { body } = require("express-validator");

  const isAuth = require("../middlewear/is-auth");
  const adminController = require("../controllers/admin");

  const router = express.Router();

  router.get("/products", isAuth, adminController.getProducts);

  router.get("/add-product", isAuth, adminController.getAddProduct);
  router.post(
    "/add-product",
    [
      body("title").isString().isLength({ min: 3 }).trim(),
      body("price").isNumeric().trim(),
      body("description").isLength({ min: 10 }).trim(),
    ],
    isAuth,
    adminController.postAddProduct
  );

  router.get(
    "/edit-product/:productId",
    isAuth,
    adminController.getEditProduct
  );
  router.post(
    "/edit-product",
    [
      body("title").isString().isLength({ min: 3 }).trim(),
      body("price").isNumeric().trim(),
      body("description").isLength({ min: 10 }).trim(),
    ],
    isAuth,
    adminController.postEditProduct
  );
  router.delete("/products/:productId", isAuth, adminController.deleteProduct);

  module.exports = router;
})();
