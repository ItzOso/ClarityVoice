import { useEffect, useRef, useState } from "react";
import {
  FaBlog,
  FaCompressArrowsAlt,
  FaEnvelope,
  FaListUl,
  FaSmile,
  FaTasks,
  FaUserTie,
} from "react-icons/fa";

function SmartStructuresModal({ setSmartStructureOpen, handleApplyStructure }) {
  const [selected, setSelected] = useState("");

  const modalRef = useRef(null);

  const structureOptionsData = [
    {
      id: "structure-summarize",
      value: "summarize",
      label: "Summarize",
      description:
        "Condenses your note into a brief summary, extracting the most important ideas.",
      IconComponent: FaCompressArrowsAlt, // Or PiArticle
    },
    {
      id: "structure-bullet-points",
      value: "bullet_points",
      label: "Bullet Points",
      description:
        "Transforms your note into a structured bullet point list. Perfect for action items.",
      IconComponent: FaListUl,
    },
    {
      id: "structure-email-draft",
      value: "email_draft",
      label: "Email Draft",
      description:
        "Reformats your note into a draft email, suggesting a subject and body structure.",
      IconComponent: FaEnvelope, // Or PiEnvelopeSimpleOpen
    },
    {
      id: "structure-formal-tone",
      value: "formal_tone",
      label: "Formal Tone",
      description:
        "Rewrites your note in a more professional, formal, and precise language.",
      IconComponent: FaUserTie, // Or PiUserTie
    },
    {
      id: "structure-casual-clear",
      value: "casual_clear",
      label: "Casual & Clear",
      description:
        "Converts your note into simpler, easy-to-understand sentences with a friendly style.",
      IconComponent: FaSmile, // Or PiChatCircleText
    },
    {
      id: "structure_block_post_draft",
      value: "blog_post_draft",
      label: "Blog Post",
      description:
        "Outlines your note into a blog post structure, suggests title, intro, body, and conclusion to get you started quickly.",
      IconComponent: FaBlog,
    },
    {
      id: "structure_action_items",
      value: "action_items",
      label: "Action Items",
      description:
        "Scans your note for clear actionable to do items or tasks, presented in a concise list.",
      IconComponent: FaTasks,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the modal content
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSmartStructureOpen(false); // Call the onClose prop to close the modal
      }
    };

    // Add event listener when the modal is opened
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: remove event listener when the modal is closed or component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 p-6 border w-[70%] max-w-lg border-gray-200 rounded-lg bg-white shadow-sm"
    >
      <fieldset className="flex flex-col gap-2 h-96 overflow-auto">
        <legend className="text-lg mb-4">Choose Your Style:</legend>
        {structureOptionsData.map((option) => {
          return (
            <div
              onClick={() => setSelected(option.value)}
              key={option.id}
              className={`border p-2 rounded-lg cursor-pointer ${
                selected === option.value
                  ? "border-primary bg-primary/10"
                  : "border-gray-200"
              }`}
            >
              <input
                onChange={() => setSelected(option.value)}
                type="radio"
                id={option.id}
                name="smart_structure" // All radio buttons in this group share the same name
                value={option.value}
                checked={selected === option.value}
                className="sr-only"
              />
              <label
                htmlFor={option.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={`rounded-lg p-3 border  text-gray-500 text-lg ${
                    selected === option.value
                      ? "border-primary text-primary bg-primary/10"
                      : "border-gray-200"
                  }`}
                >
                  <option.IconComponent />
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      selected === option.value && "text-primary"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            </div>
          );
        })}
      </fieldset>
      <div className="mt-4">
        <button
          onClick={() => setSmartStructureOpen(false)}
          className="btn-secondary mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() => handleApplyStructure(selected)}
          className="btn-primary"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default SmartStructuresModal;
