import React, { useEffect, useState } from "react";

function TextInputModal({
  isOpen,
  setView,
  onSubmit,
  inputLabel = "Name",
  initialValue = "",
  submitButtonText = "Submit",
  inputPlaceholder = "",
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    } else {
      setInputValue("");
    }
  }, [isOpen, initialValue]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim()) {
      await onSubmit(inputValue.trim());
      setInputValue("");
      setView(false);
    } else {
      console.log("Must input a value");
    }
  };

  if (!isOpen) {
    return "";
  }
  return (
    <div
      onClick={() => setView(false)}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="card space-y-4 w-full max-w-md"
        onSubmit={handleOnSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="modelTextInput">{inputLabel}</label>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            id="modelTextInput"
            className="input"
            placeholder={inputPlaceholder}
          />
        </div>
        <div className="flex gap-2 justify-center flex-col-reverse sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setView(false);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            disabled={!inputValue.trim()}
            type="submit"
            className="btn-primary"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TextInputModal;
