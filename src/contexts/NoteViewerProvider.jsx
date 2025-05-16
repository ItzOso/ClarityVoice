import { createContext, useContext, useState } from "react";

export const NoteViewerContext = createContext();

export const useNoteViewer = () => {
  return useContext(NoteViewerContext);
};

export const NoteViewerProvider = ({ children }) => {
  const [currentNote, setCurrentNote] = useState(null);

  const value = {
    currentNote,
    setCurrentNote,
  };

  return (
    <NoteViewerContext.Provider value={value}>
      {children}
    </NoteViewerContext.Provider>
  );
};
