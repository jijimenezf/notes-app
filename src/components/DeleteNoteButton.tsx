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
      queryClient.invalidateQueries({ queryKey: ['noteListData'] });
    },
  })


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
      toast.success('Note successfully deleted', { id: 'notification' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error deleting the note", { id: 'notification' });
      }
    }
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <>
      <button disabled={mutation.isPending} role="button" onClick={handleSubmit}>
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
    </>
  );
};

export default DeleteNoteButton;
