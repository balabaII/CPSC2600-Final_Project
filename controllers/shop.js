(() => {
  const mongoose = require("mongoose");

  const Product = require("../models/product");

  exports.getIndex = (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          products,
          path: "/",
          pageTitle: "Home",
        });
      })
      .catch((err) => next(new Error(err)));
  };

  exports.getProducts = (req, res) => {
    Product.find()
      .then((products) => {
        res.render("shop/product-list", {
          products,
          path: "/products",
          pageTitle: "Products",
        });
      })
      .catch((err) => console.log(err));
  };

  exports.getProduct = (req, res) => {
    const prodId = new mongoose.Types.ObjectId(req.params.productId);
    Product.findById(prodId)
      .then((product) => {
        console.log(product);
        res.render("shop/product-detail", {
          product,
          path: "/products",
          pageTitle: `${product.title} details`,
        });
      })
      .catch((err) => console.log(err));
  };

  exports.getCart = async (req, res, next) => {
    const user = await req.user.populate("cart.items.productId");
    console.log(user.cart.items);
    res.render("shop/cart", {
      products: user.cart.items,
      path: "/cart",
      pageTitle: " Your Cart",
    });
  };

  exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId)
      .then((product) => {
        return req.user.addToCart(product);
      })
      .then(() => {
        res.redirect("/cart");
      });
  };

  exports.postCartDeleteItem = (req, res, next) => {
    const { productId } = req.body;
    req.user
      .deleteItemById(productId)
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  };
})();
