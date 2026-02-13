import { useEffect, useState } from "react";
import ChatButton from "./ChatbotButton";
import ChatWindow from "./ChatWindow";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <ChatButton onClick={() => setOpen(true)} />
    </>
  );
};

export default Chatbot;
