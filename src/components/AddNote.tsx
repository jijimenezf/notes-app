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
      queryClient.invalidateQueries({ queryKey: ['noteListData'] });
    },
  })

  async function submitNote() {
    try {
      const {data, status} = await axios.post<Note>(
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
      toast.success('Note successfully added', { id: 'notification' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error adding the note", { id: 'notification' });
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
        <div>
          <input
            aria-label="Title"
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            aria-label="Content"
            rows={6}
            cols={25}
            name="content"
            id="content"
            value={content}
            placeholder="Take a note..."
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Adding note" : "Add note"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddNote;
