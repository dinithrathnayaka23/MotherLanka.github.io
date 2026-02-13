import { useState } from "react";
import { apiPost } from "../../utils/api";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm MotherLanka Assistant. Ask me about places, stays, or travel tips in Sri Lanka.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    try {
      const { reply } = await apiPost("/api/chat", { message: userMessage });
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't respond right now. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[520px] max-h-[70vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">MotherLanka Assistant</span>
        <button onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4 bg-bgLight">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm
              ${
                msg.sender === "user"
                  ? "bg-primary text-white ml-auto"
                  : "bg-white shadow"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {["Best places in Ella?", "Beach stays?", "When to visit Sri Lanka?"].map(
          (q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap hover:bg-gray-200"
            >
              {q}
            </button>
          )
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 rounded-full"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
