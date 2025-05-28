import React from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

function FolderItem({ folder, selectedFolder, setSelectedFolder }) {
  return (
    <button
      onClick={() => setSelectedFolder(folder)}
      className={`btn-secondary btn-icon ${
        selectedFolder?.id === folder?.id && "bg-gray-100 !cursor-default "
      }`}
    >
      {selectedFolder?.id === folder?.id ? <FaFolderOpen /> : <FaFolder />}
      {folder.name}
    </button>
  );
}

export default FolderItem;
