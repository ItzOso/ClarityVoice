import React, { useEffect, useState } from "react";
import { fetchUserFolders } from "../../firebase/folder";
import { useAuth } from "../../contexts/AuthProvider";
import { FaFolder } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNoteViewer } from "../../contexts/NoteViewerProvider";

function MoveNoteModal({ note, isOpen, setView }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(note.folderId || "");
  const [isFetchingFolders, setIsFetchingFolders] = useState(false);
  const { currentUser } = useAuth();
  const { setCurrentNote } = useNoteViewer();
  useEffect(() => {
    const fetchFolders = async () => {
      setIsFetchingFolders(true);
      try {
        const results = await fetchUserFolders(currentUser.uid);
        setFolders(results);
        setIsFetchingFolders(false);
      } catch (error) {
        console.log("Error fetching folders:", error);
      }
    };

    if (isOpen) {
      fetchFolders();
      setSelectedFolder(note.folderId || "");
    }
  }, [isOpen, currentUser, note]);

  const handleClickSelection = (folderId) => {
    if (selectedFolder === folderId) {
      setSelectedFolder("");
    } else {
      setSelectedFolder(folderId);
    }
  };

  const handleMoveNote = async () => {
    try {
      const noteRef = doc(db, "notes", note.id);
      if (note.folderId !== selectedFolder) {
        await updateDoc(noteRef, {
          folderId: selectedFolder,
        });

        setCurrentNote((prev) => ({ ...prev, folderId: selectedFolder }));
        setView(false);
      } else {
        setView(false);
      }
    } catch (error) {
      console.log("Error moving note to folder:", error);
    }
  };

  if (!isOpen) {
    return "";
  }

  return (
    <div
      onClick={() => {
        handleMoveNote();
        setView(false);
      }} // This will close the modal
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 card shadow-sm max-w-[80%] sm:max-w-md w-full flex flex-col gap-2 h-[320px]"
      >
        <p>Move Note To:</p>
        <div className="space-y-1 h-full overflow-y-auto">
          {isFetchingFolders && (
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
              <div
                className="animate-spin inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {folders.length === 0 && !isFetchingFolders && (
            <p className="text-gray-500 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
              You currenly have no folders.
            </p>
          )}
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleClickSelection(folder.id)}
              className={`btn-secondary btn-icon !justify-start text-sm sm:text-base ${
                selectedFolder === folder.id && "bg-gray-100"
              }`}
            >
              <FaFolder />
              <p className="line-clamp-1">{folder.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-2 flex-col-reverse sm:flex-row">
          <button
            onClick={() => setView(false)}
            className="btn-secondary w-full sm:w-fit text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleMoveNote}
            disabled={folders.length === 0 && !isFetchingFolders}
            className="btn-primary w-full sm:w-fit text-sm sm:text-base"
          >
            Move Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoveNoteModal;
