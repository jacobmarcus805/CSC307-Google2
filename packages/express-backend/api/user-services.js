import userModel from "../schemas/user.js";

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

function updateUserById(id, update) {
  let promise;
  promise = userModel.findByIdAndUpdate(id, update);
  return promise;
}

function getUserSchedules(requesterId, targetId) {
  return new Promise((resolve, reject) => {
    userModel
      .findById(requesterId)
      .select("is_admin")
      .then((requester) => {
        if (!requester) {
          return reject(new Error("Requester user not found."));
        }
        if (!requester.is_admin && requesterId !== targetId) {
          return reject(
            new Error(
              "Requester does not have permission to view target schedules",
            ),
          );
        }

        return userModel.findById(targetId).select("events");
      })
      .then((target) => {
        if (!target) {
          return reject(new Error("Target user not found."));
        }
        resolve(target.events);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  updateUserById,
  getUserSchedules,
};
