const express = require("express");

const router = express.Router();

// controlles

const {
  RegisterSuperAdmin,
  SendUserOTP,
  VerifyOTP,
  refreshToken,
} = require("../Controller/authController");

// auth routers

router.post("/superadminregister", RegisterSuperAdmin);
router.post("/send-otp", SendUserOTP);
router.post("/verify-otp", VerifyOTP);
router.post("/refresh", refreshToken);

module.exports = router;
