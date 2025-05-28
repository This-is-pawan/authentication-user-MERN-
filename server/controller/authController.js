// authController.js
require("dotenv").config();
const userModels = require("../modules/userModles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/nodeMailer");

const {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} = require("../config/emailTemplates");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, msg: "Missing details" });
  }

  try {
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModels({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Great Coding",
      text: `Welcome to my website. Your account has been created with email ID: ${email}`,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, msg: "Email and password are required" });
  }

  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, msg: "Logged out" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

exports.sendVeriyOtp = async (req, res) => {
  try {
    const user = await userModels.findById(req.userId);

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, msg: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const htmlContent = EMAIL_VERIFY_TEMPLATE({
      name: user.name,
      email: user.email,
      otp,
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, msg: "Verification OTP sent to email" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing details" });
    }

    const user = await userModels.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt && user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, msg: "isAuthenticated is successful" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

exports.sendReseOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, msg: "Email is required" });
  }

  try {
    const user = await userModels.findOne({ email });

    if (!user) {
      return res.json({ success: false, msg: "User not found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const htmlContent = PASSWORD_RESET_TEMPLATE({
      name: user.name,
      email: user.email,
      otp,
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOption);

    res.json({ success: true, msg: "OTP Sent to Your Email." });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      msg: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await userModels.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.json({ success: false, msg: "User not found!" });
    }

    const trimmedOtp = otp.trim();

    if (!user.resetOtp || user.resetOtp !== trimmedOtp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, msg: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = null;

    await user.save();

    return res.json({
      success: true,
      msg: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Server error", error: error.message });
  }
};
