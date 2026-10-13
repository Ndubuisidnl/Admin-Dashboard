"use server";

import { createClient } from "@/lib/supabase/server";
import { ContactMessage, NewsletterSubscriber } from "@/lib/types";
import { revalidatePath } from "next/cache";

// SUPABASE: Fetch contact messages
export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_messages")
      .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error.message);
    return [];
  }

  return (data as ContactMessage[]) || [];
}

// SUPABASE: Fetch newsletter subscribers
export async function getNewsletterSubscribersAction(): Promise<NewsletterSubscriber[]> {
  // Newsletter subscribers are not part of the shared restaurant schema yet.
  return [];
}
