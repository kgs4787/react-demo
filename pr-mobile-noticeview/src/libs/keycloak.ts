import { parseCookies } from "./cookie";
import { getKeycloakInstance, SSRCookies } from "@react-keycloak/ssr";
import Router from "next/router";

export const keycloakConfig = {
  realm: "demo",
  url: "http://localhost:9080/auth",
  clientId: "react-auth",
};

export const initOptions = {
  onLoad: "login-required",
  checkLoginIframe: false,
};

export const getPersistor = (cookies: any) => {
  return SSRCookies(cookies);
};

export const onHandleEvent = (evt: any) => {
  if (evt === "onAuthSuccess") {
    if (Router.router && Router.router.pathname === "/") {
      Router.push("/auth_success", "/");
      Router.push("/?loginFlag=true", "/");
    }
  }
};

export const Keycloak = (req: any) => {
  const cookies = parseCookies(req);
  return getKeycloakInstance(keycloakConfig, getPersistor(cookies));
};
