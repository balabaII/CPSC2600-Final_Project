(() => {
  const config = {};
  config.PORT = process.env.PORT || 8080;
  config.ROOT = `${__dirname}/../../views`;
  config.MONGODB_URI =
    "mongodb+srv://erball:D88RaB6XjP0ENtC7@ecommerce.kzixnu4.mongodb.net/ecommerce";
  // mongodb+srv://erball:<password>@ecommerce.kzixnu4.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce
  module.exports = config;
})();
