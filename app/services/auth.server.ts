import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import type { User } from "~/models/user.server";
import { formStrategy } from "./strategies/form.strategy";
import { googleStrategy } from "./strategies/google.strategy";

export const getCallback = (provider: string) => {
  const baseUrl = process.env.REDIRECT_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/auth/${provider}/callback`
}

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(formStrategy);
authenticator.use(googleStrategy);