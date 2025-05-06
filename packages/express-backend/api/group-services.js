import { mongoose } from "mongoose";
import Group from "../schemas/group.js";
import dotenv from "dotenv";

function addGroup(group) {
  const groupToAdd = new Group(group);
  const promise = groupToAdd.save();
  return promise;
}

export default {
  addGroup,
};
