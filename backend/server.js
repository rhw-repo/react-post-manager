const express = require("express");
const helmet = require("helmet");
const frontendUrl = process.env.FRONTEND_URL;
const cors = require("cors");
const session = require("express-session");
const sessionStore = require("./session");
const connectDB = require("./db");
const debug = require("debug")("server:dbconnection");

const materialRoutes = require("./routes/materials");
const userRoutes = require("./routes/user");

const app = express();
app.set('trust proxy', 1);
app.use(helmet());

const corsOptions = {
  origin: frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.options("/api/*", cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());

app.use("/api/materials", materialRoutes);
app.use("/api/user", userRoutes);

app.get("/api/user/me", (req, res) => {
  if (req.session && req.session.user) {
    const { email } = req.session.user;
    res.json({ user: { email } });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    console.log(`Node ${process.version}`);
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => {
    const errorCode = err.code || 500;
    debug("MongoDB connection error: ", err);
    process.exit(errorCode);
  });
