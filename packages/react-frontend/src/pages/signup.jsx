import React, { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaArrowLeft } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaArrowLeft = chakra(FaArrowLeft);

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages
    setSuccessMessage(""); // Clear any previous success messages

    const formattedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign up");
      }

      const data = await response.json();
      console.log("User created successfully:", data);

      // Display success message
      setSuccessMessage("User created successfully!");

      // Clear the form on success
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="green.700" />
        <Heading color="green.700">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Display error message */}
              {errorMessage && (
                <Text color="red.500" textAlign="center">
                  {errorMessage}
                </Text>
              )}

              {/* Display success message */}
              {successMessage && (
                <Text color="green.500" textAlign="center">
                  {successMessage}
                </Text>
              )}

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                backgroundColor="green.700"
                color="white"
                width="full"
                isLoading={loading} // Show loading spinner
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Link
          color="green.700"
          href="/login"
          display="flex"
          alignItems="center"
        >
          <CFaArrowLeft /> Back to Login
        </Link>
      </Box>
    </Flex>
  );
}

export default Signup;
