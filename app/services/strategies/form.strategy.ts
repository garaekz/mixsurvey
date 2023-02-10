import { FormStrategy } from "remix-auth-form";
import { verifyLogin } from "~/models/user.server";
import { validateEmail, validatePassword } from '~/utils';

export const formStrategy = new FormStrategy(async ({ form, context }) => {
  let email = form.get("email");
  let password = form.get("password");

  validateEmail(email);
  validatePassword(password);

  const user = await verifyLogin(email as string, password as string);

  if (!user) {
    throw new Error("Invalid credentials, check your email and password");
  }
  console.log("user", user);
  return user;
})