const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { hundllingMessages } = require("./sockets/message");

// Routes
const register = require("./routes/auth/register");
const login = require("./routes/auth/login");
const pinVerificationRoute = require("./routes/auth/pin-verification");
const categoryroutes = require("./routes/category");
const productroute = require("./routes/product");
// const ExempleRoute = require("./routes/example");
// const messagesRoute = require("./routes/messages");

const app = express();

// Use middleware
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());

// Define Routes
app.use("/api/auth", register);
app.use("/api/auth", login);
app.use("/api/auth", pinVerificationRoute);
app.use("/api/category", categoryroutes);
app.use("/api/product", productroute);
// app.use("/api/exemple", ExempleRoute);
// app.use("/api/messages", messagesRoute);

app.use("/", (req, res) => {
  return res.status(200).send("Welcome to my stylish page!");
});

// Create HTTP server with express app
const server = http.createServer(app);

// // Set up Socket.io on the same server
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// hundllingMessages(io);
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
