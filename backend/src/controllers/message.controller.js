import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select(-"password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSideBar controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getmMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.log("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const message = new Message({
      senderId,
      receiverId: userToChatId,
      text,
      image: imageUrl,
    });

    await message.save();

    //TODO: realtime functionality goes here

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
