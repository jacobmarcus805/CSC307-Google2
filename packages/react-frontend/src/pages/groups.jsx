import React from "react";
import PropTypes from "prop-types";
import GroupCard from "../components/groups_components/group_card";
import { Heading, SimpleGrid } from "@chakra-ui/react";

const groups_data = [
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

const ListGroups = ({ groups }) => {
  return (
    <SimpleGrid
      columns={1} // Responsive columns: 2 on small screens, 3 on larger screens
      spacing={"2em"}
      spacingX={"2em"}
      justifyItems={"center"}
      alignItems={"center"}
      justifyContent={"center"}
      paddingBottom={"2em"}
    >
      {groups.map((group) => (
        <GroupCard key={group.name} group={group} />
      ))}
    </SimpleGrid>
  );
};

ListGroups.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      admins: PropTypes.arrayOf(PropTypes.string).isRequired,
      members: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
};

const Groups = () => {
  return (
    <div>
      <Heading textAlign="center" padding={"1em"}>
        Your Groups
      </Heading>
      <ListGroups groups={groups_data} />
    </div>
  );
};

export default Groups;
