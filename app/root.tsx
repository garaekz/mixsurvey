import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";

import { getThemeSession } from "~/utils/theme.server";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export async function loader({ request }: LoaderArgs) {
  const themeSession = await getThemeSession(request);
  return json({
    theme: themeSession.getTheme(),
    user: null,
  });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Mixsurvey | Light Remix Surveys",
  viewport: "width=device-width,initial-scale=1",
});

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en"  className={`h-full ${clsx(theme)}`}>
      <head>
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="h-full bg-white dark:bg-slate-900">
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  )
}