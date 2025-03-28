import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
// import { Socket } from "socket.io-client";

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  status?: "online" | "offline";
}

interface Message {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

interface MessageData {
  content: string;
  senderId: string;
  receiverId: string;
}

interface ChatState {
  // State
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  // Actions
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  //   subscribeToMessages: () => void;
  //   unsubscribeFromMessages: () => void;
  setSelectedUser: (user: User | null) => void;
}

// Extend the AuthState to include socket
// interface AuthStateWithSocket {
//   socket: Socket;
// }

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Actions
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/users");
      set({ users: res.data });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to fetch messages");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const state = get();
    if (!state.selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${state.selectedUser._id}`,
        messageData
      );
      set({ messages: [...state.messages, res.data] });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to send message");
      }
    }
  },

  //   subscribeToMessages: () => {
  //     const state = get();
  //     if (!state.selectedUser) return;

  //     const authState = useAuthStore.getState() as unknown as AuthStateWithSocket;
  //     const socket = authState.socket;

  //     socket.on("newMessage", (newMessage: Message) => {
  //       const isMessageSentFromSelectedUser =
  //         newMessage.senderId === state.selectedUser?._id;
  //       if (!isMessageSentFromSelectedUser) return;

  //       set({
  //         messages: [...state.messages, newMessage],
  //       });
  //     });
  //   },

  //   unsubscribeFromMessages: () => {
  //     const authState = useAuthStore.getState() as unknown as AuthStateWithSocket;
  //     const socket = authState.socket;
  //     socket.off("newMessage");
  //   },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
