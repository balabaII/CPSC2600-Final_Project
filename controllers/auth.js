(() => {
  const { validationResult } = require("express-validator");

  const bcrypt = require("bcryptjs");

  const User = require("../models/user");

  exports.getLogin = (req, res, next) => {
    const message = req.flash("error")[0];
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: message,
      oldInput: {},
      validationArray: [],
    });
  };

  exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
        },
        validationArray: errors.array(),
      });
    }

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(422).render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorMessage: "There is no user with such an email",
            oldInput: {
              email,
              password,
            },
            validationArray: [{ path: "email" }],
          });
        }
        bcrypt
          .compare(password, user.password)
          .then((didMatch) => {
            if (didMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(() => res.redirect("/"));
            }
            return res.status(422).render("auth/login", {
              pageTitle: "Login",
              path: "/login",
              errorMessage: "Incorrect password",
              oldInput: {
                email,
                password,
              },
              validationArray: [{ path: "password" }],
            });
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  exports.getSignup = (req, res, next) => {
    const message = req.flash("error")[0];
    res.render("auth/signup", {
      pageTitle: "SignUp",
      path: "/signup",
      errorMessage: message,
      oldInput: {},
      validationArray: [],
    });
  };

  exports.postSignup = (req, res, next) => {
    const { email, password, passwordConfirm } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "SignUp",
        path: "/signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          passwordConfirm,
        },
        validationArray: errors.array(),
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          username: email.split("@")[0],
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      });
  };
  exports.getReset = (req, res, next) => {
    const message = req.flash("error")[0];
    res.render("auth/reset", {
      pageTitle: "Reset Password",
      path: "/reset",
      errorMessage: message,
    });
  };

  exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  };
})();
