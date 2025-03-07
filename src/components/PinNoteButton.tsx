import { useState } from "react";
import { BsPin } from "react-icons/bs";
import { BsPinFill } from "react-icons/bs";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Note = {
  title: string;
  content: string;
};

const PinNoteButton = ({
  id,
  is_pinned,
}: {
  id: string;
  is_pinned: boolean;
}) => {
  const [isOnTop, setIsOnTop] = useState(is_pinned);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: pinNote,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["noteListData"] });
    },
    /*onError: (error, variables, context) => {
    },
    onSettled: (data, error, variables, context) => {
    },*/
  });

  async function pinNote() {
    try {
      const { data, status } = await axios.patch(
        `http://localhost:3000/notes/${id}`,
        { is_pinned: isOnTop },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error) {}
  }

  return (
    <div className="mt-6 flex items-center justify-center lg:justify-start">
      <button
        role="button"
        className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
        onClick={() => {
          setIsOnTop(!isOnTop);
          mutation.mutate();
        }}
      >
        {isOnTop ? (
          <p aria-label="Unpin note">
            <BsPinFill />
          </p>
        ) : (
          <p aria-label="Pin note">
            <BsPin />
          </p>
        )}
      </button>
    </div>
  );
};

export default PinNoteButton;
