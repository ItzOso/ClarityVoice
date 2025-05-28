import { FaFolderPlus } from "react-icons/fa";

function AddFolderButton({ setIsNewFolderModalOpen }) {
  return (
    <button
      onClick={() => setIsNewFolderModalOpen(true)}
      className="btn-primary btn-icon"
    >
      <FaFolderPlus />
    </button>
  );
}

export default AddFolderButton;
