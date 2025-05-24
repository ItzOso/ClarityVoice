import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import { signout } from "./firebase/auth";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import { useAuth } from "./contexts/AuthProvider";
import { useNoteViewer } from "./contexts/NoteViewerProvider";

function App() {
  const { currentUser } = useAuth();
  const { setCurrentNote } = useNoteViewer();
  useEffect(() => {
    if (!currentUser) {
      setCurrentNote(null);
    }
  }, [currentUser, setCurrentNote]);
  return (
    <div className="">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SigninPage />
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
