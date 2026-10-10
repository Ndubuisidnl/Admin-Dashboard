import React from "react";
import {
  getContactMessagesAction,
  getNewsletterSubscribersAction,
} from "@/lib/actions/messages";
import { MessagesManagerClient } from "@/components/admin/MessagesManagerClient";

export const instant = false;

export default async function AdminMessagesPage() {
  const [messages, subscribers] = await Promise.all([
    getContactMessagesAction(),
    getNewsletterSubscribersAction(),
  ]);

  return (
    <MessagesManagerClient
      initialMessages={messages}
      initialSubscribers={subscribers}
    />
  );
}
