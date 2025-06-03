import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import GroupCard from "../components/groups_components/group_card";
import { Heading, Box, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import GroupCard2 from "../components/groups_components/group_card2";

const groups_data1 = [
  {
    name: "Cal Poly Guide Dogs",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ante ac sem consectetur convallis nec eget enim. Nullam volutpat tortor a eleifend scelerisque. Curabitur urna est, rutrum vel velit ut, gravida mattis mi. Fusce sagittis velit id odio mattis dignissim. Donec at varius elit.",
    admins: ["id1", "id2"],
    members: ["id3", "id4"],
  },
  {
    name: "SLO Guide Dogs",
    description:
      "Nunc nec velit ut libero vestibulum sodales at at tortor. In eleifend turpis ut volutpat egestas. Ut quis nisi est. Nulla nisl turpis, euismod ac lacus in, luctus aliquet sem.",
    admins: ["id5", "id6"],
    members: ["id7", "id8"],
  },
  {
    name: "California Guide Dogs",
    description:
      "Quisque vel consequat ipsum, eget interdum dui. Suspendisse tristique, nisl vitae aliquet consectetur, enim metus eleifend metus, eu consectetur lacus felis at justo.",
    admins: ["id9"],
    members: ["id10"],
  },
];

const groups_data2 = [
  {
    name: "Cal Poly Guide Dogs",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ante ac sem consectetur convallis nec eget enim. Nullam volutpat tortor a eleifend scelerisque. Curabitur urna est, rutrum vel velit ut, gravida mattis mi. Fusce sagittis velit id odio mattis dignissim. Donec at varius elit.",
    admins: ["id1", "id2"],
    members: ["id3", "id4"],
  },
  {
    name: "SLO Guide Dogs",
    description:
      "Nunc nec velit ut libero vestibulum sodales at at tortor. In eleifend turpis ut volutpat egestas. Ut quis nisi est. Nulla nisl turpis, euismod ac lacus in, luctus aliquet sem.",
    admins: ["id5", "id6"],
    members: ["id7", "id8"],
  },
];

const Groups = () => {
  const [groupsIn, setGroupsIn] = useState([]);
  const [groupsCreated, setGroupsCreated] = useState([]);

  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch groups from the backend using userId
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const response = await fetch(
          `${baseUrl}/users/${userId}?authUserId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();

        console.log("data:", data);

        setGroupsCreated(data.groups_created);
        setGroupsIn(data.groups_in);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const ListGroups = ({ groups }) => {
    console.log("Groups to be listed:", groups);
    return (
      <SimpleGrid
        columns={1}
        spacing={"2em"}
        spacingX={"2em"}
        justifyItems={"center"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingBottom={"2em"}
      >
        {groups.map((groupId, idx) => (
          <Box key={idx} width={"100%"}>
            <GroupCard2 groupId={groupId} />
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  ListGroups.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  return (
    <div>
      <SimpleGrid columns={2} justifyItems={"center"}>
        <Box>
          <Heading textAlign="center" padding={"1em"}>
            Groups You're In
          </Heading>
          <ListGroups groups={groupsIn} />
        </Box>
        <Box>
          <Heading textAlign={"center"} padding={"1em"}>
            Groups You've Created
          </Heading>
          <ListGroups groups={groupsCreated} />
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default Groups;
