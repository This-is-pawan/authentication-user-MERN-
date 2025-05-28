const userModel = require("../modules/userModles");

exports.getUserData = async (req, res) => {
  try {
    const userId = req.userId; // ✅ use this — set in your middleware

    const user = await userModel.findById(userId); // ✅ consistent

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "User is available",
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Error in getUserData:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
