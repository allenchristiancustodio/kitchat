import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { selectedUser, sendMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedUser || !authUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage({
      content: message,
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-base-300 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
