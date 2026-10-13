"use client";

import React, { useState } from "react";
import { ContactMessage, NewsletterSubscriber } from "@/lib/types";
import {
  Mail,
  Phone,
  CheckCircle2,
  Download,
  Search,
  MessageSquare,
  Users,
} from "lucide-react";

interface MessagesManagerClientProps {
  initialMessages: ContactMessage[];
  initialSubscribers: NewsletterSubscriber[];
}

export function MessagesManagerClient({
  initialMessages,
  initialSubscribers,
}: MessagesManagerClientProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [messages] = useState<ContactMessage[]>(initialMessages);
  const [subscribers] = useState<NewsletterSubscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(s) ||
      msg.email.toLowerCase().includes(s) ||
      msg.subject.toLowerCase().includes(s) ||
      msg.message.toLowerCase().includes(s);
    return matchesSearch;
  });

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
            Read contact form inquiries stored in the shared restaurant database.
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
            <span>Contact Inquiries ({messages.length})</span>
          </button>
          {subscribers.length > 0 && <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "subscribers"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter List ({subscribers.length})</span>
          </button>}
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
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-cream/40"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-dark-wood text-sm">
                          {msg.name}
                        </span>
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

    </div>
  );
}
