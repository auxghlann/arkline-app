import React, { useState } from "react";

// Email sending component
function EmailForm({ onSend }) {
  const [form, setForm] = useState({
    name: "",
    sender: "",
    messageBody: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.sender || !form.messageBody) {
      alert("Please fill in all fields.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      ...form,
      date: new Date().toISOString(),
    };

    onSend(newMessage);
    setForm({ name: "", sender: "", messageBody: "" });
  };

  return (
    <div className="p-4 border rounded-lg shadow w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">📨 Compose Message</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="sender"
          placeholder="Sender Email"
          value={form.sender}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          name="messageBody"
          placeholder="Write your message..."
          value={form.messageBody}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded h-28"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Admin view component
function AdminInbox({ messages }) {
  return (
    <div className="p-4 border rounded-lg shadow w-full max-w-2xl mt-6">
      <h2 className="text-xl font-semibold mb-4">📬 Admin Inbox</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="p-3 border rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="text-sm text-gray-600">
                <strong>From:</strong> {msg.name} ({msg.sender}) <br />
                <strong>Date:</strong> {new Date(msg.date).toLocaleString()}
              </div>
              <div className="mt-2">
                <strong>Message:</strong>
                <p>{msg.messageBody}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Main App
export default function EmailApp() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    setMessages((prev) => [message, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <EmailForm onSend={handleSendMessage} />
      <AdminInbox messages={messages} />
    </div>
  );
}
