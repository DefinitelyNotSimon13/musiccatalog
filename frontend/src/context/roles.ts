import { useKeycloakContext } from "./KeycloakContext";
import { AuthStatus } from "../types";

export function useIsAdmin(): boolean {
  const { state } = useKeycloakContext();
  if (state.status !== AuthStatus.AUTHENTICATED) return false;
  // Keycloak.js exposes roles in state.keycloak.tokenParsed.realm_access.roles
  const roles = (state.keycloak.tokenParsed?.realm_access?.roles ?? []) as string[];
  return roles.includes("ADMIN");
}