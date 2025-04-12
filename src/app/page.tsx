"use client";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWlraG9hbjEiLCJpYXQiOjE3NDQ0NTI5OTMsImV4cCI6MTc0NDQ3NDU5M30.Bs5sxcwvM8oXrHNVtN8X0sfB2APLBg1O4eAQma9MPIw";
// const userId = "dff23607-307e-49aa-8f96-b5b4280eade9";
const convId = "f2f3d797-130d-4552-bafe-46db3bfa380d";
const brokerURL = "ws://157.66.101.32:9200/ws";
const role = "DOCTOR";

export default function Home() {
  useEffect(() => {
    const client = new Client({
      brokerURL: brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        role: role,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        client.subscribe(`/topic/${convId}`, (message) =>
          console.log(`Received: ${message.body}`)
        );

        client.publish({
          destination: `/topic/${convId}`,
          body: "First Message",
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
      },
      onWebSocketClose: (event) => {
        console.log("WebSocket closed:", event);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return <div>Test</div>;
}
