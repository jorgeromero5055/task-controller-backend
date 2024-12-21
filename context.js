const User = require("./models/userModel");
const admin = require("firebase-admin");

const context = async ({ req }) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("no token found");
    throw new Error("Invalid user");
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("token validated");

    const user = await User.findOne({ userId: decodedToken.uid });
    console.log("user found");
    if (user) {
      const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
      const lastActiveDate = new Date(user.lastActive);
      const currentDate = new Date();
      if (currentDate - lastActiveDate > THIRTY_DAYS_IN_MS) {
        console.log("user invalid time");
        throw new Error("Invalid user");
      }
      user.lastActive = currentDate.toISOString();
      await user.save();
      console.log("user saved");
      return { userId: decodedToken.uid };
    } else {
      return { userId: decodedToken.uid };
    }
  } catch (error) {
    throw new Error("Invalid user");
  }
};

module.exports = context;
