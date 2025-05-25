import React from "react";
import {
  FaArrowRight,
  FaBriefcase,
  FaLightbulb,
  FaMicrophone,
  FaRobot,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdSchool } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero section */}
      <section className="container mx-auto px-8 flex flex-col lg:flex-row gap-12 py-24">
        <div className="w-full lg:w-1/2 space-y-8">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Turn Your Voice notes into{" "}
            <span className="text-primary">Polished Text</span>, Instantly
          </h1>
          <p className="text-gray-500 text-xl -mt-4 leading-relaxed">
            ClarityVoice uses AI to transcribe, polish, and structure your
            spoken thoughts, so you can focus on your ideas, not the editing.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="btn-primary btn-icon text-xl !px-6 w-full sm:w-fit"
          >
            Use ClarityVoice Free Forever
            <FaArrowRight className="text-white text-sm ml-2" />
          </button>
        </div>
        <div className="rounded-lg border border-gray-200 w-full lg:w-1/2 bg-gray-50 shadow-md p-8 space-y-4">
          <div className="flex gap-3">
            <div className="rounded-full bg-red-500 w-3 h-3"></div>
            <div className="rounded-full bg-yellow-500 w-3 h-3"></div>
            <div className="rounded-full bg-green-500 w-3 h-3"></div>
          </div>
          <p className="bg-orange-100 rounded-lg p-4 text-sm italic text-gray-600">
            "Okay, that client call today... um, definitely need the, those
            sales figures handy, right? And, uh, Sarah's questions from her last
            email? Yeah, let's try to, like, quickly look over those before.
            Cool."
          </p>
          <FaArrowRight className="text-primary text-xl mx-auto" />
          <p className="border border-gray-200 rounded-lg p-4 bg-white text-sm font-medium">
            For today's client call: ensure the latest sales figures are ready
            and quickly review Sarah's questions from her last email beforehand.
          </p>
        </div>
      </section>

      <section className="py-16  px-8 bg-gray-50">
        <div className="container space-y-4 text-center mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Tired of "ums" and "ahs" in your transcripts?
          </h3>
          <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto">
            ClarityVoice automatically transforms messy voice notes into clear,
            professional text while preserving your unique voice and
            personality.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-8 py-16">
        <div className=" space-y-4 text-center mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold">
            How ClarityVoice Helps You
          </h3>
          <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto">
            Powerful features that transform how you capture and use your
            thoughts
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="rounded-lg border border-gray-200 p-6 text-center space-y-3 shadow-xs hover:shadow-sm">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mx-auto">
              <FaRobot className="text-primary text-2xl" />
            </div>
            <p className="font-semibold text-xl">AI-Powered Polishing</p>
            <p className="text-gray-500">
              Automatically refines raw audio into clear, readable text while
              keeping your unique voice and personality intact.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 text-center space-y-3 shadow-xs hover:shadow-sm">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mx-auto">
              <FaWandMagicSparkles className="text-primary text-2xl" />
            </div>
            <p className="font-semibold text-xl">Smart Structure Options</p>
            <p className="text-gray-500">
              One-click transformation into summaries, emails, bullet points,
              formal documents, and more.
            </p>
          </div>
          {/* <div className="rounded-lg border border-gray-200 p-6 text-center space-y-3 hover:shadow-sm">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mx-auto">
              <IoDocumentText className="text-primary text-2xl" />
            </div>
            <p className="font-semibold text-xl">Effortless Note Management</p>
            <p className="text-gray-500 text-lg">
              Easily view, edit, and organize all your voice-powered notes in
              one clean, intuitive interface.
            </p>
          </div> */}
        </div>
      </section>

      <section className="py-16   bg-gray-50">
        <div className="container p-8 space-y-4 text-center mx-auto">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">How It Works</h3>
            <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto">
              Three simple steps to transform your voice into polished text
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary mx-auto">
                <FaMicrophone className="text-white text-2xl" />
              </div>
              <p className="font-semibold text-xl">1. Record or Speak</p>
              <p className="text-gray-500">
                Capture your thoughts naturally through voice recording or live
                speech.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary mx-auto">
                <FaWandMagicSparkles className="text-white text-2xl" />
              </div>
              <p className="font-semibold text-xl">2. AI Magic</p>
              <p className="text-gray-500">
                Our AI transcribes, polishes, and structures your content
                automatically.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary mx-auto">
                <IoDocumentText className="text-white text-2xl" />
              </div>
              <p className="font-semibold text-xl">3. Use Your Clear Note</p>
              <p className="text-gray-500">
                Get perfectly formatted text ready for emails, documents, or
                sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container p-8 py-16 space-y-4 text-center mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold">Perfect for Everyone</h3>
        <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto">
          Whether you're a professional, student, or creative, ClarityVoice
          adapts to your needs
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="rounded-lg border border-gray-200 p-6 shadow-xs hover:shadow-sm">
            <div className="flex gap-4 items-center text-xl font-semibold">
              <FaBriefcase className="text-primary" />
              <p>For Proffesionals</p>
            </div>
            <p className="text-gray-500 text-start my-4">
              Capture meeting notes and draft emails instantly. Turn
              brainstorming sessions into actionable documents.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Meeting transcriptions</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Email drafts</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Project updates</p>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 shadow-xs hover:shadow-sm">
            <div className="flex gap-4 items-center text-xl font-semibold">
              <MdSchool className="text-primary text-2xl" />
              <p>For Students</p>
            </div>
            <p className="text-gray-500 text-start my-4">
              Organize lecture notes effortlessly. Transform study sessions into
              structured summaries.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Lecture notes</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Study summaries</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Research ideas</p>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 shadow-xs hover:shadow-sm">
            <div className="flex gap-4 items-center text-xl font-semibold">
              <FaLightbulb className="text-primary" />
              <p>For Creators</p>
            </div>
            <p className="text-gray-500 text-start my-4">
              Dictate ideas and get clean drafts. Turn inspiration into polished
              content instantly.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Content ideas</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Blog drafts</p>
              </li>
              <li className="flex gap-4 items-center">
                <IoMdCheckmark className="text-green-500" />
                <p className="text-gray-500 text-sm">Creative writing</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16  px-8 bg-gray-50">
        <div className="container space-y-4 text-center mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold">
            Ready to Transform Your Voice Notes?
          </h3>
          <p className="text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto">
            Join our growing community of users who have already discovered the
            power of AI-polished voice notes.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="btn-primary btn-icon text-xl !px-6 w-full sm:w-fit mx-auto my-6"
          >
            Sign Up and Transform Your Voice Notes Today
            <FaArrowRight className="text-white text-sm ml-2" />
          </button>
          <p className="text-gray-500 text-sm">
            Completely free for now • No credit card required
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
