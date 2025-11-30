import {
  createContext,
  useContext,
} from "react";
import { type AuthState } from "../types";

export interface KeycloakContextValue {
  state: AuthState;
  login: () => void;
  logout: () => void;
}

export const KeycloakContext = createContext<KeycloakContextValue | undefined>(
  undefined
);

export const useKeycloakContext = () => {
  const ctx = useContext(KeycloakContext);
  if(!ctx) throw new Error("useKeyloakContext must be used inside a provider");
  return ctx;
}
