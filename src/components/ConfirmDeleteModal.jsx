import React from "react";

function ConfirmDeleteModal({
  deleteMessage,
  secondaryMessage,
  setView,
  handleDeleteFunction,
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setView(false);
      }} // This will close the modal
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 w-[80%] sm:max-w-md sm:w-fit border border-gray-200 rounded-lg bg-white shadow-sm"
      >
        <div className="mb-4">
          <p className="font-semibold text-center">{deleteMessage}</p>
          {secondaryMessage && (
            <p className="text-gray-500 text-sm text-center">
              {secondaryMessage}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 flex-col-reverse sm:flex-row">
          <button
            onClick={() => setView(false)}
            className="btn-secondary w-full sm:w-fit text-sm sm:text-base"
          >
            No, Cancel
          </button>
          <button
            onClick={handleDeleteFunction}
            className="btn-primary w-full sm:w-fit text-sm sm:text-base"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
