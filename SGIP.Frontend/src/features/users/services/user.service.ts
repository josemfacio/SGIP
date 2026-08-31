import { apiRequest } from "@/lib/api";
import type { CreateUserInput, User } from "../types/user.types";

export const userService = {
  getAll: () => apiRequest<User[]>("/api/users"),
  create: (input: CreateUserInput) =>
    apiRequest<User>("/api/users", { method: "POST", body: JSON.stringify(input) }),
};
