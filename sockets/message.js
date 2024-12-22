const hundllingMessages = (io) => {
  const userJoinedList = []; // Use an array instead of a Map

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle when a user joins the chat
    socket.on("join_chat", (data) => {
      try {
        if (data && data.user) {
          userJoinedList.push({ id: socket.id, user: data.user });
          console.log(`${data.user} joined the chat.`);

          // Broadcast to others
          socket.broadcast.emit("receive_message", {
            user: "System",
            text: `${data.user} has joined the chat.`,
          });

          // Update the list of online users
          io.emit(
            "update_users",
            userJoinedList.map((user) => user.user)
          );
        } else {
          socket.emit("error_message", "Invalid user data.");
        }
      } catch (error) {
        console.error("Error during join_chat:", error);
        socket.emit(
          "error_message",
          "An error occurred while joining the chat."
        );
      }
    });

    // Handle messages
    socket.on("send_message", (msg) => {
      try {
        console.log("Message received:", msg);
        if (msg && msg.user && msg.text) {
          io.emit("receive_message", msg); // Broadcast to everyone
        } else {
          socket.emit("error_message", "Invalid message data.");
        }
      } catch (error) {
        console.error("Error during send_message:", error);
        socket.emit(
          "error_message",
          "An error occurred while sending the message."
        );
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      try {
        const userIndex = userJoinedList.findIndex(
          (user) => user.id === socket.id
        );
        if (userIndex !== -1) {
          const user = userJoinedList[userIndex].user;
          userJoinedList.splice(userIndex, 1); // Remove the user from the array

          console.log(`${user} has disconnected.`);
          io.emit("receive_message", {
            user: "System",
            text: `${user} has left the chat.`,
          });

          io.emit(
            "update_users",
            userJoinedList.map((user) => user.user)
          ); // Update the list of users
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};

module.exports = { hundllingMessages };
