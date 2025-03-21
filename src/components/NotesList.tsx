import AddNote from "./AddNote";
import DeleteNoteButton from "./DeleteNoteButton";
import PinNoteButton from "./PinNoteButton";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type Note = {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
};

const NotesList = () => {
  const { isLoading, error, data, status } = useQuery<Note[] | undefined>({
    queryKey: ["noteListData"],
    queryFn: fetchNotes,
    initialData: [],
  });

  async function fetchNotes() {
    try {
      const { data, status } = await axios.get<Note[]>(
        "http://localhost:3000/notes",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const sortedNotes = data
        .reverse()
        .filter((singleNote) => singleNote.is_pinned)
        .concat(data.filter((singleNote) => !singleNote.is_pinned));
      return sortedNotes;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("There was an error loading the data", {
          id: "notification",
        });
      }
    } finally {
      toast.dismiss();
    }
  }

  if (isLoading) {
    return toast.loading("Loading...", { id: "notification" });
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-4">
          <h2 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Notes
          </h2>
        </div>
        <div className="mt-6 flow-root">
          <AddNote />
        </div>

        <div className="mt-6 flow-root">
          <div className="space-y-4 py-6 md:py-8">
            {status === "success" && (
              <ul>
                {data.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-center justify-between py-4 border-4 border-gray-400 rounded-md my-5"
                  >
                    <div className="w-4 flex-1 pl-16">
                      <h3 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        {note.title}
                      </h3>
                      <p className="w-auto flex-1 text-base font-normal text-gray-500 dark:text-gray-400">
                        {note.content}
                      </p>
                    </div>
                    <div className="flex-1">
                      <PinNoteButton id={note.id} is_pinned={note.is_pinned} />
                      <DeleteNoteButton id={note.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotesList;
