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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function GroupCard({ group }) {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (!group.members || group.members.length === 0) return;

    const fetchUserData = () => {
      const fetches = group.members.map((userId) => {
        return fetch(`http://localhost:8000/users/${userId}`)
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => [userId, data])
          .catch(() => {
            console.error(`Failed to fetch user ${userId}`);
            return [userId, { name: "Unknown User" }];
          });
      });

      Promise.all(fetches).then((results) => {
        const userMap = Object.fromEntries(results);
        setUserDetails(userMap);
      });
    };

    fetchUserData();
  }, [group.members]);

  const listUsers = (userIds) => {
    return userIds.map((userId, idx) => {
      const user = userDetails[userId];
      const displayName = user ? user.name : "Loading...";
      return (
        <p key={idx} style={{ margin: "0.2em 0" }}>
          {displayName}
        </p>
      );
    });
  };

  return (
    <Card w="md" variant={"outline"} bg={"green.100"}>
      <CardBody>
        <Heading size="md" mb={1}>
          {group.name}
        </Heading>
        <Text>{group.description}</Text>
        <Accordion allowToggle variant={"subtle"}>
          <AccordionItem>
            <AccordionButton gap={2} alignItems={"center"}>
              <Icon as={FaUserCircle} boxSize={5} />
              <Text flex={1} textAlign={"left"}>
                Users
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{listUsers(group.members)}</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default GroupCard;
