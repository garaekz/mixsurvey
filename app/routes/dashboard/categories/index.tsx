import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createCategory, getAllCategories } from "~/models/category.server";
import { toast, Toaster } from "react-hot-toast";
import ToastComponent from "~/components/toast.component";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const categories = await getAllCategories();
  return json({ user, categories });
};

export const action = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const body = new URLSearchParams(await request.text());
  const name = body.get("name");

  if (!name) {
    return json(
      { error: "El nombre de la categorías es necesario" },
      { status: 400 }
    );
  }

  const data = {
    name,
    // The user should always exist because of the isAuthenticated check.
    userId: user!.id,
  };

  try {
    const success = await createCategory(data);
    return json({ success }, { status: 201 });
  } catch (error: any) {
    if (
      error.code &&
      error.code === "P2002" &&
      error.meta?.target === "Category_name_key"
    ) {
      return json(
        {
          errors: {
            name: "Ya existe una categoría con ese nombre",
          },
        },
        { status: 400 }
      );
    }
    return json({ errors: {
      unknown: "Ocurrío un error inesperado",
    } }, { status: 400 });
  }
};

export default function CategoriesIndexPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<{
    success?: any;
    errors?: {
      name?: string;
    };
  }>();
  const errors = actionData?.errors;
  const success = actionData?.success;

  useEffect(() => {
    if (success) {
      setIsCreating(false);
      toast.custom(<ToastComponent message="Categoría creada exitosamente" type="success" />);
    }
  }, [success]);

  return (
    <>
      <Toaster />
      <Transition appear show={isCreating} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => setIsCreating(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-5">
                  <Dialog.Title className="mb-4 flex items-center justify-between rounded-t border-b pb-4 dark:border-gray-600 sm:mb-5">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      Nueva categoría
                    </div>
                    <button
                      onClick={() => setIsCreating(false)}
                      type="button"
                      className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="defaultModal"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </Dialog.Title>
                  <Form method="post">
                    <div className="mb-4 flex flex-col justify-start gap-4 text-left">
                      <div className="relative">
                        <input
                          id="name"
                          required
                          autoFocus={true}
                          name="name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={
                            errors?.name ? true : undefined
                          }
                          aria-describedby="name-error"
                          className={`${
                            errors?.name
                              ? "border-red-600 focus:border-red-600 dark:border-red-500  dark:focus:border-red-500"
                              : "focus:border-blue-600 dark:focus:border-blue-500"
                          } peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-800 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="name"
                          className={`${
                            errors?.name
                              ? "peer-focus:text-red-600 peer-focus:dark:text-red-500"
                              : "peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                          } absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-800 dark:text-gray-400`}
                        >
                          Nombre
                        </label>
                        {errors?.name && (
                          <p
                            id="outlined_error_help"
                            className="mt-2 text-xs text-red-600 dark:text-red-400"
                          >
                            <span className="font-medium">¡Error!</span>{" "}
                            {errors?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Guardar
                      </button>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
        <div className="mx-auto max-w-screen-xl lg:px-12">
          <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div className="flex flex-col items-center justify-end space-y-3 p-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-y-0 md:space-x-3">
                <button
                  onClick={() => setIsCreating(true)}
                  type="button"
                  className="flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <svg
                    className="mr-2 h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Crear categoría
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Categoría
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { categories.map((category) => (
                  <tr key={category.id} className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white"
                    >
                      {category.name}
                    </th>
                    <td className="flex items-center justify-end px-4 py-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ml-2 inline-flex items-center rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  1-10
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  1000
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <a
                    href="#"
                    className="ml-0 flex h-full items-center justify-center rounded-l-lg border border-gray-300 bg-white py-1.5 px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center border border-gray-300 bg-white py-2 px-3 text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center border border-gray-300 bg-white py-2 px-3 text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 flex items-center justify-center border border-primary-300 bg-primary-50 py-2 px-3 text-sm leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center border border-gray-300 bg-white py-2 px-3 text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    ...
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center border border-gray-300 bg-white py-2 px-3 text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    100
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex h-full items-center justify-center rounded-r-lg border border-gray-300 bg-white py-1.5 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
