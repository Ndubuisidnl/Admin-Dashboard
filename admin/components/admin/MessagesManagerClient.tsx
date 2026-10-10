"use client";

import React, { useState, useTransition } from "react";
import { ContactMessage, NewsletterSubscriber } from "@/lib/types";
import {
  Mail,
  UserCheck,
  Phone,
  Trash2,
  CheckCircle2,
  MailCheck,
  Download,
  Search,
  MessageSquare,
  Users,
} from "lucide-react";
import {
  toggleMessageReadAction,
  deleteContactMessageAction,
} from "@/lib/actions/messages";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface MessagesManagerClientProps {
  initialMessages: ContactMessage[];
  initialSubscribers: NewsletterSubscriber[];
}

export function MessagesManagerClient({
  initialMessages,
  initialSubscribers,
}: MessagesManagerClientProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [subscribers] = useState<NewsletterSubscriber[]>(initialSubscribers);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesUnread = !unreadOnly || !msg.is_read;
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(s) ||
      msg.email.toLowerCase().includes(s) ||
      msg.subject.toLowerCase().includes(s) ||
      msg.message.toLowerCase().includes(s);
    return matchesUnread && matchesSearch;
  });

  const handleToggleRead = (msg: ContactMessage) => {
    startTransition(async () => {
      const res = await toggleMessageReadAction(msg.id, msg.is_read);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
        );
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage((prev) =>
            prev ? { ...prev, is_read: !prev.is_read } : null
          );
        }
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!messageToDelete) return;
    startTransition(async () => {
      const res = await deleteContactMessageAction(messageToDelete.id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
        if (selectedMessage?.id === messageToDelete.id) {
          setSelectedMessage(null);
        }
        setMessageToDelete(null);
      }
    });
  };

  const handleExportSubscribersCSV = () => {
    const headers = "Email Address,Subscribed Date\n";
    const rows = subscribers
      .map(
        (s) => `"${s.email}","${new Date(s.created_at).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wood-house-cafe-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-wood">
            Customer Communications
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Read contact form inquiries and manage your newsletter subscription list.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-cream p-1 rounded-xl border border-border-warm text-xs">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "inquiries"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Inquiries ({messages.filter((m) => !m.is_read).length})</span>
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "subscribers"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter List ({subscribers.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "inquiries" ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-warm-white p-4 rounded-xl border border-border-warm text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-cream border border-border-warm rounded-lg text-xs w-60"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer font-semibold text-text-dark">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="rounded text-warm-amber"
              />
              <span>Show Unread Only</span>
            </label>
          </div>

          {/* Messages List */}
          <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 p-8">
                <Mail className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
                <h3 className="text-base font-serif font-bold text-dark-wood">
                  No contact messages found
                </h3>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  Customer feedback and contact requests will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-warm/60">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      !msg.is_read
                        ? "bg-amber-50/40 font-medium border-l-4 border-l-warm-amber"
                        : "hover:bg-cream/40"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-dark-wood text-sm">
                          {msg.name}
                        </span>
                        {!msg.is_read && (
                          <span className="px-2 py-0.5 rounded bg-warm-amber text-dark-wood text-[10px] font-bold">
                            NEW UNREAD
                          </span>
                        )}
                        <span className="text-[11px] text-text-muted">
                          {new Date(msg.created_at).toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="font-semibold text-xs text-warm-brown">
                        Subject: {msg.subject}
                      </div>

                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>

                      <div className="flex items-center space-x-4 text-[11px] text-text-muted pt-1">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-warm-brown" />
                          <span>{msg.email}</span>
                        </span>
                        {msg.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-warm-brown" />
                            <span>{msg.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="px-3 py-1.5 bg-warm-amber/20 hover:bg-warm-amber text-dark-wood font-semibold rounded-lg text-xs transition-colors"
                      >
                        Read Message
                      </button>
                      <button
                        onClick={() => handleToggleRead(msg)}
                        className={`p-2 rounded-lg text-xs font-semibold border transition-colors ${
                          msg.is_read
                            ? "border-border-warm text-text-muted hover:bg-cream"
                            : "border-warm-amber text-warm-brown hover:bg-amber-100"
                        }`}
                        title={msg.is_read ? "Mark Unread" : "Mark Read"}
                      >
                        <MailCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMessageToDelete(msg)}
                        className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Newsletter Subscribers Tab */
        <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-dark-wood">
                Active Newsletter Subscribers ({subscribers.length})
              </h3>
              <p className="text-xs text-text-muted">
                Customers opted-in to receive special offers, events, and seasonal menu launches.
              </p>
            </div>
            <button
              onClick={handleExportSubscribersCSV}
              disabled={subscribers.length === 0}
              className="px-4 py-2 bg-dark-wood hover:bg-espresso text-light-caramel font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-warm rounded-xl bg-cream-card/30">
              <Users className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-dark-wood">
                No newsletter subscribers yet
              </p>
              <p className="text-xs text-text-muted mt-1">
                Subscribers who sign up on the main website will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-card border-b border-border-warm text-text-muted uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm/60">
                  {subscribers.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-cream/40">
                      <td className="py-3 px-4 font-mono font-bold text-text-muted">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-dark-wood">
                        {sub.email}
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        {new Date(sub.created_at).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-warm-white rounded-2xl shadow-2xl max-w-lg w-full border border-border-warm overflow-hidden">
            <div className="p-6 bg-espresso text-light-caramel border-b border-warm-amber/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-warm-amber">
                  Inquiry Message
                </span>
                <h3 className="font-serif font-bold text-lg">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-cream-card/70 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-cream p-4 rounded-xl border border-border-warm space-y-2">
                <div className="font-bold text-dark-wood text-sm">
                  {selectedMessage.name}
                </div>
                <div className="text-text-muted space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-warm-amber" />
                    <span>{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-warm-amber" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-dark mb-1 text-[11px] uppercase tracking-wider">
                  Message Content:
                </label>
                <div className="p-4 bg-cream-card/60 rounded-xl border border-border-warm text-dark-wood leading-relaxed font-sans text-xs whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 border-t border-border-warm flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="px-3 py-1.5 bg-cream hover:bg-cream-card text-text-dark font-semibold rounded-lg border border-border-warm"
                >
                  {selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-5 py-2 bg-dark-wood text-light-caramel font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(messageToDelete)}
        title="Delete Contact Message"
        message={`Are you sure you want to delete this message from ${messageToDelete?.name}?`}
        confirmText="Delete Message"
        isDanger
        isLoading={isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setMessageToDelete(null)}
      />
    </div>
  );
}
