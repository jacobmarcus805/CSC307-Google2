import { mongoose } from "mongoose";
import groupModel from "./group.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

mongoose.set("debug", true);
console.log("mongo uri: ", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

function addGroup(group) {
  const groupToAdd = new groupModel(group);
  const promise = groupToAdd.save();
  return promise;
}

export default {
  findGroupById,
  getGroupByName,
  addGroup,
};
