import React from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  return (
    <Box bg="green.700" px={4} py={2} color="white">
      <Flex alignItems="center" justifyContent="center">
        {/* App Name */}
        <Link
          as={RouterLink}
          to="/login"
          fontWeight="bold"
          fontSize="lg"
          color="white"
          mr={8}
        >
          Poly Pups
        </Link>

        {/* Buttons grouped closer together */}
        <Flex alignItems="center" gap={4}>
          {/* Schedule Button */}
          <Button
            as={RouterLink}
            to="/username/schedule"
            colorScheme="green"
            variant="ghost"
            size="lg"
            color="white"
            _hover={{ bg: "green.600" }} // Change background color on hover
          >
            Schedule
          </Button>
          {/* Groups Button */}
          <Button
            as={RouterLink}
            to="/groups"
            colorScheme="green"
            variant="ghost"
            size="lg"
            color="white"
            _hover={{ bg: "green.600" }} // Change background color on hover
          >
            Groups
          </Button>
          {/* Login Button */}
          <Button
            as={RouterLink}
            to="/login"
            colorScheme="green"
            variant="ghost"
            size="lg"
            color="white"
            _hover={{ bg: "green.600" }} // Change background color on hover
          >
            Login
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
