import React, { useState } from "react";
import EmailCard from './EmailCard.jsx';

// Compose Message Form
function EmailForm({ onSend }) {
  const [form, setForm] = useState({  
    name: "",
    sender: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sender || !form.subject || !form.message) {
      alert("Please fill in all fields.");
      return;
    }

    const url = "http://127.0.0.1:8000"; // Replace with your actual API endpoint
    const endpoint = "/urgency/get";

    try {
      // Send message to backend to get urgency
      const urgencyRes = await fetch(url + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          subject: form.subject,
          message: form.message 
        }),
      });

      const { urgency } = await urgencyRes.json(); // expects { urgency: "high" | "medium" | "low" }

      const newMessage = {
        id: Date.now(),
        sender: form.name,
        send_to: form.sender,
        subject: form.subject,
        message: form.message,
        urgency: urgency.toLowerCase(), // normalize
        date: new Date().toISOString(),
      };

      onSend(newMessage);
      setForm({ name: "", sender: "", subject: "", message: "" });
    } catch (err) {
      console.error("Failed to determine urgency or send message:", err);
      // Fallback to medium urgency if API fails
      const newMessage = {
        id: Date.now(),
        sender: form.name,
        send_to: form.sender,
        subject: form.subject,
        message: form.message,
        urgency: "unknown",
        date: new Date().toISOString(),
      };
      onSend(newMessage);
      setForm({ name: "", sender: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📨 Compose Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-600 block mb-1">Your Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Jane Doe"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 block mb-1">Email Address</label>
          <input
            name="sender"
            type="email"
            value={form.sender}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. jane@example.com"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 block mb-1">Subject</label>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Request for Information"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 block mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none h-28 resize-none"
            placeholder="Write your message..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

// Admin Inbox with Tabs
function AdminInbox({ messages }) {
  const [activeTab, setActiveTab] = useState("high");

  const filteredMessages = messages.filter((msg) => msg.urgency === activeTab);

  const urgencies = ["high", "medium", "low"];
  const urgencyLabels = {
    high: "🔴 High",
    medium: "🟠 Medium",
    low: "🟢 Low",
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📬 Admin Inbox</h2>

      {/* Urgency Tabs */}
      <div className="flex space-x-3 mb-6">
        {urgencies.map((urgency) => (
          <button
            key={urgency}
            onClick={() => setActiveTab(urgency)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
              activeTab === urgency
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {urgencyLabels[urgency]}
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <p className="text-gray-500 text-center">
          No {urgencyLabels[activeTab]} urgency messages.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <EmailCard key={msg.id} email={msg} />
          ))}
        </div>
      )}
    </div>
  );
}


// App Component
export default function EmailApp() {
  // Initialize with empty messages array
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages((prev) => [message, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmailForm onSend={handleSendMessage} />
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📬 Message Cards</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet. Send your first message!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <EmailCard key={msg.id} email={msg} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-6xl w-full mt-8">
        <AdminInbox messages={messages} />
      </div>
    </div>
  );
}
