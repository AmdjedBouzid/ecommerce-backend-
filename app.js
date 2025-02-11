const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");

// Routes
const register = require("./routes/auth/register");
const login = require("./routes/auth/login");
const pinVerificationRoute = require("./routes/auth/pin-verification");
const brandsRoute = require("./routes/Brand");
const perfumesRoute = require("./routes/perfume");
const orderRoute = require("./routes/Order");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", register);
app.use("/api/auth", login);
app.use("/api/auth", pinVerificationRoute);
app.use("/api/Brand", brandsRoute);
app.use("/api/Perfume", perfumesRoute);
app.use("/api/Order", orderRoute);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my stylish page!");
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
