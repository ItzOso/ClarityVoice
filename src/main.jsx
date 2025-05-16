import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { NoteViewerProvider } from "./contexts/NoteViewerProvider.jsx";
import NotesProvider from "./contexts/NotesProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotesProvider>
        <NoteViewerProvider>
          <App />
        </NoteViewerProvider>
      </NotesProvider>
    </AuthProvider>
  </StrictMode>
);
