import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { PiExportBold } from "react-icons/pi";
import { useNoteViewer } from "../contexts/NoteViewerProvider";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function NoteViewer() {
  const { currentNote, setCurrentNote } = useNoteViewer();
  const [isSaving, setIsSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const deleteModalRef = useRef(null); // Ref for the dropdown menu
  const deleteModalToggleRef = useRef(null); // Ref for the dots icon that toggles the menu

  // State to store the original note content when the modal opens or after a save
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  // State to track if the note has been modified
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const title = currentNote.title || ""; // Default to empty string if undefined
    const content = currentNote.content || ""; // Default to empty string if undefined
    setOriginalTitle(title);
    setOriginalContent(content);
    setIsDirty(false);
  }, []);

  // Effect to update the isDirty flag whenever the live currentNote changes
  useEffect(() => {
    if (currentNote) {
      const titleChanged = (currentNote.title.trim() || "") !== originalTitle;
      const contentChanged =
        (currentNote.content.trim() || "") !== originalContent;
      setIsDirty(titleChanged || contentChanged);
    }
  }, [
    currentNote?.title,
    currentNote?.content,
    originalTitle,
    originalContent,
    currentNote,
  ]);

  useEffect(() => {
    // Only add listener if menu is open
    if (!deleteModal) {
      return;
    }
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu AND outside the toggle button
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target) &&
        deleteModalToggleRef.current &&
        !deleteModalToggleRef.current.contains(event.target)
      ) {
        setDeleteModal(false); // Close the menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteModal]); // Re-run this effect if openMenu changes

  const handleTitleChange = (e) => {
    setCurrentNote((prevNote) => {
      return { ...prevNote, title: e.target.value };
    });
  };

  const handleContentChange = (e) => {
    setCurrentNote((prevNote) => {
      return { ...prevNote, content: e.target.value };
    });
  };

  const handleCloseModal = () => {
    handleSaveNote();
    setCurrentNote(null);
  };

  const handleDeleteNote = async () => {
    try {
      const noteRef = doc(db, "notes", currentNote.id);
      await deleteDoc(noteRef);
      setDeleteModal(false);
      handleCloseModal();
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    if (!isDirty) {
      return;
    }
    try {
      const noteRef = doc(db, "notes", currentNote.id);
      await updateDoc(noteRef, {
        title: currentNote.title,
        content: currentNote.content,
        updatedAt: serverTimestamp(),
      });
      setIsDirty(false);
      setOriginalContent(currentNote.content);
      setOriginalTitle(currentNote.title);
    } catch (error) {
      console.log("Error saving note:", error);
    }
    setIsSaving(false);
  };

  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="fixed w-full max-w-2xl left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-6 space-y-4"
      >
        <div>
          <input
            type="text"
            placeholder="Untitled Note"
            value={currentNote?.title}
            onChange={handleTitleChange}
            className="w-full text-2xl font-bold outline-none"
          />
        </div>
        <div>
          <textarea
            name=""
            id=""
            value={currentNote?.content}
            onChange={handleContentChange}
            className="resize-none w-full input h-[320px]"
          ></textarea>
        </div>
        <div className="flex justify-between items-center mb-0">
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteModal(true)}
              ref={deleteModalToggleRef}
              aria-label="delete note"
              className="h-10 w-10 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaRegTrashAlt />
            </button>
            <button
              aria-label="export note"
              className="h-10 w-10 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <PiExportBold />
            </button>
            <button className="btn-secondary btn-icon">
              <FaWandMagicSparkles />
              Smart Structure
            </button>
          </div>
          <button
            disabled={!isDirty || isSaving}
            onClick={handleSaveNote}
            className="btn-primary btn-icon
            "
          >
            {isSaving ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaSave />
            )}
            Save Note
          </button>
        </div>

        {deleteModal && (
          <div
            ref={deleteModalRef}
            className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <p className="font-semibold mb-4 text-center">
              Are you sure you want to delete this note?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="btn-secondary"
              >
                No, Cancel
              </button>
              <button onClick={handleDeleteNote} className="btn-primary">
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteViewer;
