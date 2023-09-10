import asyncHandler from "express-async-handler";
import generateToken from "../config/generateToken.js";
import User from "../models/userModel.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, phonenumber, password } = req.body;
  if (!name || !password || !phonenumber) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  let userExists;
  if (!isNaN(phonenumber)) {
    userExists = await User.findOne({ phonenumber });
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    password,
    phonenumber,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phonenumber: user.phonenumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { phonenumber, password } = req.body;
  let user;
  if (!isNaN(phonenumber)) {
    user = await User.findOne({ phonenumber });
  }
  if (user) {
    const checkMatchPassword = await user.matchPassword(password);
    if (checkMatchPassword) {
      res.json({
        _id: user._id,
        name: user.name,
        phonenumber: user.phonenumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});
