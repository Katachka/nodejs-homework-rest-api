const { HttpError, sendEmail } = require("../../helpers");
const { User } = require("../../models/user");
require("dotenv").config();
const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw HttpError(400, "No user with this email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};
module.exports = resendVerifyEmail;
