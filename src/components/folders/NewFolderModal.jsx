import React, { useState } from "react";

function NewFolderModal({ isOpen, setView, createFolder }) {
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async (e) => {
    e.preventDefault();

    if (folderName.trim()) {
      await createFolder(folderName.trim());
      setFolderName("");
      setView(false);
    } else {
      console.log("Must input a folder name");
    }
  };

  if (!isOpen) {
    return "";
  }
  return (
    <div
      onClick={() => {
        setFolderName("");
        setView(false);
      }}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="card space-y-4 w-full max-w-md"
        onSubmit={handleCreateFolder}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="newFolder">New Folder Name</label>
          <input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            type="text"
            id="newFolder"
            className="input"
            placeholder="Enter a folder name"
          />
        </div>
        <div className="flex gap-2 justify-center flex-col-reverse sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setFolderName("");
              setView(false);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            disabled={!folderName.trim()}
            type="submit"
            className="btn-primary"
          >
            Create Folder
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewFolderModal;
