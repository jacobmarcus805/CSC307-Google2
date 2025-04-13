import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  async function removeOneCharacter(index) {
    // call delete route
    const characterToRemove = characters[index];
    await fetch(`http://localhost:8000/users/${characterToRemove.id}`, {
      method: "DELETE",
    })

    const updated = characters.filter((character, i) => {
      return i !== index;
    });

    setCharacters(updated);
  }

  // check response status, only then update the list if it is 201
  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          setCharacters([...characters, person])
        }
        else {
          console.log("Failed to add user");
        }
      })
      .catch((error) => {
        console.log(error);
      })
}

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    console.log("fetching users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
