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

function GroupCard({ group }) {
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        // const fetchedGroup = await fetch(`${baseUrl}/groups/${groupId}`);

        // const groupData = await fetchedGroup.json();

        // console.log(groupData);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    fetchGroup();
  });

  const listMembers = (members) => {
    return members.map((member, idx) => <p key={idx}>{member}</p>);
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
            <AccordionPanel>{listMembers(group.members)}</AccordionPanel>
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
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default GroupCard;
