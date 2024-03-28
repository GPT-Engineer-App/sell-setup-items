import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, FormControl, FormLabel, VStack, Grid, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const API_URL = "https://backengine-51r9.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      setAccessToken(token);
      fetchItems(token);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        fetchItems(data.accessToken);
      } else {
        toast({
          title: "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Signup successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Signup failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const fetchItems = async (token) => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" mb={8}>
        My Store
      </Heading>

      {!isLoggedIn ? (
        <VStack spacing={4} align="stretch">
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleSignup}>Signup</Button>
        </VStack>
      ) : (
        <>
          <Heading as="h2" size="lg" mb={4}>
            Items for Sale
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
            {items.map((item) => (
              <Box key={item.id} borderWidth={1} borderRadius="lg" p={4}>
                <Heading as="h3" size="md" mb={2}>
                  {item.name}
                </Heading>
                <Text mb={2}>{item.description}</Text>
                <Button leftIcon={<FaTrash />} size="sm" onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </Button>
              </Box>
            ))}
          </Grid>
          <Button
            mt={8}
            leftIcon={<FaPlus />}
            onClick={() => {
              // TODO: Implement adding new items
            }}
          >
            Add Item
          </Button>
        </>
      )}
    </Box>
  );
};

export default Index;
