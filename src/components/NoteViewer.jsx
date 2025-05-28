import {
  FaArrowRight,
  FaEnvelope,
  FaFolder,
  FaFolderOpen,
  FaRegCopy,
  FaRegTrashAlt,
  FaSave,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useNoteViewer } from "../contexts/NoteViewerProvider";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, functions } from "../firebase/firebaseConfig";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import SmartStructuresModal from "./SmartStructuresModal";
import { httpsCallable } from "firebase/functions";
import MoveNoteModal from "./folders/MoveNoteModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function NoteViewer() {
  const { currentNote, setCurrentNote } = useNoteViewer();
  const [isSaving, setIsSaving] = useState(false);

  const [isShowingCurrent, setIsShowingCurrent] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);

  const deleteModalRef = useRef(null); // Ref for the dropdown menu
  const deleteModalToggleRef = useRef(null); // Ref for the dots icon that toggles the menu

  // State to store the original note content when the modal opens or after a save
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  // State to track if the note has been modified
  const [isDirty, setIsDirty] = useState(false);

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const [smartStructureOpen, setSmartStructureOpen] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);

  const [moveNoteIsOpen, setMoveNoteIsOpen] = useState(false);

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

  const handleCopy = () => {
    const noteToCopy = isShowingCurrent
      ? currentNote?.content
      : currentNote?.original;
    navigator.clipboard.writeText(noteToCopy);
    setShowCopySuccess(true);
    setTimeout(() => {
      setShowCopySuccess(false);
    }, 2000);
  };

  const handleApplyStructure = async (option) => {
    setSmartStructureOpen(false);
    setIsStructuring(true);
    try {
      // structuring logic here
      const smartStructure = httpsCallable(functions, "smartStructure");
      const response = await smartStructure({
        content: currentNote.content || currentNote.original,
        chosenOption: option,
      });

      const structuredNote = response.data;
      const noteRef = doc(db, "notes", currentNote.id);

      await updateDoc(noteRef, {
        content: structuredNote,
        updatedAt: serverTimestamp(),
      });

      setCurrentNote((prev) => ({
        ...prev,
        content: structuredNote,
      }));

      setIsStructuring(false);
    } catch (error) {
      console.log("Error smart structuring content:", error);
      setIsStructuring(false);
    }
  };

  const handleRevertToPolished = async () => {
    try {
      if (currentNote.content.trim() === currentNote.polished.trim()) {
        return;
      }

      const noteRef = doc(db, "notes", currentNote.id);

      await updateDoc(noteRef, {
        content: currentNote.polished,
        updatedAt: serverTimestamp(),
      });

      setCurrentNote((prev) => ({
        ...prev,
        content: currentNote.polished,
      }));
    } catch (error) {
      console.log("Error reverting to polished:", error);
    }
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
        className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Untitled Note"
            value={currentNote?.title}
            onChange={handleTitleChange}
            className="w-full text-2xl font-bold outline-none"
          />
          <div>
            <button
              onClick={() => setMoveNoteIsOpen(true)}
              className="btn-primary"
            >
              <FaFolder />
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="w-full flex sm:block sm:w-fit">
            <button
              onClick={() => setIsShowingCurrent(true)}
              className={`text-sm w-1/2 sm:w-fit ${
                isShowingCurrent ? "btn-primary" : "btn-secondary"
              } mr-2`}
            >
              Current
            </button>
            <button
              onClick={() => setIsShowingCurrent(false)}
              className={`text-sm w-1/2 sm:w-fit ${
                isShowingCurrent ? "btn-secondary" : "btn-primary"
              }`}
            >
              Original
            </button>
          </div>
          <button
            title="Revert back to the original polished transcription"
            onClick={handleRevertToPolished}
            className="btn-secondary text-sm mt-2 sm:mt-0 w-full sm:w-fit"
          >
            Revert to Original Polished
          </button>
        </div>
        <div>
          {isStructuring ? (
            <div className="flex items-center justify-center w-full input h-[350px]">
              <div
                className="animate-spin inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <textarea
              name=""
              id=""
              value={
                isShowingCurrent ? currentNote?.content : currentNote?.original
              }
              onChange={handleContentChange}
              disabled={!isShowingCurrent}
              className={`resize-none w-full input h-[350px] !px-4 !py-3 disabled:bg-gray-100`}
            ></textarea>
          )}
        </div>
        <div className="flex justify-between items-center mb-0 flex-col gap-2  sm:flex-row sm:gap-0">
          <div className="flex gap-2 flex-col justify-center sm:flex-row w-full sm:w-fit">
            <div className="flex gap-2 justify-center">
              <button
                title="delete note"
                onClick={() => setDeleteModal(true)}
                ref={deleteModalToggleRef}
                aria-label="delete note"
                className="h-10 w-full sm:w-10 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FaRegTrashAlt />
              </button>
              <button
                title="copy to clipboard"
                onClick={handleCopy}
                aria-label="copy note"
                className="h-10 w-full sm:w-10 flex justify-center items-center border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                {showCopySuccess ? <IoMdCheckmark /> : <FaRegCopy />}
              </button>
            </div>
            <button
              title="smart structure note"
              disabled={isStructuring}
              onClick={() => setSmartStructureOpen(true)}
              className="btn-secondary btn-icon w-full sm:w-fit"
            >
              {isStructuring ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaWandMagicSparkles />
              )}
              Smart Structure
            </button>
          </div>
          <button
            disabled={!isDirty || isSaving}
            onClick={handleSaveNote}
            className="btn-primary btn-icon w-full sm:w-fit
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
          <ConfirmDeleteModal
            setView={setDeleteModal}
            handleDeleteFunction={handleDeleteNote}
          />
        )}

        {smartStructureOpen && (
          <SmartStructuresModal
            setView={setSmartStructureOpen}
            handleApplyStructure={handleApplyStructure}
          />
        )}
        <MoveNoteModal
          note={currentNote}
          isOpen={moveNoteIsOpen}
          setView={setMoveNoteIsOpen}
        />
      </div>
    </div>
  );
}

export default NoteViewer;
