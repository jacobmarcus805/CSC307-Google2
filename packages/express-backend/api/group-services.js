import groupModel from "../schemas/group.js";

function addGroup(group) {
  const groupToAdd = new groupModel(group);
  const promise = groupToAdd.save();
  return promise;
}

function findGroupById(id) {
  return groupModel.findById(id);
}

function updateGroupById(id, update) {
  let promise;
  promise = groupModel.findByIdAndUpdate(id, update);
  return promise;
}

function getGroups(name) {
  let promise;
  if (name == undefined) {
    promise = groupModel.find();
  } else {
    promise = groupModel.find({ name: name });
  }

  return promise;
}

function findGroupByIdAndDelete(id) {
  return groupModel.findByIdAndDelete(id);
}

export default {
  addGroup,
  findGroupById,
  updateGroupById,
  getGroups,
  findGroupByIdAndDelete,
};
