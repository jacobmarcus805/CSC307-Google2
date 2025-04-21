import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user.js";
import userServices from "./user-services.js";



const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

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
  }
  else {
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
