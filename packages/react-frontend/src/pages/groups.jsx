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
      columns={2}
      spacing={20}
      justifyItems={"center"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </SimpleGrid>
  );
};

const Groups = () => {
  return (
    <div>
      <Heading textAlign="center">Groups</Heading>
      <ListGroups groups={groups_data} />
    </div>
  );
};

export default Groups;
