(() => {
  const { validationResult } = require("express-validator");

  const Product = require("../models/product");

  exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
      .then((products) => {
        res.render("admin/product-list", {
          products,
          path: "/admin/products",
          pageTitle: "Admin Products",
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Admin Panel",
      editMode: false,
      hasError: false,
      errorMessage: null,
      validationError: [],
    });
  };

  exports.postAddProduct = (req, res, next) => {
    const { title, price, description } = req.body,
      image = req.file,
      errors = validationResult(req);

    if (!image) {
      return res.status(422).render("admin/edit-product", {
        product: {
          title,
          price,
          description,
        },
        path: "/admin/edit-product",
        pageTitle: "Add Product",
        hasError: true,
        editMode: false,
        errorMessage: "Please pick a file with png, jpg or jpeg format",
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        product: {
          title,
          price,
          description,
        },
        path: "/admin/edit-product",
        pageTitle: "Add Product",
        hasError: true,
        editMode: false,
        errorMessage: errors.array()[0].msg,
      });
    }

    const product = new Product({
      title,
      price,
      image: image.path,
      description,
      userId: req.user._id,
    });

    product
      .save()
      .then(() => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
      return res.redirect("/");
    }
    const { productId } = req.params;
    Product.findById(productId)
      .then((product) => {
        if (!product) {
          return res.redirect("/");
        }
        res.render("admin/edit-product", {
          product,
          path: "/admin/edit-product",
          pageTitle: "Edit Product",
          editMode: true,
          hasError: false,
          errorMessage: null,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.postEditProduct = (req, res, next) => {
    const { title, price, description, productId } = req.body,
      image = req.file,
      errors = validationResult(req);

    if (!image) {
      return res.status(422).render("admin/edit-product", {
        product: {
          title,
          price,
          description,
        },
        path: "/admin/edit-product",
        pageTitle: "Edit Product",
        hasError: true,
        editMode: false,
        errorMessage: "Please pick a file with png, jpg or jpeg format",
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        product: {
          title,
          price,
          description,
          _id: productId,
        },
        path: "/admin/edit-product",
        pageTitle: "Edit Product",
        hasError: true,
        editMode: true,
        errorMessage: errors.array()[0].msg,
      });
    }

    Product.findById(productId)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect("/");
        }

        product.title = title;
        product.price = price;
        if (image) {
          deleteFile(product.image.url);
          product.image = image.url;
        }
        product.description = description;

        return product.save().then(() => res.redirect("/admin/products"));
      })

      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
      .then((product) => {
        return Product.deleteOne({
          _id: productId,
          userId: req.user._id,
        });
      })
      .then(() => res.status(200).json({ message: "success" }))
      .catch((err) =>
        res.status(500).json({ message: "product deleting failed" })
      );
  };
})();
