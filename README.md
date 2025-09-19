# React + Vite
# Digital Disposable Camera 📸

A reusable, component-based web app that allows users to take multiple photos and upload them toCloudinary. Optimized for events like parties and gatherings, this app ensures your photos are backed up even if upload fails.

## Features

- Take photos with live camera or upload from gallery to cloudinary
- Take multiple photos before uploading
- Download images to local device when images are clicked.
- Parallel upload for faster performance
- Automatic saving to device in case upload fails
- Upload progress indicator
- Component-based React structure for easy reuse
- see gallery to check all the photos uploaded to cloudinary.

## Setup

1. Clone the repository:
git clone https://github.com/arpit10/PartyCamera.git
cd digitalDisposableCamera 
2. Install dependencies:  npm install
3. Create a .env file in the root:
VITE_UPLOAD_URL=http://localhost:3000/upload  APPSCRIPT_SECRET=your-secret
4. Run the local Proxy Server:
node server.js
5. Start the React app:
npm run dev
6. Open in your browser:
http://localhost:5173





# Baby Feud 🎉

A fun **Family Feud–style game** customized for a baby shower / gender reveal party.  
This project lets you play the game on a TV for guests, while the host can control and reveal answers from their own device.

---

## 🚀 How It Works

- Questions and answers are preloaded into the app (`babyFeudData.js`).
- The game is shown on the **TV screen** in **normal mode** (questions visible, answers hidden).
- The **host device** (phone/laptop) can open the game in **host mode** to see the answers and reveal them at the right time.
- Both views stay in sync by using the same **random seed** in the URL.

---

## 🎮 Game Modes

### Normal Mode (TV / Players)
Shows only the question and blank answer slots.  
👉 URL format:
/baby-feud?seed=1234

Example:
http://localhost:5173/baby-feud?seed=1234

---

### Host Mode (Phone / Laptop)
Shows the same question order, but with answers visible to the host for reference.  
👉 URL format:
/baby-feud?host=true&seed=1234

Example:
http://localhost:5173/baby-feud?host=true&seed=1234

---

## 🔑 Important Notes
- The `seed` value ensures both **TV** and **Host** see the questions in the same order.  
- Use **the same seed number** in both URLs (e.g., `1234`).  
- Refreshing will keep the order consistent.  
- Changing the seed creates a **new game order**.

---

## 🆕 Starting a New Game
1. Pick a new random seed (any number, e.g., `5678`).
2. Update both URLs with the new seed:
   - TV: `/baby-feud?seed=5678`
   - Host: `/baby-feud?host=true&seed=5678`

This way, you don’t need to edit code to reset the questions.

---

## 🛠 Development
- Built with **React + React Router**.
- Data lives in `src/data/babyFeudData.js`.
- Shuffle order is controlled by a seeded shuffle function for consistent ordering across devices.

---

🎉 Have fun hosting your **Baby Feud** game!
