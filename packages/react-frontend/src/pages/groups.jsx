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
  FormErrorMessage,
  FormHelperText,
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
      const newAdmins = [userString];
      const newMembers = [userString];

      const response = await fetch(`${baseUrl}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
          admins: newAdmins,
          members: newMembers,
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
