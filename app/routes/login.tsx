import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import LogoComponent from "~/components/logo.component";

import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
  return json({});
}

export async function action({ context, request }: ActionArgs) {
  try {
    await authenticator.authenticate("form", request, {
      successRedirect: "/dashboard",
      throwOnError: true,
    });
  } catch (error: any) {
    if (error instanceof Response) return error;
    if (!error.message) {
      return json(error, { status: 500 });
    }

    if (
      error.message.startsWith("Email") ||
      error.message === "Invalid credentials, check your email and password"
    ) {
      return json({ errors: { email: error.message } }, { status: 400 });
    }
    if (error.message.startsWith("Password")) {
      return json({ errors: { password: error.message } }, { status: 400 });
    }

    return json(error, { status: 400 });
  }
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-sm space-y-5 text-gray-600">
        <div className="text-center text-white">
          <LogoComponent className="mx-auto h-12 w-36" />
          <div className="mt-5">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:text-3xl">
              Inicia sesión en tu cuenta
            </h3>
          </div>
        </div>
        <Form method="post" className="space-y-5" noValidate>
          <div className="relative">
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              className={`${actionData?.errors?.email ? 'focus:border-red-600 dark:border-red-500 border-red-600  dark:focus:border-red-500' : 'focus:border-blue-600 dark:focus:border-blue-500'} border peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white`}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`${actionData?.errors?.email ? 'peer-focus:text-red-600 peer-focus:dark:text-red-500' : 'peer-focus:text-blue-600 peer-focus:dark:text-blue-500'} absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-gray-400`}
            >
              Correo electrónico
            </label>
            {actionData?.errors?.email && (
                <p
                  id="outlined_error_help"
                  className="mt-2 text-xs text-red-600 dark:text-red-400"
                >
                  <span className="font-medium">¡Error!</span>{" "}
                  {actionData.errors.email}
                </p>
              )}
          </div>
          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              required
              autoFocus={true}
              name="password"
              type="password"
              autoComplete="password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className={`${actionData?.errors?.password ? 'focus:border-red-600 dark:border-red-500 border-red-600  dark:focus:border-red-500' : 'focus:border-blue-600 dark:focus:border-blue-500'} border peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white`}
              placeholder=" "
            />
            <label
              htmlFor="password"
              className={`${actionData?.errors?.password ? 'peer-focus:text-red-600 peer-focus:dark:text-red-500' : 'peer-focus:text-blue-600 peer-focus:dark:text-blue-500'} absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-gray-400`}
            >
              Contraseña
            </label>
            {actionData?.errors?.password && (
                <p
                  id="outlined_error_help"
                  className="mt-2 text-xs text-red-600 dark:text-red-400"
                >
                  <span className="font-medium">¡Error!</span>{" "}
                  {actionData.errors.password}
                </p>
              )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white duration-150 hover:bg-indigo-500 active:bg-indigo-600"
          >
            Iniciar sesión
          </button>
        </Form>
        <button className="flex w-full items-center justify-center gap-x-3 rounded-lg border py-2.5 text-sm font-medium duration-150 hover:bg-gray-50 active:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700">
          <svg
            className="h-5 w-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                fill="#4285F4"
              ></path>
              <path
                d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                fill="#34A853"
              ></path>
              <path
                d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                fill="#FBBC04"
              ></path>
              <path
                d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                fill="#EA4335"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          Ingresa con tu cuenta de Google
        </button>
      </div>
    </div>
  );
}
