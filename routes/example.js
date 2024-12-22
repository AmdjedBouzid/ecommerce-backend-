// // routes.js
// const express = require("express");
// const fs = require("fs").promises;
// const path = require("path");

// const router = express.Router();

// // Define the route to load and explore the JSON file
// router.get("/", async (req, res) => {
//   try {
//     // Resolve the absolute path to the JSON file in the same directory
//     const filePath = path.join(__dirname, "data.json");
//     console.log("Resolved file path:", filePath); // Log the path to verify

//     // Read the JSON file asynchronously
//     const data = await fs.readFile(filePath, "utf8");

//     // Parse the JSON data
//     const jsonData = JSON.parse(data);

//     // Function to explore the JSON structure
//     const exploreJSON = (obj, level = 0) => {
//       for (const key in obj) {
//         if (obj.hasOwnProperty(key)) {
//           const value = obj[key];
//           console.log(
//             " ".repeat(level * 2) + key + ":",
//             typeof value === "object" ? "Object" : value
//           );
//           if (typeof value === "object" && value !== null) {
//             exploreJSON(value, level + 1); // Recursively explore nested objects
//           }
//         }
//       }
//     };

//     // Start exploring the JSON structure
//     exploreJSON(jsonData);

//     // Send a success response to the client
//     res.status(200).json({ message: "Successfully explored JSON" });
//   } catch (err) {
//     console.error("Error reading or parsing file:", err);
//     res.status(500).json({ error: "Error reading or parsing the JSON file" });
//   }
// });

// // Define another route that uses the same file, but for a different purpose (e.g., returning specific data)
// router.get("/get-data", async (req, res) => {
//   try {
//     // Resolve the absolute path to the JSON file
//     const filePath = path.join(__dirname, "data.json");

//     // Read the JSON file asynchronously
//     const data = await fs.readFile(filePath, "utf8");

//     // Parse the JSON data
//     const jsonData = JSON.parse(data);

//     // Return a specific part of the data as an example (e.g., first element of an array)
//     res.status(200).json(jsonData[0] || { message: "No data available" });
//   } catch (err) {
//     console.error("Error reading or parsing file:", err);
//     res.status(500).json({ error: "Error reading or parsing the JSON file" });
//   }
// });

// module.exports = router;
