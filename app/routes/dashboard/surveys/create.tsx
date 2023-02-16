import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAllQuestionTypes } from "~/models/question-type.server";
import CreateQuestionComponent from "~/components/create-question.component";
import { authenticator } from "~/services/auth.server";
import { createSurvey, getPagedSurveys } from "~/models/survey.server";
import qs from "qs";
import ToastComponent from "~/components/toast.component";
import { toast, Toaster } from "react-hot-toast";
import { HiMinus } from "react-icons/hi";
import { commitSession, getSession } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const questionTypes = await getAllQuestionTypes();
  const surveys = await getPagedSurveys(1, 10);
  return json({ questionTypes, surveys, user });
};

export const action = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  try {
    const text = await request.text();
    const data = qs.parse(text);
    data.userId = user.id;
    const parsedData = JSON.parse(JSON.stringify(data));
    await createSurvey(parsedData);
    const session = await getSession(request.headers.get("Cookie"));
    session.flash(
      "success",
      `La encuesta ${parsedData.name} se creó exitosamente`
    );

    return redirect("/dashboard/surveys", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    if (
      error.code &&
      error.code === "P2002" &&
      error.meta?.target === "Survey_name_key"
    ) {
      return json(
        {
          errors: {
            name: "Ya existe una encuesta con ese nombre",
          },
        },
        { status: 400 }
      );
    }
    console.error(error);
    return json(
      {
        errors: {
          unknown: "Ocurrío un error inesperado",
        },
      },
      { status: 400 }
    );
  }
};

type Question = {
  text: string;
  type: string;
};

type CustomField = {
  key: string;
  value: string;
};

const freshQuestion = {
  text: "",
  type: "",
};

export default function SurveysCreatePage() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { questionTypes, surveys } = useLoaderData<typeof loader>();
  const actionData = useActionData<{
    success?: any;
    errors?: {
      name?: string;
    };
  }>();
  const errors = actionData?.errors;
  const success = actionData?.success;

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const removeCustomField = () => {
    const newCustomFields = [...customFields];
    newCustomFields.splice(customFields.length - 1, 1);
    setCustomFields(newCustomFields);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, freshQuestion]);
  };

  const removeQuestion = () => {
    const newQuestions = [...questions];
    newQuestions.splice(questions.length - 1, 1);
    setQuestions(newQuestions);
  };

  return (
    <>
      <Toaster />
      <section className="bg-gray-50 dark:bg-gray-900 sm:p-5">
        <div className="mx-auto max-w-screen-xl lg:px-12">
          <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div className="flex flex-col items-center justify-between space-y-3 p-4">
              <div className="w-full">
                <h1 className="mb-4 border-b border-gray-200 pb-4 text-2xl font-bold text-gray-900 dark:border-gray-600 dark:text-white">
                  Crear encuesta
                </h1>
              </div>
              <div className="w-full">
                <Form method="post">
                  <div className="mb-4 flex flex-col justify-start gap-4 text-left">
                    <div className="w-full">
                      <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Titulo
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="Nombre o titulo de la encuesta"
                        required={true}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="subtitle"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Subtitulo
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        id="subtitle"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="Subtitulo de la encuesta"
                        required={false}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="Describe brevemente de que trata la encuesta"
                        required={false}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="instructions"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Instrucciones
                      </label>
                      <textarea
                        name="instructions"
                        id="instructions"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="Describe brevemente como se debe contestar la encuesta"
                        required={false}
                      />
                    </div>
                    <div className="w-full">
                      <h4 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Agrega campos personalizados
                      </h4>

                      <div className="flex w-full flex-col gap-4 py-4">
                        {customFields.map((_, index) => (
                          <div key={index} className="flex gap-4">
                            <div>
                              <label
                                htmlFor={`customFields[${index}][key]`}
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Nombre del campo
                              </label>
                              <input
                                type="text"
                                name={`customFields[${index}][key]`}
                                id={`customFields[${index}][key]`}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                placeholder="Nombre del campo personalizado"
                                required={true}
                              />
                            </div>
                            <div className="w-full">
                              <label
                                htmlFor={`customFields[${index}][value]`}
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Valor del campo
                              </label>
                              <input
                                type="text"
                                name={`customFields[${index}][value]`}
                                id={`customFields[${index}][value]`}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                placeholder="Valor del campo personalizado"
                                required={true}
                              />
                            </div>
                            {index === customFields.length - 1 && (
                              <div>
                                <label
                                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  &nbsp;
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeCustomField()}
                                  className="inline-flex items-center rounded-lg bg-red-500 p-2.5 text-sm text-white"
                                >
                                  <HiMinus className="h-6 w-6" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addCustomField()}
                        className="inline-flex items-center rounded-lg bg-transparent p-2.5 text-sm text-gray-400 hover:text-blue-500 dark:hover:text-white"
                      >
                        <svg
                          className="mr-1 -ml-1 h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H7a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span> Agregar campo personalizado </span>
                      </button>
                    </div>
                    <div className="w-full">
                      <h4 className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Agrega campos personalizados
                      </h4>

                      <div className="flex w-full flex-col gap-4 py-4">
                        {questions.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="w-full">
                              <label
                                htmlFor={`questions[${index}][text]`}
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Pregunta
                              </label>
                              <input
                                type="text"
                                name={`questions[${index}][text]`}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                placeholder="Type product name"
                                required={true}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`questions[${index}][type]`}
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Tipo
                              </label>
                              <select
                                id={`questions[${index}][type]`}
                                name={`questions[${index}][type]`}
                                required={true}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                              >
                                {questionTypes.map((questionType) => (
                                  <option
                                    key={questionType.id}
                                    value={questionType.id}
                                  >
                                    {questionType.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {index === questions.length - 1 && (
                              <div>
                                <label
                                  htmlFor={`questions[${index}][type]`}
                                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  &nbsp;
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeQuestion()}
                                  className="inline-flex items-center rounded-lg bg-red-500 p-2.5 text-sm text-white"
                                >
                                  <HiMinus className="h-6 w-6" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addNewQuestion()}
                        className="inline-flex items-center rounded-lg bg-transparent p-2.5 text-sm text-gray-400 hover:text-blue-500 dark:hover:text-white"
                      >
                        <svg
                          className="mr-1 -ml-1 h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {questions.length > 0 ? (
                          <span>Agregar otra pregunta</span>
                        ) : (
                          <span>Agregar pregunta</span>
                        )}
                      </button>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
