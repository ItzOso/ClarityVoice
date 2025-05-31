# ClarityVoice 🗣️📝✨

ClarityVoice is an intelligent voice-first productivity app that transforms your spoken thoughts into polished, structured, and actionable text. Record voice notes effortlessly, and let AI automatically transcribe, refine the content while preserving your unique style, and then reformat it into various useful structures like summaries, emails, bullet points, and more.

🔗 [Live App](https://clarityvoice-4a575.web.app/)
---

## 🚀 Features

- 🔐 Firebase Authentication (e.g., Google Sign-In, Email/Password)
- 🎙️ In-browser voice recording and high-accuracy transcription.
- 🧠 **AI-Powered Polishing:** Automatically cleans raw transcriptions (removes filler words, ums/ahs, false starts) while carefully preserving the speaker's personality and nuances.
- ✨ **Smart Structure Options:** One-click transformation of notes into:
    - Concise Summaries
    - Bullet Points
    - Draft Emails
    - Formally Toned Documents
    - Casual & Clear Text
    - Blog Post Drafts
    - Action items list
- ➕ **Append to Notes:** Add new voice recordings to existing notes seamlessly.
- 🗂️ **Folder System:** Organize your notes into folders.
- ✏️ View, Create, Edit, and Delete notes with a user-friendly interface.
- 📱 Fully responsive design for use on various devices.

---

## 🧰 Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router, React Icons
- **Backend/Services:** Firebase (Authentication, Firestore, Cloud Functions, Hosting)
- **AI Integration:** GPT-3.5Turbo using OpenAI API + SDK accessed securely through Firebase Cloud Functions for:
    - Transcription
    - Text Polishing
    - Smart Structuring

---

## ⚙️ Getting Started

To run ClarityVoice locally:

```bash
# Clone the repository
git clone https://github.com/ItzOso/ClarityVoice.git
cd ClarityVoice

# Install frontend dependencies
npm install

# Navigate to functions directory and install backend dependencies
cd functions
npm install
cd ..

# Start the frontend development server (and typically Firebase emulators if configured)
npm run dev
```

# 🔑 Environment Variables
Create a `.env` file in the root directory and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_key  # Only if used on client side
```

Create a `.env` file in root/functions directory and add your OpenAI key:

```env
OPENAI_API_KEY=your_key_here
```

## 🚀 Deploying Firebase Functions

To deploy the Firebase Functions (backend API), follow these steps:

```bash
# Install Firebase CLI (if not installed already):
npm install -g firebase-tools

# Login to firebase
firebase login

# Navigate to your project directory(should be root/functions):
cd your_project_dir

# Deploy the functions
firebase deploy --only functions
```

# 📝 Notes
This project time exploring audio-related functionalities. It successfully accomplished what I first envisioned: to transcribe audio, polish spoken thoughts, and structure notes for different use cases.

Key learnings from this project include audio functionalities within the app, such as using MediaDevices and MediaRecorder, transferring audio data to the backend, and then implementing deeper features like appending to notes and adding a folder system, which enhanced the app's structure and data management. This was a genuinely valuable learning experience and a fun project to build overall.

Some of the most challenging aspects were initially figuring out how to record audio and determining the best way to send it to the transcription API. However, I overcame these hurdles, gaining significant knowledge and delivering a finished application :)

# 📌 Future Improvement Ideas
- Subscription model
- Custom smart structures(let users create their own structures/ prompts)
- Export options(google docs, pdf, etc)
