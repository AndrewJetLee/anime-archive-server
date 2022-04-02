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

// mount middleware
app.use(cors({credentials: true, origin: "https://anime-archive.netlify.app"}));
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
    sameSite: 'none',
    secure: true
  }
}));

// passport 
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("session", req.session);
  console.log("user", req.user);
  next();
});

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
