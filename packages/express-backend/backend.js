import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user.js";
import groupModel from "./schemas/group.js";
import userServices from "./user-services.js";
import groupServices from "./api/group-services.js";
import dotenv from "dotenv";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

dotenv.config(); // Load environment variables

mongoose.set("debug", true);
console.log("mongo uri: ", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

function generate_random_id() {
  return Math.random().toString(36).substring(2, 9);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  console.log(`name: ${name}, job: ${job}`);

  let promise;
  if (name == undefined && job == undefined) {
    console.log("No query parameters provided, returning all users.");
    promise = userModel.find();
  } else if (name && !job) {
    promise = userServices.findUserByName(name);
  } else if (job && !name) {
    promise = userServices.findUserByJob(job);
  } else {
    promise = userModel.find({ name: name, job: job });
  }

  // send results
  promise
    .then((users) => {
      if (users.length > 0) {
        res.send({ users_list: users });
      } else {
        res.status(404).send("No users found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal server error.");
    });

  return;
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = userServices.findUserById(id);

  result
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("Resource not found.");
      }
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
    });
});

app.post("/users", (req, res) => {
  console.log("Received request to add user:", req.body);
  const userToAdd = req.body;

  // ensure all fields are filled
  if (userToAdd["name"] === undefined || userToAdd["job"] === undefined) {
    res.status(400).send("Invalid request body.");
    return;
  }
  console.log("Adding user:", userToAdd);
  addUser(userToAdd)
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
      console.error("Error adding user:", error);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  userModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).send("Resource not found.");
      }
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
    });
});

// GROUP routes
app.post("/groups", (req, res) => {
  console.log("Received request to add group:", req.body);
  const groupToAdd = req.body;

  // ensure all fields are filled
  if (
    groupToAdd["name"] === undefined ||
    groupToAdd["description"] === undefined ||
    groupToAdd["admins"] === undefined ||
    groupToAdd["members"] === undefined
  ) {
    res.status(400).send("Invalid request body.");
    return;
  }
  console.log("Adding group:", groupToAdd);
  groupServices
    .addGroup(groupToAdd)
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
      console.error("Error adding group:", error);
    });
});

app.patch("/groups/:id", (req, res) => {
  const { id } = req.params;
  const update = req.body;

  groupServices
    .updateGroupById(id, update)
    .then(() => {
      console.log("patching group");
      res.status(200).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
      console.error("Error patching user:", error);
    });
});

app.get("/groups", (req, res) => {
  const name = req.query.name;

  groupServices
    .getGroups(name)
    .then((groups) => {
      if (groups.length > 0) {
        res.send({ groups_list: groups });
      } else {
        res.status(404).send("No groups found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching groups: ", error);
      res.status(500).send("Internal server error");
    });
});

app.get("/groups/:id", (req, res) => {
  const { id } = req.params;

  groupServices
    .findGroupById(id)
    .then((group) => {
      res.send(group);
    })
    .catch((error) => {
      console.error("Error fetching group: ", error);
      res.status(500).send();
    });
});

//EVENT routes
app.post("/events", (req, res) => {
  console.log("Received request to add event:", req.body);
  const eventToAdd = req.body;

  // ensure all fields are filled
  if (
    eventToAdd["title"] === undefined ||
    eventToAdd["day"] === undefined ||
    eventToAdd["startTime"] === undefined ||
    eventToAdd["endTime"] === undefined ||
    eventToAdd["location"] === undefined ||
    eventToAdd["canSit"] === undefined
  ) {
    res.status(400).send("Invalid request body.");
    return;
  }
  console.log("Adding event:", eventToAdd);
  eventServices
    .addEvent(eventToAdd)
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
      console.error("Error adding event:", error);
    });
});

app.get("/events", (req, res) => {
  const title = req.query.title;

  eventServices
    .getEvents(title)
    .then((events) => {
      if (events.length > 0) {
        res.send({ events_list: events });
      } else {
        res.status(404).send("No events found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching events: ", error);
      res.status(500).send("Internal server error");
    });
});

app.listen(port, (req, res) => {
  console.log(`Example app listening at http://localhost:${port}`);
});
