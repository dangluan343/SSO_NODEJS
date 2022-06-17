var express = require("express"),
  // mongoose = require("mongoose"),
  // passport = require("passport"),
  bodyParser = require("body-parser");
// LocalStrategy = require("passport-local"),
// passportLocalMongoose =
// 	require("passport-local-mongoose"),
// User = require("./models/user");

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/auth_demo_app");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var store = new MongoDBStore({
  uri: "myMongodbServer",
  databaseName: "connect_mongodb_session_test",
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

require("dotenv").config();
var acc = process.env;
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
  return res.render("home");
});

// Showing secret page
// app.get("/secret", isLoggedIn, function (req, res) {
// 	res.render("secret");
// });

// Showing register form
// app.get("/register", function (req, res) {
// 	res.render("register");
// });

// Handling user signup
// app.post("/register", function (req, res) {
// 	var username = req.body.username
// 	var password = req.body.password
// 	User.register(new User({ username: username }),
// 			password, function (err, user) {
// 		if (err) {
// 			console.log(err);
// 			return res.render("register");
// 		}

// 		passport.authenticate("local")(
// 			req, res, function () {
// 			res.render("secret");
// 		});
// 	});
// });

// Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login
app.post("/login", function (req, res) {
  if (
    req.body.username === acc.username &&
    req.body.password === acc.password
  ) {
    console.log("login successful");
    res.redirect("/logged");
  }
});

//Handling user logout
app.get("/logout", function (req, res) {
  // req.logout();
  req.session.destroy();
  res.redirect("/");
});

app.get("/logged", function (req, res) {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
  //   res.render("logged");
});

// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) return next();
// 	res.redirect("/login");
// }

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
