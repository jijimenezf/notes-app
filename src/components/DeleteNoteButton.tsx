import { useState } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

type Status = {
  type: "success" | "error";
  message: string;
};

const DeleteNoteButton = ({ id }: { id: number }) => {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<Status>({
    type: "error",
    message: "",
  });

  async function deleteNote() {
    setIsPending(true);
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
      setResult({ type: "success", message: "Note successfully deleted" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResult({
          type: "error",
          message: "There was an error deleting the note",
        });
      }
    }
    setIsPending(false);
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    deleteNote();
  }

  return (
    <>
      {result && <div role="status">{result.message}</div>}
      {isPending && <p>Loading ...</p>}
      <button disabled={isPending} role="button" onClick={handleSubmit}>
        {isPending ? (
          <p>
            <FiLoader />
            Deleting note
          </p>
        ) : (
          <p>
            <RiDeleteBin6Line />
            Delete note
          </p>
        )}
      </button>
    </>
  );
};

export default DeleteNoteButton;
