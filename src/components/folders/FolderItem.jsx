import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaFolder, FaFolderOpen } from "react-icons/fa";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../contexts/AuthProvider";
import TextInputModal from "../TextInputModal";

function FolderItem({ folder, setFolders, selectedFolder, setSelectedFolder }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const openMenuButtonRef = useRef(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!showMenu) {
      return; // Don't do anything if the menu is not showing
    }

    const handleClickOutside = (event) => {
      // If the click is outside the menu AND outside the ellipsis button, then close the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        openMenuButtonRef.current &&
        !openMenuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    // Add event listener when the menu is shown
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function: Remove event listener when the menu is hidden or component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDeleteFolder = async () => {
    try {
      const q = query(
        collection(db, "notes"),
        where("folderId", "==", folder.id),
        where("uid", "==", currentUser.uid)
      );

      const querySnapshots = await getDocs(q);

      querySnapshots.docs.forEach(async (note) => {
        await updateDoc(note.ref, {
          folderId: "",
        });
      });

      const folderRef = doc(db, "folders", folder.id);

      await deleteDoc(folderRef);

      setFolders((prev) =>
        prev.filter((prevFolder) => prevFolder.id !== folder.id)
      );

      setSelectedFolder(null);

      setShowConfirmDelete(false);
    } catch (error) {
      console.log("Error deleting folder:", error);
    }
  };

  const handleRenameFolder = async (newName) => {
    try {
      const folderRef = doc(db, "folders", folder.id);

      await updateDoc(folderRef, {
        name: newName,
      });

      setFolders((prev) =>
        prev.map((prevFolder) =>
          prevFolder.id === folder.id
            ? { ...prevFolder, name: newName }
            : prevFolder
        )
      );
    } catch (error) {
      Console.log("Error renaming folder:", error);
    }
  };

  return (
    <div
      onClick={() => setSelectedFolder(folder)}
      className={`btn-secondary btn-icon group relative ${
        selectedFolder?.id === folder?.id && "bg-gray-100 !cursor-default "
      }`}
    >
      <button
        className={`btn-icon flex-grow line-clamp-1 cursor-pointer ${
          selectedFolder?.id === folder?.id && "!cursor-default "
        }`}
      >
        {selectedFolder?.id === folder?.id ? <FaFolderOpen /> : <FaFolder />}
        {folder.name}
      </button>
      <button
        ref={openMenuButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prevShowMenu) => !prevShowMenu);
        }}
        className={`text-sm ${
          selectedFolder?.id === folder.id
            ? "opacity-100" // Visible if selected
            : "opacity-0 pointer-events-none md:group-hover:opacity-100 md:focus:opacity-100" // Hidden and non-interactive on mobile if not selected, hover/focus on desktop
        } transition-opacity cursor-pointer`}
      >
        <FaEllipsisV />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute card !p-2 shadow-sm space-y-1 top-12 right-0 z-50"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenameModalOpen(true);
            }}
            className="btn-secondary !py-1 text-sm w-full"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmDelete(true);
            }}
            className="btn-secondary !py-1 text-sm w-full"
          >
            Delete
          </button>
        </div>
      )}
      {showConfirmDelete && (
        <ConfirmDeleteModal
          deleteMessage={"Are you sure, you want to delete this folder?"}
          secondaryMessage={
            "Note: All notes will still be available in *All Notes*"
          }
          handleDeleteFunction={handleDeleteFolder}
          setView={setShowConfirmDelete}
        />
      )}
      <TextInputModal
        isOpen={isRenameModalOpen}
        setView={setIsRenameModalOpen}
        onSubmit={handleRenameFolder}
        inputLabel="Update Folder Name"
        submitButtonText="Rename Folder"
        inputPlaceholder="Enter a folder name"
        initialValue={folder.name}
      />
    </div>
  );
}

export default FolderItem;
