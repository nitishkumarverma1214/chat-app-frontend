import React from "react";
import { chatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "../SingleChat";
function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = chatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="flex"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
