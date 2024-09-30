import asyncHandler from "express-async-handler";
import generateToken from "../config/generateToken.js";
import User from "../models/userModel.js";
import { createData } from "../models/helpers/index.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { body: payload } = req;

  const isExist = await User.User({ phonenumber: payload.phonenumber });
  if (isExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  return createData({ model: User, data: { ...payload } })
    .then((user) => res.status(201).json(
      {
        _id: user._id,
        name: user.name,
        phonenumber: user.phonenumber,
        token: generateToken(user._id)
      }))
    .catch(() => res.status(400).json({ message: "Something went wrong" }));
});

export const authUser = asyncHandler(async (req, res) => {
  const { phonenumber, password } = req.body;
  const user = await User.User({ phonenumber });
  if (_.isEmpty(user)) {
    return res.status(400).json({ message: "User Not Found" });
  } else {
    const checkMatchPassword = await user.matchPassword(password);
    if (checkMatchPassword) {
      res.json({
        _id: user._id,
        name: user.name,
        phonenumber: user.phonenumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  }
});
