import { useState } from "react";
import { BsPin } from "react-icons/bs";
import { BsPinFill } from "react-icons/bs";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Note = {
  title: string;
  content: string;
};

const PinNoteButton = ({ id, is_pinned, }: { id: string; is_pinned: boolean; }) => {
  const [isOnTop, setIsOnTop] = useState(is_pinned);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: pinNote,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['noteListData'] });
    },
    /*onError: (error, variables, context) => {
    },
    onSettled: (data, error, variables, context) => {
    },*/
  })

  async function pinNote() {
    try {
      const {data, status} = await axios.patch(
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
    <button role="button" onClick={() => {
      setIsOnTop(!isOnTop);
      mutation.mutate();
    }}>
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
  );
};

export default PinNoteButton;
