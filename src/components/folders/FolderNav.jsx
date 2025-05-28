import React, { useState } from "react";
import { FaFolder, FaFolderPlus, FaHome } from "react-icons/fa";
import AddFolderButton from "./AddFolderButton";
import FolderItem from "./FolderItem";
import TextInputModal from "../TextInputModal";

function FolderNav({
  createFolder,
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
}) {
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setSelectedFolder(null)}
        className={`btn-secondary btn-icon ${
          !selectedFolder && "bg-gray-100 hover:!bg-gray-200 !cusror-default"
        }`}
      >
        <FaHome />
        All Notes
      </button>

      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          setFolders={setFolders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      ))}

      <AddFolderButton setIsNewFolderModalOpen={setIsNewFolderModalOpen} />
      <TextInputModal
        isOpen={isNewFolderModalOpen}
        setView={setIsNewFolderModalOpen}
        onSubmit={createFolder}
        inputLabel="New Folder Name"
        submitButtonText="Create Folder"
        inputPlaceholder="Enter a folder name"
      />
    </div>
  );
}

export default FolderNav;
