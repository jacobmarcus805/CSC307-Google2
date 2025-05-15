import mongoose from "mongoose";
import userModel from "../schemas/user.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

mongoose.set("debug", true);
console.log("mongo uri: ", process.env.MONGODB_URI);

function getUsers() {
  let promise;
  promise = userModel.find();
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function updateUserById(id, update) {
  let promise;
  promise = userModel.findByIdAndUpdate(id, update);
  return promise;
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  updateUserById,
};
