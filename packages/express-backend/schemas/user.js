import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid email, must be at least 2 characters.");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    schedule: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
    ],
    groups_in: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },
    ],
    groups_created: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
      },
    ],
  },
  { collection: "users" },
);

const User = mongoose.model("User", UserSchema);

export default User;
