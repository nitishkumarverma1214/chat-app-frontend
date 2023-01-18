import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../Components/Authentication/Signup";
import Signup from "../Components/Authentication/Login";
import { useNavigate } from "react-router-dom";

function Homepage() {
  return (
    <Container maxW="xl" minH={"100vh"} centerContent justifyContent={"center"}>
      <Box
        display="flex"
        bg={"white"}
        w="100%"
        borderRadius={"lg"}
        borderWidth="1px"
        justifyContent="center"
        mt={"1rem"}
        p={3}
      >
        <Text
          fontFamily={"Work Sans"}
          fontSize="3xl"
          fontWeight="bold"
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
        >
          Live Chat
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        borderRadius={"lg"}
        borderWidth="1px"
        p={4}
        mt="1rem"
      >
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signup />
            </TabPanel>
            <TabPanel>
              <Login />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
