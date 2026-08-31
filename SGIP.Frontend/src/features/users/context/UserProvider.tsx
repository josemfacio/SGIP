"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/user.service";
import type { CreateUserInput, User } from "../types/user.types";

const ACTIVE_USER_KEY = "sgip-active-user";

interface UserContextValue {
  users: User[];
  activeUser: User | null;
  loading: boolean;
  error: string;
  selectUser: (userId: string) => void;
  createUser: (input: CreateUserInput) => Promise<User>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void userService
      .getAll()
      .then((data) => {
        setUsers(data);
        const savedUserId = localStorage.getItem(ACTIVE_USER_KEY);
        const initialUser = data.find((user) => user.userId === savedUserId) ?? data[0];
        if (initialUser) setActiveUserId(initialUser.userId);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "No se pudieron cargar los usuarios");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectUser = (userId: string) => {
    setActiveUserId(userId);
    localStorage.setItem(ACTIVE_USER_KEY, userId);
  };

  const createUser = async (input: CreateUserInput) => {
    const created = await userService.create(input);
    setUsers((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
    selectUser(created.userId);
    return created;
  };

  const value = {
    users,
    activeUser: users.find((user) => user.userId === activeUserId) ?? null,
    loading,
    error,
    selectUser,
    createUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUsers debe usarse dentro de UserProvider");
  return context;
}
