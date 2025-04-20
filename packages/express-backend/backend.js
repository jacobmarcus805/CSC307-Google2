import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

function generate_random_id() {
  return Math.random().toString(36).substring(2, 9);
}

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return userModel.find({ name: name });
};

const findUserByJob = (job) => {
  return userModel.find({ job: job });
};

const findUserById = (id) => {
  return userModel.findById(id);
};

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  let promise;
  if (name == undefined && job == undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = fundUserByJob(job);
  }

  if (promise) {
    promise
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Internal server error.");
      });
    return;
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);

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
  const userToAdd = req.body;
  // generate id for user
  userToAdd["id"] = generate_random_id();
  // ensure all fields are filled
  if (userToAdd["name"] === undefined || userToAdd["job"] === undefined) {
    res.status(400).send("Invalid request body.");
    return;
  }
  addUser(userToAdd)
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error.");
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
