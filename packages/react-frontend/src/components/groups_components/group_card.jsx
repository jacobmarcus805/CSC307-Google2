import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Icon,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

function GroupCard({ groupId }) {
  const [group, setGroup] = useState();
  const [members, setMembers] = useState();

  //const { userId } = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const fetchedGroup = await fetch(`${baseUrl}/groups/${groupId}`);

        const groupData = await fetchedGroup.json();

        console.log("fetched group data", groupData);
        setGroup(groupData);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    if (!group || !group.members) return; // wait for group data

    const fetchMembers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const userId = localStorage.getItem("userId");

        const memberPromises = group.members.map((memberId) =>
          fetch(`${baseUrl}/users/${memberId}?authUserId=${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch member ${memberId}`);
            return res.json();
          }),
        );

        const membersData = await Promise.all(memberPromises);
        setMembers(membersData);
      } catch (err) {
        console.error("Failed fetching members:", err);
      }
    };

    fetchMembers();
  }, [group]);

  if (!group) {
    return <Text>Loading group...</Text>; // or a spinner
  }

  const listMembers = (members) => {
    return members.map((member, idx) => {
      return <p key={idx}>{member.name}</p>;
    });
  };

  return (
    <Card w="md" variant={"outline"} bg={"green.100"}>
      <CardBody>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
            paddingBottom: "0.5em",
          }}
        >
          <Icon as={FaUserGroup} boxSize={"1.5em"} alignContent={"center"} />
          <Heading size="md" mb={1}>
            {group.name}
          </Heading>
        </div>
        <Text>{group.description}</Text>
        <Accordion
          allowToggle
          variant={"subtle"}
          m={"0.5em"}
          bg="green.200"
          borderRadius={"md"}
          border={"transparent"}
        >
          <AccordionItem>
            <AccordionButton gap={2} alignItems={"center"}>
              <Icon as={FaUserCircle} boxSize={5} />
              <Text flex={1} textAlign={"left"}>
                Members
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {members ? listMembers(members) : <Text>Loading members...</Text>}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Flex placeContent={"flex-end"}>
          <Button color={"red"} size={"sm"} variant={"ghost"}>
            Leave
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
}

GroupCard.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default GroupCard;
