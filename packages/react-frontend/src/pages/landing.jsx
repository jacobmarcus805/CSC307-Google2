import React from "react";
import { Flex, Stack, HStack, Heading, Button, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Landing() {
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Stack spacing={8} align="center" textAlign="center">
        <Image
          src={logo}
          alt="Paw print logo"
          color="green.700"
          boxSize="250px"
          objectFit="contain"
        />

        <Heading color="green.700" fontSize={{ base: "5xl", md: "7xl" }}>
          Poly Pups
        </Heading>

        <Heading color="green.700" fontSize={{ base: "4xl", md: "6xl" }}>
          Welcome
        </Heading>

        <HStack spacing={6} justify="center">
          <Button as={RouterLink} to="/login" colorScheme="green" size="lg">
            Log In
          </Button>
          <Button
            as={RouterLink}
            to="/signup"
            variant="outline"
            colorScheme="green"
            size="lg"
          >
            Sign Up
          </Button>
        </HStack>
      </Stack>
    </Flex>
  );
}
