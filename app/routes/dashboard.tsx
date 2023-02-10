import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import NavbarComponent from "~/components/navbar.component";
import SideNavComponent from "~/components/sidenav.component";

import { getNoteListItems } from "~/models/note.server";

export async function loader({ request }: LoaderArgs) {
  const userId = '1'
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export default function DashboardLayout() {
  return (
    <>
    <NavbarComponent />
    <SideNavComponent />
    <div className="p-4 sm:ml-64">
      <div className="mt-14 p-4 dark:border-gray-700">
        <Outlet />
      </div>
    </div>
    </>
  );
}