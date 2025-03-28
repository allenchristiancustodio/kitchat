import { AuthUser } from "./../types/authTypes";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

// Define the types for the state and actions
const BASE_URL = "http://localhost:5002";
interface AuthState {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  // Define actions to update the state
  setAuthUser: (user: AuthUser | null) => void;
  setIsSigningUp: (isSigningUp: boolean) => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
  setIsUpdatingProfile: (isUpdatingProfile: boolean) => void;
  setIsCheckingAuth: (isCheckingAuth: boolean) => void;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
  signUp: (data: { email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  updateProfile: (data: {
    fullName: string;
    profilePic: string;
  }) => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
}

// Create the store with type-safe state
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Actions to update state
  setAuthUser: (user) => set({ authUser: user }),
  setIsSigningUp: (isSigningUp) => set({ isSigningUp }),
  setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
  setIsUpdatingProfile: (isUpdatingProfile) => set({ isUpdatingProfile }),
  setIsCheckingAuth: (isCheckingAuth) => set({ isCheckingAuth }),

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true }); // Set loading state to true
      const res = await axiosInstance.get("/auth/check"); // Make the async API call
      set({ authUser: res.data }); // Update authUser and reset loading state
      get().connectSocket();
    } catch (error) {
      set({ authUser: null }); // Set loading state to false on error
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: async () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));
