import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { verifyLogin } from "~/models/user.server";

export const formStrategy = new FormStrategy(async ({ form, context }) => {
  let email = form.get("email");
  let password = form.get("password");

  // You can validate the inputs however you want
  invariant(typeof email === "string", "username must be a string");
  invariant(email.length > 0, "username must not be empty");

  invariant(typeof password === "string", "password must be a string");
  invariant(password.length > 0, "password must not be empty");

  const user = await verifyLogin(email, password);
  if (!user) {
    throw new Error("Invalid username or password");
  }
  return user;
})