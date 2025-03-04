import { useState } from "react";
import axios from "axios";

type Status = {
  type: "success" | "error";
  message: string;
};

type Note = {
  title: string;
  content: string;
};

type GetNoteResponse = {
  data: Note[];
};

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<Status>({
    type: "error",
    message: "",
  });
  const [isPending, setIsPending] = useState(false);

  async function submitNote() {
    setIsPending(true);
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
      
      if (status === 200) {
        setResult({ type: "success", message: "Note successfully added" });
        setTitle("");
        setContent("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResult({
          type: "error",
          message: "There was an error adding the note",
        });
      } else {
        setResult({
          type: "error",
          message: error as string,
        });
      }
    }
    setIsPending(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitNote();
  }

  return (
    <>
      {result && <div role="status">{result.message}</div>}
      {isPending && <p>Loading ...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <input
            type="textArea"
            name="content"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <button disabled={isPending} type="submit">
            {isPending ? 'Adding note' : 'Add note'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddNote;
