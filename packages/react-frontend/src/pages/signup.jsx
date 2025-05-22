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
import { FaUserAlt, FaArrowLeft } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
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

  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const API_PREFIX = import.meta.env.VITE_API_BASE_URL;

  function signupUser(creds) {
    return fetch(`${API_PREFIX}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: creds.name,
        email: creds.username,
        password: creds.pwd,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json().then((payload) => {
            setToken(payload.token);
            localStorage.setItem("authToken", payload.token);
            setMessage(
              `Signup successful for user: ${creds.username}; auth token saved`,
            );
            setSuccessMessage(
              "Account created successfully! Redirecting to login...",
            );
            return payload.token;
          });
        } else {
          const error = `Signup Error ${response.status}`;
          setMessage(error);
          setErrorMessage(error);
          throw new Error(error);
        }
      })
      .catch((error) => {
        const errorMsg = `Signup Error: ${error.message}`;
        setMessage(errorMsg);
        setErrorMessage(errorMsg);
        throw error;
      });
  }

  // Simplified handleSubmit function
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setMessage("");

    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Call the signupUser function with credentials
      const token = await signupUser({
        username: formData.email,
        pwd: formData.password,
      });

      // If we get here, the signup was successful
      console.log("Signup successful, token:", token);

      // Create the user profile with the token
      const userResponse = await fetch(`${API_PREFIX}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `User creation failed with status ${userResponse.status}`,
        );
      }

      const userData = await userResponse.json();
      console.log("User created successfully:", userData);

      // Clear the form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error during sign up:", error);
      // The error message is already set in the signupUser function
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
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>{" "}
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
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>{" "}
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
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>{" "}
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
