"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
