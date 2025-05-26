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
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

function GroupCard({ group }) {
  const listMembers = (members) => {
    return members.map((member, idx) => <p key={idx}>{member}</p>);
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
                Members
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{listMembers(group.members)}</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default GroupCard;
