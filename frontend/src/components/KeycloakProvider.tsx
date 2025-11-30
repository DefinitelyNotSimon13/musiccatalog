import Keycloak, { type KeycloakProfile } from "keycloak-js";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AuthStatus, type AuthState, type KeycloakConfig } from "../types";
import { KeycloakContext } from "../context/KeycloakContext";

import { setAuthToken } from "../api/ApiConnector";

const DEFAULT_CONFIG: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string,
};

interface KeycloakProviderProps {
  children: ReactNode;
  config?: KeycloakConfig;
}

export function KeycloakProvider({
  children,
  config = DEFAULT_CONFIG,
}: KeycloakProviderProps) {
  const isRun = useRef<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>({
    status: AuthStatus.INITIALIZING,
    keycloak: null,
  });

  const applyToken = (token: string | null) => {
    setAuthToken(token);
  };

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    console.debug(
      "[KeycloakProvider] Initializing keycloak with config: ",
      config
    );
    const keycloak = new Keycloak(config);

    setAuthState({ status: AuthStatus.INITIALIZING, keycloak });

    keycloak
      .init({ onLoad: "check-sso", pkceMethod: "S256" })
      .then(async (isAuthenticated) => {
        if (!isAuthenticated) {
          console.debug("[KeycloakProvider] User is not authenticated.");
          applyToken(null);
          setAuthState({
            status: AuthStatus.UNAUTHENTICATED,
            keycloak,
          });
          return;
        }

        const token = keycloak.token;
        if (!token) {
          console.error(
            "[KeycloakProvider] Authenticated but access token not available"
          );
          setAuthState({
            status: AuthStatus.ERROR,
            keycloak,
            error: new Error("Authenticated but access token not available"),
          });
          return;
        }

        applyToken(token);

        let profile: KeycloakProfile;
        try {
          profile = await keycloak.loadUserProfile();
          console.debug("[KeycloakProvider] Loaded user profile: ", profile);
        } catch (error) {
          console.error("[KeyloakProvider] Unable to load user profile", error);
          setAuthState({
            status: AuthStatus.ERROR,
            keycloak,
            error,
          });
          return;
        }

        setAuthState({
          status: AuthStatus.AUTHENTICATED,
          keycloak,
          token,
          profile,
        });
      })
      .catch((error) => {
        applyToken(null);
        setAuthState({
          status: AuthStatus.ERROR,
          keycloak,
          error,
        });
      });

    const intervalId = window.setInterval(() => {
      if (authState.status !== AuthStatus.AUTHENTICATED) return;

      keycloak
        .updateToken(60)
        .then((refreshed) => {
          if (refreshed && keycloak.token) {
            applyToken(keycloak.token);
            setAuthState((prev) =>
              prev.status === AuthStatus.AUTHENTICATED
                ? { ...prev, token: keycloak.token! }
                : prev
            );
          }
        })
        .catch((error) => {
          console.error("[KeycloakProvider] Unable to update token: ", error);
          applyToken(null);
          keycloak.logout({ redirectUri: window.location.origin });
          setAuthState({
            status: AuthStatus.UNAUTHENTICATED,
            keycloak,
          });
        });
    }, 30000);

    return () => {
      clearInterval(intervalId);
      applyToken(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.url, config.realm, config.clientId]);

  const login = () => {
    const kc = authState.keycloak;
    if (!kc) return;
    kc.login({ redirectUri: window.location.href });
  };

  const logout = () => {
    const kc = authState.keycloak;
    if (!kc) return;
    applyToken(null);
    kc.logout({ redirectUri: window.location.href });
    setAuthState({ status: AuthStatus.UNAUTHENTICATED, keycloak: kc });
  };

  return (
    <KeycloakContext.Provider value={{ state: authState, login, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
}
