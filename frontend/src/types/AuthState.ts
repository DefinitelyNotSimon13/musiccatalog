import Keycloak, { type KeycloakProfile } from "keycloak-js";

export enum AuthStatus {
  INITIALIZING = "initializing",
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  ERROR = "error",
}

export type AuthState =
  | {
      status: AuthStatus.INITIALIZING;
      keycloak: Keycloak | null;
    }
  | {
      status: AuthStatus.UNAUTHENTICATED;
      keycloak: Keycloak;
    }
  | {
      status: AuthStatus.AUTHENTICATED;
      keycloak: Keycloak;
      token: string;
      profile: KeycloakProfile;
    }
  | {
      status: AuthStatus.ERROR;
      keycloak: Keycloak | null;
      error: unknown;
    };