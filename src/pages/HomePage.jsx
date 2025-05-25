import React, { useState } from "react";
import { FaChevronUp, FaMinus, FaPlus } from "react-icons/fa";
import VoiceRecorder from "../components/VoiceRecorder";
import NoteCard from "../components/NoteCard";
import NoteViewer from "../components/NoteViewer";
import { useNotes } from "../contexts/NotesProvider";
import { useNoteViewer } from "../contexts/NoteViewerProvider";

function HomePage() {
  const [showRecorder, setShowRecorder] = useState(true);

  const { notes } = useNotes();
  const { currentNote } = useNoteViewer();

  return (
    <div className="container mx-auto p-8">
      {showRecorder && <VoiceRecorder />}
      <div className="flex justify-between my-10">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        <button
          onClick={() => setShowRecorder(!showRecorder)}
          className="p-4 text-white bg-primary rounded-full cursor-pointer hover:opacity-90"
        >
          {showRecorder ? <FaChevronUp /> : <FaPlus />}
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      {currentNote && <NoteViewer />}
    </div>
  );
}

export default HomePage;
