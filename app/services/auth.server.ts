import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import type { User } from "~/models/user.server";
import { formStrategy } from "./strategies/form.strategy";

export let authenticator = new Authenticator<User>(sessionStorage);
authenticator.use(formStrategy);