# Party Camera + Baby Feud 🎉

An interactive web app for **gender reveal parties / baby showers** that combines a  
📸 **Cloudinary-powered camera & gallery** with a 🎮 **Baby Feud game**.

---

## 📸 Party Camera

Guests can snap pictures directly in the app or upload from their phone gallery.  
All photos are automatically saved to **Cloudinary** and also downloaded to the guest’s device for backup.

### Features
- Take photos with the **in-app camera** (supports front/back switching).
- Open the **native phone camera** (iOS/Android).
- Upload photos from phone **gallery/files**.
- Save photos locally as a fallback if upload fails.
- Upload multiple photos at once.
- Parallel uploads for faster performance.
- Progress indicator for uploads.
- View all uploaded photos in the **Gallery** page.

---

## 🎮 Baby Feud Game

A **Family Feud–style game** customized for baby showers and gender reveal parties.  
The game is played on a **TV/projector** while the host controls the answers from their own device.

### How It Works
- All questions and answers live in `src/data/babyFeudData.js`.
- The **TV/guest view** shows only questions and blank slots.
- The **host view** reveals the answers and lets the host flip them one by one.
- Both views stay in sync using a **seed** (random number in the URL).

### Game Modes

#### 👨‍👩‍👧 Player Mode (TV / Guests)
Shows the question and hidden answers.  
👉 URL format:
```
/baby-feud?seed=1234
```
Example:  
`http://localhost:5173/baby-feud?seed=1234`

#### 🎤 Host Mode (Phone / Laptop)
Shows the same order **with answers visible**.  
👉 URL format:
```
/baby-feud?host=true&seed=1234
```
Example:  
`http://localhost:5173/baby-feud?host=true&seed=1234`

### Important Notes
- The **seed value** ensures both host & TV stay in sync.
- Refreshing won’t break the game as long as the seed stays the same.
- To start a new game → just pick a new seed.

---

## 🛠 Setup & Development

1. **Clone the repo**  
   ```bash
   git clone https://github.com/arpit10/PartyCamera.git
   cd PartyCamera
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Add environment variables** → create a `.env` file in the root:  
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run locally**  
   ```bash
   npm run dev
   ```
   App will be available at:  
   `http://localhost:5173`

5. **Deploy on Netlify** → just push to your GitHub repo and link with Netlify.  
   Netlify will automatically use your `.env` variables.

---

## 📂 Project Structure

```
src/
  components/      # Camera, Gallery, Inputs, etc.
  pages/           # BabyFeud.jsx
  data/            # babyFeudData.js (questions & answers)
  App.jsx          # Main camera app
  index.jsx        # Router setup

netlify/functions/ # Serverless functions (upload, gallery)
```

---

## 🎉 Have Fun!
- Guests use `/` (camera & upload).  
- Everyone can see photos in `/gallery`.  
- Host runs `/baby-feud?host=true&seed=XXXX` while TV shows `/baby-feud?seed=XXXX`.

Enjoy capturing memories 📸 and playing Baby Feud 🎮 at your party!
