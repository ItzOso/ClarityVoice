import React, { useEffect, useState } from "react";
import {
  FaChevronUp,
  FaFolder,
  FaFolderPlus,
  FaHome,
  FaInbox,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import VoiceRecorder from "../components/VoiceRecorder";
import NoteCard from "../components/NoteCard";
import NoteViewer from "../components/NoteViewer";
import { useNotes } from "../contexts/NotesProvider";
import { useNoteViewer } from "../contexts/NoteViewerProvider";
import FolderNav from "../components/folders/FolderNav";
import NewFolderModal from "../components/folders/NewFolderModal";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../contexts/AuthProvider";
import { fetchUserFolders } from "../firebase/folder";

function HomePage() {
  const [showRecorder, setShowRecorder] = useState(true);

  const { notes } = useNotes();
  const { currentNote } = useNoteViewer();
  const { currentUser } = useAuth();

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [notesToRender, setNotesToRender] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const results = await fetchUserFolders(currentUser.uid);
        setFolders(results);
      } catch (error) {
        console.log("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      setNotesToRender(
        notes.filter((note) => note.folderId === selectedFolder.id)
      );
    } else {
      setNotesToRender(notes);
    }
  }, [selectedFolder, notes]);

  const handleCreateFolder = async (folderName) => {
    try {
      const foldersRef = collection(db, "folders");
      const data = {
        uid: currentUser.uid,
        name: folderName,
        createdAt: serverTimestamp(),
      };
      const folderRef = await addDoc(foldersRef, data);
      setFolders((prev) => [...prev, { ...data, id: folderRef.id }]);
    } catch (error) {
      console.log("Error creating new folder:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      {showRecorder && <VoiceRecorder />}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        <button
          onClick={() => setShowRecorder(!showRecorder)}
          className="p-4 text-white bg-primary rounded-full cursor-pointer hover:opacity-90"
        >
          {showRecorder ? <FaChevronUp /> : <FaPlus />}
        </button>
      </div>
      <div className="mb-10 mt-5">
        <FolderNav
          createFolder={handleCreateFolder}
          folders={folders}
          setFolders={setFolders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notesToRender.length === 0 && (
          <p className="text-gray-500 text-lg">
            {`There are no notes in the ${selectedFolder?.name} folder.`}
          </p>
        )}
        {notesToRender.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      {currentNote && <NoteViewer />}
    </div>
  );
}

export default HomePage;
