import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Heading,
  Box,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import GroupCard from "../components/groups_components/group_card";

const Groups = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupsIn, setGroupsIn] = useState([]);
  const [groupsCreated, setGroupsCreated] = useState([]);
  const [joinGroupId, setJoinGroupId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

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

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      if (!token) {
        console.error("No token found");
        return;
      }

      const userString = userId.toString();

      const response = await fetch(`${baseUrl}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
          admins: [userString],
          members: [userString],
        }),
      });

      let newGroup;

      try {
        const text = await response.text();
        if (!text) throw new Error("Empty response body");
        newGroup = JSON.parse(text);
      } catch (err) {
        console.error("Response is not valid JSON:", err);
        throw new Error("Invalid or empty JSON returned");
      }

      console.log("Created group:", newGroup);

      // Add the new group to the list of created groups
      setGroupsCreated((prev) => [...prev, newGroup._id]); // or `newGroup` if you're storing full group objects

      // Reset fields and close modal
      setNewGroupName("");
      setNewGroupDescription("");
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      if (!token || !userId || !joinGroupId) {
        console.error("Missing input or token");
        return;
      }

      // 1. Fetch group
      const groupRes = await fetch(`${baseUrl}/groups/${joinGroupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!groupRes.ok) {
        throw new Error("Group not found");
      }

      const groupData = await groupRes.json();
      const updatedMembers = groupData.members.includes(userId)
        ? groupData.members
        : [...groupData.members, userId];

      // 2. Patch group with updated members
      await fetch(`${baseUrl}/groups/${joinGroupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ members: updatedMembers }),
      });

      // 3. Fetch user
      const userRes = await fetch(`${baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const userData = await userRes.json();
      const updatedGroupsIn = userData.groups_in.includes(joinGroupId)
        ? userData.groups_in
        : [...userData.groups_in, joinGroupId];

      // 4. Patch user with updated groups_in
      await fetch(`${baseUrl}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groups_in: updatedGroupsIn }),
      });

      // 5. Update UI
      setGroupsIn((prev) => [...prev, joinGroupId]);
      setJoinGroupId("");
    } catch (err) {
      console.error("Failed to join group:", err);
    }
  };

  const ListGroups = ({ groups, isGroupAdmin = false }) => {
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
            <GroupCard groupId={groupId} isGroupAdmin={isGroupAdmin} />
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  ListGroups.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const createGroupModal = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Group Name</FormLabel>
            <Input
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Group description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleCreateGroup}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <div>
      <SimpleGrid columns={2} justifyItems={"center"}>
        <Box>
          <Heading textAlign="center" padding={"1em"}>
            Groups You're In
          </Heading>
          <Box textAlign="center" mb={4}>
            <Input
              placeholder="Enter Group ID"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
              width="60%"
              mb={2}
            />
            <Button colorScheme="blue" onClick={handleJoinGroup}>
              Join Group
            </Button>
          </Box>
          <ListGroups groups={groupsIn} />
        </Box>
        <Box>
          <Heading textAlign={"center"} padding={"1em"}>
            Groups You've Created
          </Heading>
          <Box justifySelf={"center"}>
            {createGroupModal}
            <Button onClick={onOpen} mb={"2em"}>
              {" "}
              Create Group{" "}
            </Button>
          </Box>
          <ListGroups groups={groupsCreated} isGroupAdmin={true} />
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default Groups;
