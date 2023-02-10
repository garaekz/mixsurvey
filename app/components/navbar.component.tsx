import { Form } from "@remix-run/react";
import { Menu, Transition, Switch } from "@headlessui/react";
import { Theme, useTheme } from "~/utils/theme-provider";
import { RiMoonClearFill } from "react-icons/ri";
import { FaSun } from "react-icons/fa";

export default function NavbarComponent() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((theme) => (theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <a href="/" className="ml-2 flex md:mr-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-8"
                alt="Mixsurvey Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
                Mixsurvey
              </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={theme === Theme.LIGHT}
              onChange={toggleTheme}
              className={`${
                theme  === Theme.LIGHT ? 'bg-blue-600' : 'bg-gray-500'
              } relative -mx-2 inline-flex h-4 w-10 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  theme === Theme.LIGHT ? 'translate-x-5' : 'translate-x-0'
                } h-6 w-6 transform rounded-full bg-white border border-gray-200 transition flex justify-center items-center`}
              >
                {theme === Theme.LIGHT ? <FaSun className="text-yellow-500" /> : <RiMoonClearFill className="text-gray-500" />}
              </span>
            </Switch>
            <div className="ml-3 flex items-center">
              <div className="relative">
                <Menu>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user"
                    />
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute right-0 top-0 z-50 my-2 w-56 rounded bg-white text-base shadow dark:bg-gray-700">
                      <div className="px-4 py-3" role="none">
                        <p
                          className="text-sm text-gray-900 dark:text-white"
                          role="none"
                        >
                          Neil Sims
                        </p>
                        <p
                          className="truncate text-sm font-medium text-gray-900 dark:text-gray-300"
                          role="none"
                        >
                          neil.sims@flowbite.com
                        </p>
                        
                      </div>
                      <hr className="h-px my-2 bg-gray-100 border-0 dark:bg-gray-600"></hr>
                      <Menu.Item>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Earnings
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <Form action="/logout" method="post">
                          <button
                            type="submit"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                          >
                            Cerrar sesión
                          </button>
                        </Form>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
