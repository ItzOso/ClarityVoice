import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";

function Navbar() {
  const { currentUser, signout } = useAuth();
  return (
    <div className="h-[64px] px-6  sm:px-12 lg:px-28 flex justify-between items-center border-b border-gray-200">
      <Link
        to="/"
        className="flex justify-center items-center gap-2 text-xl sm:text-2xl"
      >
        <FaMicrophone className="text-primary " />
        <h2 className=" font-semibold text-center">ClarityVoice</h2>
      </Link>
      <div className="flex gap-2">
        {currentUser ? (
          <button onClick={signout} className="btn-secondary btn-icon">
            <PiSignOutBold />
            Sign out
          </button>
        ) : (
          <Link to="/signin" className="btn-primary btn-icon">
            <PiSignInBold />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
