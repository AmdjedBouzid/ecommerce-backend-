//const GetAdmin = require("./utils/functions");
const express = require("express");
const { GetAdmin } = require("./utils/functions");
const VerifyAdmin = async (req, res, next) => {
  try {
    //  console.log("liddelwaire________");
    const { admin, message, status } = await GetAdmin(req);

    if (status !== 200) {
      return res.status(404).json({ message: message });
    }

    next();
  } catch (err) {
    console.error("Error verifying admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  VerifyAdmin,
};
