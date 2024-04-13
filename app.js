const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const { _MongoDB_URI } = require("./util/data");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: _MongoDB_URI,
  collection: "sessions",
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: multerStorage, fileFilter: multerFileFilter }).single(
    "image"
  )
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "keyword cat",
    resave: false,
    saveUninitialized: true,
    store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) return next();
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.authPassed = req.session.isLoggedIn;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500Page);
app.use("/", errorController.get404Page);

app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(_MongoDB_URI)
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.log(err));
