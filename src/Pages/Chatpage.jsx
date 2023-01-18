import { Box } from "@chakra-ui/react";
import { chatState } from "../context/chatProvider";
import ChatBox from "../Components/miscellaneous/ChatBox";
import MyChats from "../Components/MyChats";
import SideDrawer from "../Components/SideDrawer";
import { useState } from "react";

function Chatpage() {
  const { user } = chatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%" }} className="chat-page">
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chatpage;
