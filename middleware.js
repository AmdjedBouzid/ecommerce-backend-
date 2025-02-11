//const GetAdmin = require("./utils/functions");
const express = require("express");
const { GetAdmin } = require("./utils/functions");
const VerifyAdmin = async (req, res, next) => {
  try {
    // console.log("coling VerifyAdmin");
    const { admin, message, status } = await GetAdmin(req);
    // console.log("afrer return", { admin, message, status });
    if (status !== 200) {
      return res.status(404).json({ message: message });
    }
    // console.log({ admin, message, status });
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Error verifying admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  VerifyAdmin,
};
