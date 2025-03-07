import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Note = {
  title: string;
  content: string;
};

/*const configOptions: ToastOptions = {
  duration: 4000,
  position: "top-center",
  style: {},
  className: "",
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  iconTheme: {
    primary: "#000",
    secondary: "#fff",
  },
};*/

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitNote,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["noteListData"] });
    },
  });

  async function submitNote() {
    try {
      const { data, status } = await axios.post<Note>(
        "http://localhost:3000/notes",
        { title, content },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setTitle("");
      setContent("");
      toast.success("Note successfully added", { id: "notification" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error adding the note", {
          id: "notification",
        });
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 flex items-center justify-center lg:justify-start">
          <input
            aria-label="Title"
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 ps-9 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder="Title"
          />
        </div>
        <div className="mt-6 flex items-center justify-center lg:justify-start">
          <textarea
            aria-label="Content"
            rows={6}
            cols={25}
            name="content"
            id="content"
            value={content}
            placeholder="Take a note..."
            onChange={(e) => setContent(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 ps-9 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          />
        </div>
        <div className="mt-6 flex items-center justify-center lg:justify-start">
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
          >
            {mutation.isPending ? "Adding note" : "Add note"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddNote;
