import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { chatState } from "../context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserAvatar/UserListItem";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../config/ChatLogics";
function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = chatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser("");
    navigate("/");
  };

  const toast = useToast();
  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/chat`,
        { userId },
        config
      );

      console.log(chats);
      if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setChatLoading(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error while fetching the chats",
        duration: 5000,
        status: "error",
        isClosable: true,
        description: error.message,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter name or email",
        duration: 5000,
        status: "warning",
        isClosable: true,
        position: "top-left",
      });
    }
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/user?search=${search}`,
        config
      );
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occured",
        description: "Failed to load the search results",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <div>
      <Box
        display="flex"
        bg={"white"}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{ width: "16px", height: "18px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <Text display={{ base: "none", md: "flex" }} p="4">
              {" "}
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontFamily="Work Sans" fontSize="2xl" fontWeight="bold">
          Live Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Message"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor="pointer"
                name="user.name"
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={1}>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {isLoading ? (
              <ChatLoading />
            ) : searchResult?.length > 0 ? (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <Text> No Search Results Found</Text>
            )}
            {chatLoading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default SideDrawer;
