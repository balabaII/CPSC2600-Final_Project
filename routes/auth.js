(() => {
  const express = require("express");
  const { body } = require("express-validator");

  const router = express.Router();

  const authController = require("../controllers/auth");
  const User = require("../models/user");

  router.get("/login", authController.getLogin);
  router.post(
    "/login",
    body("email", "Please enter a valid email").isEmail().normalizeEmail(),
    body("password", "Password should be at least 5 characters long")
      .isLength({
        min: 5,
      })
      .trim(),
    authController.postLogin
  );

  router.get("/signup", authController.getSignup);
  router.post(
    "/signup",
    body("email")
      .isEmail()
      .withMessage("please enter a valid email")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Account with this email is already used");
          }
        });
      }),
    body("password", "Minimum password length is five characters")
      .isLength({
        min: 5,
      })
      .trim(),
    body("passwordConfirm")
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Password have to match");
        return true;
      })
      .trim(),
    authController.postSignup
  );

  router.post("/logout", authController.postLogout);

  module.exports = router;
})();
