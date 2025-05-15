import mongoose from "mongoose";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  day: {
    type: String,
    enum: days,
    lowercase: true,
    required: true,
    trim: true,
  },
  startTime: {
    type: Number,
    required: true,
    validate: Number.isInteger,
    min: 0,
    max: 1440,
  },
  endTime: {
    type: Number,
    required: true,
    validate: Number.isInteger,
    min: 0,
    max: 1440,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  canSit: {
    type: Boolean,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
