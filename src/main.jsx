import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import Layout from "./Pages/Layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatProvider from "./context/chatProvider";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // change it later
      staleTime: 1,
      cacheTime: Infinity,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="/chat" element={<Chatpage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChatProvider>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </ChatProvider>
);
