import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({});

const Group = mongoose.model("Group", groupSchema);

export default Group;
