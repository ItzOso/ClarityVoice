import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";

function Navbar() {
  const { currentUser, signout } = useAuth();
  return (
    <div className="h-[64px] px-12 flex justify-between items-center border-b border-gray-200">
      <Link to="/" className="flex justify-center items-center gap-2">
        <FaMicrophone className="text-primary text-2xl" />
        <h2 className="text-2xl font-semibold text-center">ClarityVoice</h2>
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
