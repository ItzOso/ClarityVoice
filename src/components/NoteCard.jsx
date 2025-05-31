import { useEffect, useRef, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { PiCalendarBlankBold } from "react-icons/pi";
import { useNoteViewer } from "../contexts/NoteViewerProvider";
import { doc } from "firebase/firestore";

function NoteCard({ note }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown menu
  const menuToggleRef = useRef(null); // Ref for the dots icon that toggles the menu

  const { setCurrentNote } = useNoteViewer();

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Loading...";
    const date = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  useEffect(() => {
    // Only add listener if menu is open
    if (!openMenu) {
      return;
    }
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu AND outside the toggle button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(event.target)
      ) {
        setOpenMenu(false); // Close the menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]); // Re-run this effect if openMenu changes

  const handleOpenNote = () => {
    setCurrentNote(note);
  };

  return (
    <div className="rounded-lg border border-gray-200 p-6 space-y-2 h-fit">
      <div className="flex items-center justify-between relative">
        <h3 className="font-semibold text-2xl line-clamp-1">{note.title}</h3>
        {/* <div
          ref={menuToggleRef}
          onClick={() => setOpenMenu(!openMenu)}
          className="text-lg cursor-pointer p-2 rounded-lg hover:bg-gray-100"
        >
          <HiDotsVertical />
        </div>
        {openMenu && (
          <div
            ref={menuRef}
            id="menu"
            className="absolute w-[8rem] shadow-md right-0 top-9 flex flex-col text-sm bg-white rounded-lg p-1 border border-gray-200"
          >
            <button
              onClick={handleOpenNote}
              className="cursor-pointer hover:bg-gray-100 rounded-md text-left p-2"
            >
              View
            </button>
            <button
              onClick={handleDeleteNote}
              className="cursor-pointer hover:bg-gray-100 rounded-md text-left p-2"
            >
              Delete
            </button>
          </div>
        )} */}
      </div>
      <div className="text-gray-500  flex items-center gap-2">
        <PiCalendarBlankBold />
        <p className="text-sm font-semibold">
          {`${formatTimestamp(note.updatedAt)}`}
        </p>
      </div>
      <p className="line-clamp-2 text-gray-500">{note.content}</p>
      <button onClick={handleOpenNote} className="btn-secondary w-full">
        View Note
      </button>
    </div>
  );
}

export default NoteCard;
