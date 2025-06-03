import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Heading, Box, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import GroupCard from "../components/groups_components/group_card";

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
            <GroupCard groupId={groupId} />
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
