import type { QuestionType } from "@prisma/client";

export default function CreateQuestionComponent({
  index,
  questionTypes,
}: {
  questionTypes: QuestionType[];
  index: number;
}) {
  return (
    <>
      <div className="flex gap-2">
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
              <option key={questionType.id} value={questionType.id}>
                {questionType.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
