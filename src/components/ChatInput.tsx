"use client";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    setIsLoading(true);
    try {
      await axios.post("/api/message", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 ">
      <div className="relative rounded-lg shadow-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-500">
        <TextareaAutosize
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent py-1.5 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:ring-0"
        />

        <div
          className="h-14"
          aria-hidden="true"
          onClick={() => textareaRef.current?.focus()}
        />

        <Button
          isLoading={isLoading}
          type="submit"
          onClick={sendMessage}
          className="absolute bottom-0 right-0 m-2"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
