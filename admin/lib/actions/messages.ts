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

// SUPABASE: Toggle message read status
export async function toggleMessageReadAction(
  id: string,
  currentIsRead: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: !currentIsRead })
    .eq("id", id);

  if (error) {
    return { error: `Failed to update status: ${error.message}` };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

// SUPABASE: Delete contact message
export async function deleteContactMessageAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    return { error: `Failed to delete message: ${error.message}` };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

// SUPABASE: Fetch newsletter subscribers
export async function getNewsletterSubscribersAction(): Promise<NewsletterSubscriber[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error.message);
    return [];
  }

  return (data as NewsletterSubscriber[]) || [];
}
