const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Adjust the path
const { connectDB } = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET;
const Send_Email = async (email, Code_Pin) => {
  const Email = process.env.EMAIL_SENDER;
  const PASSWOR = process.env.EMAIL_SENDER_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: Email, // Your email address
      pass: PASSWOR, // Your email password
    },
    debug: true, // Enable SMTP debugging
    logger: true, // Log information
  });

  const mailOptions = {
    from: Email,
    to: email,
    subject: `Admin Login PIN Code ${Code_Pin}`,
    text: `Your PIN code for admin login is: ${Code_Pin}`, // This is the PIN, customize as needed
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      return {
        Pin: Code_Pin,
        success: true,
        message: "Email sent successfully",
        info: info.response,
      };
    } else {
      console.log("Email not accepted: " + info.response);
      return {
        success: false,
        message: "Email not accepted",
        info: info.response,
      };
    }
  } catch (error) {
    console.log("error", error);
    return { error: error };
  }
};

function generateRandomPin() {
  const pin = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
  return pin;
}

const GetAdmin = async (req) => {
  try {
    await connectDB();
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    // console.log("teken_____", token);
    if (!token) {
      return { message: "No token provided", status: 404 };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    //console.log("decoded_______", decoded);
    const admin = await Admin.findOne({});
    if (!decoded || !admin) {
      return { message: "No admin  found", status: 404 };
    }

    return { admin, messsage: "admin found", status: 200 };
  } catch (error) {
    console.error("Error in GetAdmin:", error);
    return { message: "Invalid or expired token", status: 404 };
  }
};
const Global_Validation = (Schema, Data) => {
  const validation = Schema.safeParse(Data);
  let valid;
  if (validation.success) valid = { status: true, message: "inputs valide" };
  else valid = { status: false, message: validation.error.errors[0].message };
  // console.log("valid_____", valid);
  return valid;
};
module.exports = {
  Send_Email,
  generateRandomPin,
  GetAdmin,
  Global_Validation,
};
