const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/user");
const connectToDb = require("./db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// initialize server
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.PROD_ORIGIN || "http://localhost:3000"
const environment = process.env.NODE_ENV;

// mount middleware
app.use(cors({credentials: true, origin: CLIENT_ORIGIN}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING}),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: environment === "production" ? 'none' : "lax",
    secure: environment === "production" ? true : false
  }
}));

app.set('trust proxy', 1);

// passport 
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("session", req.session);
  console.log("user", req.user);
  next();
});

//test
app.get("/", async (req, res) => {
  try {
    res.send("Connected to server");
  } catch (err) {
    res.send(err);
  }
})

// assign routers
app.use("/api/user", userRouter);

// connect to db
connectToDb()

// start server
const startServer = async () => {
  try {
    await app.listen(PORT);
    console.log(`Successfully started server on port:${PORT}`)
  } catch (err) {
    console.log("Error starting server", err);
  }
};

startServer();
