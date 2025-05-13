import { mongoose } from "mongoose";
import eventModel from "../schemas/event.js";

function addEvent(event) {
  const eventToAdd = new eventModel(event);
  const promise = eventToAdd.save();
  return promise;
}

function getEvents(title) {
  let promise;
  if (title == undefined) {
    promise = eventModel.find();
  } else {
    promise = eventModel.find({ title: title });
  }

  return promise;
}

export default {
  addEvent,
  getEvents,
};
