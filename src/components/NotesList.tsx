import { useState } from "react";
import AddNote from "./AddNote";
import DeleteNoteButton from './DeleteNoteButton';
import PinNoteButton from './PinNoteButton';
import axios from "axios";
import toast from "react-hot-toast";
import {  useQuery } from '@tanstack/react-query'

type Note = {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
};

const NotesList = () => {
  const [noteList, setNoteList] = useState<Note[]>([]);
  const { isLoading, error, data } = useQuery({
    queryKey: ['noteListData'],
    queryFn: fetchNotes,
  });

  async function fetchNotes() {
    toast.loading('Loading...', { id: 'notification' });
    try {
      const {data, status} = await axios.get<Note[]>(
        "http://localhost:3000/notes",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const sortedNotes = data.reverse().filter((singleNote) => singleNote.is_pinned).concat(data.filter((singleNote) => !singleNote.is_pinned));
      
      setNoteList(sortedNotes);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error loading the data", { id: 'notification' });
      }
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div>
      <h1>Notes</h1>
      <AddNote />
      <div>
        <ul>
          {noteList.length > 0 && noteList.map((note) => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <PinNoteButton id={note.id} is_pinned={note.is_pinned} />
              <DeleteNoteButton id={note.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotesList;
