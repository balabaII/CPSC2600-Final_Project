(() => {
  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  });

  userSchema.methods.addToCart = function (product) {
    //getting all the items from the user's cart
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;

    //checking if the product is existing in the cart items
    const cartProductIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );

    //if it exist it get the item, increments its quantity and updates itself in cart items
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } //otherwise we create a new item with product's id and default quantity of 1
    else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    this.cart = updatedCart;
    //updating the cart in database and returning a promise
    return this.save();
  };

  userSchema.methods.deleteItemById = function (productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    this.cart.items = updatedCartItems;

    return this.save();
  };

  userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
  };
  module.exports = mongoose.model("User", userSchema);
})();
