import type { User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NavbarComponent from "~/components/navbar.component";
import SideNavComponent from "~/components/sidenav.component";

import { getNoteListItems } from "~/models/note.server";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ user });
}

export default function DashboardLayout() {
  const loaderData = useLoaderData<typeof loader>();
  const { user } = loaderData;

  return (
    <>
    <NavbarComponent user={user} />
    <SideNavComponent />
    <div className="p-4 sm:ml-64">
      <div className="mt-16 dark:border-gray-700">
        <Outlet />
      </div>
    </div>
    </>
  );
}
