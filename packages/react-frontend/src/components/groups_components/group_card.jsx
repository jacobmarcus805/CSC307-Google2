import React from "react";
import {
  Icon,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

function GroupCard({ group }) {
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

export default GroupCard;
