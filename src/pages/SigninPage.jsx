import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthProvider";
import { BiHide, BiShow } from "react-icons/bi";

function SigninPage() {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signin, signinWithGoogle } = useAuth();

  let schema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter an email"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Please enter a password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const signinErrorMessages = {
    "auth/invalid-email":
      "The email address you entered is not valid. Please check the format (e.g., user@example.com).",
    "auth/user-disabled":
      "This account has been disabled. Please contact support for assistance.",
    // Often grouped into 'auth/invalid-credential' in newer SDKs
    "auth/user-not-found":
      "No account found with this email address. Please check your email or sign up.",
    // Often grouped into 'auth/invalid-credential' in newer SDKs
    "auth/wrong-password": "Incorrect password. Please try again.",
    // More common in Firebase v9+ to prevent email enumeration
    "auth/invalid-credential":
      "Invalid email or password. Please check your credentials and try again.",
    "auth/too-many-requests":
      "Access to this account has been temporarily disabled due to too many failed login attempts. You can try again later, or reset your password.",
    "auth/network-request-failed":
      "A network error occurred. Please check your internet connection and try again.",
    "auth/operation-not-allowed":
      "Signing in with email and password is not currently enabled. Please contact support if this issue persists.",
    // Generic fallback message
    "auth/unknown":
      "An unexpected error occurred while trying to sign in. Please try again later or contact support.",
  };

  const googleSignInPopupErrorMessages = {
    "auth/popup-closed-by-user":
      "You closed the Google Sign-In window before completing the process. Please try again if you'd like to sign in with Google.",
    "auth/popup-blocked":
      "Your browser blocked the Google Sign-In popup. Please check your browser settings to allow popups for this site and try again.",
    "auth/cancelled-popup-request":
      "The sign-in attempt was cancelled because another sign-in window was opened. Please try signing in again.",
    "auth/operation-not-allowed":
      "Signing in with Google is not currently enabled for this application. Please contact support if this issue persists.",
    "auth/unauthorized-domain":
      "This website domain is not authorized for Google Sign-In with this application. Please contact support.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email address, but it was created with a different sign-in method (like email/password). Please sign in using the method you originally used, or contact support if you need to link your Google account.",
    "auth/network-request-failed":
      "A network error occurred. Please check your internet connection and try signing in again.",
    "auth/internal-error":
      "An unexpected error occurred on the server while trying to sign you in with Google. Please try again in a few moments.",
    "auth/user-disabled":
      "This user account has been disabled. Please contact support for assistance.",
    "auth/invalid-credential":
      "The Google authentication credential was invalid or has expired. Please try signing in with Google again.",
    "auth/oauth-credential-already-in-use":
      "This Google account is already linked to a different user profile in our system. If you have another account with us, please sign out and sign in with that account to link Google, or contact support.",
    // Generic fallback message
    "auth/unknown":
      "An unexpected error occurred while trying to sign in with Google. Please try again later or contact support.",
  };

  const handleSignin = async (data) => {
    setSubmitting(true);
    try {
      await signin(data.email, data.password);
    } catch (error) {
      const friendlyErrorMessage =
        signinErrorMessages[error.code] || signinErrorMessages["auth/unknown"];
      setError(friendlyErrorMessage);
    }
    setSubmitting(false);
  };

  const handleSigninWithGoogle = async () => {
    setSubmitting(true);
    try {
      await signinWithGoogle();
    } catch (error) {
      const friendlyErrorMessage =
        googleSignInPopupErrorMessages[error.code] ||
        googleSignInPopupErrorMessages["auth/unknown"];
      setError(friendlyErrorMessage);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="flex justify-center items-center gap-2 mb-2">
        <FaMicrophone className="text-primary text-3xl" />
        <h2 className="text-3xl font-semibold text-center">ClarityVoice</h2>
      </div>
      <p className="mb-4 text-center text-gray-500 w-[90%] mx-auto">
        Sign in to start transforming your spoken thoughts into structured text
      </p>

      <form
        onSubmit={handleSubmit(handleSignin)}
        className="flex flex-col p-6 rounded-lg border border-gray-200 gap-6 bg-white"
      >
        {error && (
          <p className="border border-red-300 bg-red-200 text-red-400 p-4 rounded-xl">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="input"
            id="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400">{errors.email?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="input w-full"
              placeholder="Enter a password"
              {...register("password")}
            />
            {!showPass ? (
              <BiShow
                onClick={() => setShowPass(true)}
                className="absolute right-4 top-3 text-text-light text-lg cursor-pointer text-gray-500"
              />
            ) : (
              <BiHide
                onClick={() => setShowPass(false)}
                className="absolute right-4 top-3 text-text-light text-lg cursor-pointer text-gray-500"
              />
            )}
          </div>
          {errors.password && (
            <p className="text-red-400">{errors.password?.message}</p>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-2">
          <hr className="text-gray-200" />
          <p className="-mt-3 text-text bg-white px-3 w-fit mx-auto text-sm text-gray-500">
            Or
          </p>
        </div>
        <button
          onClick={handleSigninWithGoogle}
          disabled={submitting}
          className="btn-secondary btn-icon justify-center"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="25px"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span className="text-text">Sign in with Google</span>
        </button>
        <p className="text-center text-gray-500">
          Dont have an account yet?{" "}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SigninPage;
