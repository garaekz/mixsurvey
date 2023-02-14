import { toast } from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { BsInfoLg } from "react-icons/bs";
import { GoFlame } from "react-icons/go";

export default function ToastComponent({ message, type }: { message: string, type: "success" | "error" | "warning" | "info" | "default" }) {
  let settings = {
    icon : <FaCheck />,
    colors: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
  };

  switch (type) {
    case "success":
      settings = {
        icon : <FaCheck />,
        colors: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
      };
      break;
    case "error":
      settings = {
        icon : <FaTimes />,
        colors: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200"
      };
      break;
    case "warning":
      settings = {
        icon : <IoWarning />,
        colors: "text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200"
      };
      break;
    case "info":
      settings = {
        icon : <BsInfoLg />,
        colors: "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200"
      };
      break;
    case "default":
      settings = {
        icon : <GoFlame />,
        colors: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-200"
      };
      break;
  }

  return (
    <div
      className="mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 shadow text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      role="alert"
    >
      <div className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${settings.colors}`}>
        {settings.icon}
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{ message }</div>
      <button
        type="button"
        onClick={() => toast.remove()}
        className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-white"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
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
      </button>
    </div>
  );
}
