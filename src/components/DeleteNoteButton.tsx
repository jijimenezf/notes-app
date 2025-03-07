import { useState } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const DeleteNoteButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["noteListData"] });
    },
  });

  async function deleteNote() {
    try {
      const { data, status } = await axios.delete(
        `http://localhost:3000/notes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            //'Authorization': token, //For authentication
          },
        }
      );
      toast.success("Note successfully deleted", { id: "notification" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error deleting the note", {
          id: "notification",
        });
      }
    }
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="mt-6 flex items-center justify-center lg:justify-start">
      <button
        disabled={mutation.isPending}
        role="button"
        className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
        onClick={handleSubmit}
      >
        {mutation.isPending ? (
          <p aria-label="Deleting note">
            <FiLoader />
          </p>
        ) : (
          <p aria-label="Delete note">
            <RiDeleteBin6Line />
          </p>
        )}
      </button>
    </div>
  );
};

export default DeleteNoteButton;
