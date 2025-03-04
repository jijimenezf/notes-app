import NotesList from "./components/NotesList";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <div><Toaster gutter={1} /></div>
      <QueryClientProvider client={queryClient}>
        <NotesList />
      </QueryClientProvider>
    </>
  );
}
