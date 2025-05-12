import { mongoose } from "mongoose";
import groupModel from "../schemas/group.js";
import dotenv from "dotenv";

function addGroup(group) {
  const groupToAdd = new Group(group);
  const promise = groupToAdd.save();
  return promise;
}

function findGroupById(id) {
  return groupModel.findGroupById(id);
}

function updateGroupById(id, update) {
  let promise;
  promise = groupModel.findByIdAndUpdate(id, update);
  return promise;
}

export default {
  addGroup,
  findGroupById,
  updateGroupById,
};
