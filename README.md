👨‍💻 Interview Coder
Master Your Technical Interviews. A full-stack, real-time technical interview platform featuring HD video calls, a collaborative code editor, and secure end-to-end encryption.

🚀 Features
🎥 HD Video & Audio: Crystal clear calls powered by GetStream.io.

💻 Collaborative Code Editor: Real-time syntax highlighting for JavaScript and Python using Monaco Editor.

⚡ Live Synchronization: See what the other person types instantly (with debouncing optimization).

▶️ Code Compiler: Run code directly in the browser via the Piston API.

🔒 End-to-End Encryption: Optional AES encryption ensures code is unreadable without a shared secret key.

🖥️ Screen Sharing: Built-in screen sharing for architecture diagrams or debugging.

💾 Auto-Save History: Interviews are saved to MongoDB for later review.

🗣️ Text-to-Speech: Accessibility feature to read code aloud using the Web Speech API.

🔐 Secure Authentication: Seamless login and user management via Clerk.

🔄 Event-Driven Architecture: Robust user synchronization between Clerk and Database using Inngest.

🛠️ Tech Stack
Frontend
Framework: React.js (Vite)

Styling: Tailwind CSS

Icons: Lucide React

Editor: Monaco Editor

Encryption: CryptoJS

Backend (Serverless)
Runtime: Node.js (Express on Vercel Functions)

Database: MongoDB Atlas (Mongoose)

Events: Inngest (Webhooks & Background Jobs)

Services
Auth: Clerk


📂 Project Structure

interview-coder/
├── api/                # Vercel Serverless Functions (Backend)
│   ├── index.js        # Express API Entry point
│   ├── inngest.js      # Inngest Event Handler
│   └── token.js        # Stream Token Generator
├── backend/
│   └── src/
│       ├── controllers/ # Logic for saving interviews
│       ├── lib/         # DB connection & Stream client
│       ├── models/      # Mongoose Schemas (User, Interview)
│       └── routes/      # Express Routes
├── frontend/
│   └── src/
│       ├── components/  # StreamProvider & UI Components
│       ├── pages/       # Home & MeetingRoom
│       └── api/         # Compiler API logic
└── vercel.json         # Vercel Routing Configuration


⚡ Getting Started
1. Clone the Repository

git clone https://github.com/your-username/interview-coder.git
cd interview-coder

2. Install Dependencies
This project uses a monorepo-style structure. You need to install dependencies in the Root and the Frontend.

Root (Backend):
npm install

Frontend:
npm install --prefix frontend

3. Environment Variables

# --- Backend Secrets ---
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=sk_test_...
STREAM_API_SECRET=your_stream_secret
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key

# --- Shared Configuration ---
CLIENT_URL=http://localhost:5173  # Change to your Vercel URL in production
STREAM_API_KEY=your_stream_public_key

# --- Frontend (Vite) Secrets ---
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=your_stream_public_key
VITE_CLIENT_URL=http://localhost:5173 # Change to your Vercel URL in production

4. Run Locally
Start the Frontend:
npm run dev --prefix frontend

Start the Backend:
node backend/src/server.js
(Note: For local development of Inngest and Webhooks, use the Inngest Dev Server).


🚀 Deployment
This project is optimized for Vercel.

Push code to GitHub.

Import project into Vercel.

Override Build Settings:

Build Command: cd frontend && npm install && npm run build

Output Directory: frontend/dist

Install Command: npm install

Add Environment Variables in Vercel Dashboard.

Deploy!

🤝 Contributing
Contributions are welcome!

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ by Jyoti Dev

Video/Audio: Stream Video SDK

Compiler: Piston API
