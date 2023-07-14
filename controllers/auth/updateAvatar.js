const path = require("path");
const fs = require("fs/promises");
const { User } = require("../../models/user");
const Jimp = require("jimp");

// шлях до папки з аватарками
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  // імпортуємо шлях (дістаємо реквест файл)
  const { path: tempUpload, originalname } = req.file;
  // створюємо шлях для зберігання, до імʼя файлу дописуємо ід користувача
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  //  await fs.rename(tempUpload, resultUpload);-переміщення з тимчасового місця в паблік
  //  оброблення розміру авки
  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      console.error("Error has occurred!", err);
      throw err;
    });

  await fs.unlink(tempUpload);
  // записуємо новий шлях в базу
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = updateAvatar;
