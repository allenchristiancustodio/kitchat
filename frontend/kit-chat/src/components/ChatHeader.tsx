import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="border-b border-base-300 p-4">
      <div className="flex items-center gap-3">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullName}
          className="size-10 rounded-full"
        />
        <div>
          <h2 className="font-medium">{selectedUser.fullName}</h2>
          <p className="text-sm text-zinc-400">
            {selectedUser.status === "online" ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
