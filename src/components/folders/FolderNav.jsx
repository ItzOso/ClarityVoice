import React, { useState } from "react";
import { FaFolder, FaFolderPlus, FaHome } from "react-icons/fa";
import AddFolderButton from "./AddFolderButton";
import NewFolderModal from "./NewFolderModal";
import FolderItem from "./FolderItem";

function FolderNav({
  createFolder,
  folders,
  selectedFolder,
  setSelectedFolder,
}) {
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setSelectedFolder(null)}
        className={`btn-secondary btn-icon ${
          !selectedFolder && "bg-gray-100 !cusror-default"
        }`}
      >
        <FaHome />
        All Notes
      </button>

      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      ))}

      <AddFolderButton setIsNewFolderModalOpen={setIsNewFolderModalOpen} />
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        setView={setIsNewFolderModalOpen}
        createFolder={createFolder}
      />
    </div>
  );
}

export default FolderNav;
