import React, { useState, useEffect } from "react";
import GroupCard from "../components/groups_components/group_card";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const groups_data = [
  {
    name: "Test Group 1",
    description: "This is the first test group, with a longer description.",
    admins: ["id1", "id2"],
    members: ["id3", "id4"],
  },
  {
    name: "Test Group 2",
    description: "This is the second.",
    admins: ["id5", "id6"],
    members: ["id7", "id8"],
  },
  {
    name: "Test Group 3",
    description:
      "This is the third test group, with a description so long that it overflows, multiple lines even, so long.",
    admins: ["id9"],
    members: ["id10"],
  },
];

const ListGroups = ({ groups }) => {
  return (
    <SimpleGrid
      columns={1}
      spacing={"1em"}
      justifyItems={"center"}
      alignItems={"start"}
    >
      {groups.map((group) => (
        <GroupCard key={group.name} group={group} />
      ))}
    </SimpleGrid>
  );
};

function Groups() {
  const { userId } = useParams();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`/${userId}/groups/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.groups_list) {
          setGroups(data.groups_list);
          console.log("Fetched groups:", data.groups_list);
        }
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setGroups(groups_data); // fallback to static data
      });
  }, []);

  return (
    <div>
      <Heading textAlign="center" mb="0.5em" mt="0.5em">
        Your Groups
      </Heading>
      <ListGroups groups={groups} />
    </div>
  );
}

export default Groups;
