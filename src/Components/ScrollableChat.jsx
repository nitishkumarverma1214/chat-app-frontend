import { Avatar, Tooltip } from "@chakra-ui/react";
import React, { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { chatState } from "../context/ChatProvider";
function ScrollableChat({ messages }) {
  const { user } = chatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.length > 0 &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              justifyContent: `${
                m.sender._id !== user._id ? "start" : "flex-end"
              }`,
              marginBottom: "1.5px",
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                background: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9FFD0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
