<div align="center">

# 🏥 SehatLink (ਸਿਹਤ ਲਿੰਕ)
### *Offline Telemedicine & AI Health Assistant for Rural India*

**Smart India Hackathon Prototype • Rural Region, Punjab**

---

</div>

## 🌟 What is SehatLink?

In many rural villages across India, getting medical care is a major challenge:
- Families often have to travel **15–20 kilometers** to reach a hospital just for basic check-ups.
- Internet connectivity in farms and interior villages is **unreliable or unavailable**.
- Elderly villagers and low-literacy citizens struggle to type symptoms on smartphone keyboards.
- Families spend unnecessary money on expensive branded medicines because they don't know about affordable government **Jan Aushadhi** generic medicines.

**SehatLink** is an offline-first telemedicine platform designed specifically for rural healthcare. It connects village citizens, local ASHA health workers, remote doctors, and generic medicine pharmacies into one simple, trustworthy healthcare network.

---

## 🎨 Designed for Rural Trust (No Sci-Fi Jargon)

Unlike cold corporate tech apps with neon blue gradients and complex menus, SehatLink uses a **warm, vintage healthcare design**:
- **Classic Paper & Clinic Look**: Warm parchment colors, wooden card borders, serif headings, and official stamp badges ("ਸਿਹਤ ਸਹਾਇਕ • 2026").
- **Familiar & Respectful Tone**: Speaks warmly like a trusted village doctor or family physician.
- **Easy for Everyone**: Big visual buttons, high contrast, and voice interaction so anyone can use it without prior technical knowledge.

---

## ✨ Key Features (How It Helps Villagers & Doctors)

### 🗣️ 1. Speak Your Symptoms (Punjabi, Hindi & English)
- Patients don't need to type! Simply tap the microphone and speak naturally in **Punjabi (ਪੰਜਾਬੀ)**, **Hindi (हिंदी)**, or **English**.
- SehatLink automatically understands the health concern (e.g. *"I have high fever and chest tightness"*) and assigns a priority level (**Red Emergency**, **Yellow High**, or **Green Routine**).

### 🤖 2. "Sehat Sahayak AI" Assistant
- A friendly virtual health guide that answers questions about symptoms, diet (like warm fluids, Bajra roti, or ORS), and medicine instructions.
- **Voice Read-Aloud**: Can read answers out loud in Punjabi or Hindi for elderly or illiterate patients.
- **Hands-Free Dictation**: Patients can speak their questions instead of typing.
- **Safety First**: Never gives illegal prescriptions—always guides patients to consult a certified doctor.

### 📶 3. Works 100% Offline (No Internet Needed)
- ASHA health workers visiting door-to-door in fields can record patient vitals (**Oxygen SpO₂, Blood Pressure, Heart Rate, Temperature, Sugar, Weight**) even when there is **zero mobile network**.
- Everything is saved safely on the phone. As soon as the health worker enters an area with internet signal, all records **automatically sync** to the hospital server.

### 💊 4. Jan Aushadhi Generic Medicine Finder
- Helps villagers find low-cost, high-quality generic medicines available at government Jan Aushadhi Kendras.
- Displays generic equivalents (e.g., *Sorbitrate 5mg → Isosorbide Dinitrate 5mg*) saving families up to 80% on medicine bills.
- Shows live stock availability on an interactive map.

### 🚑 5. One-Touch Emergency SOS Dispatch
- In critical situations (severe chest pain, snake bites, stroke), pressing the red **Emergency SOS** button instantly shares the exact village GPS coordinates with **108 Ambulance Units** and alerts the nearest hospital.
- Provides immediate, easy-to-follow first-aid steps on screen while the ambulance is on its way.

### 💳 6. Digital QR Health Card (ABHA Linked)
- Generates a personal digital Health Identity Card with a QR code containing the patient's medical history, past prescriptions, and vaccination records.

---

## 👥 5 Simple Role Portals

| Role | What They Can Do |
| :--- | :--- |
| **👩‍🌾 Patient Portal** | Speak symptoms, book remote doctor consultations, view prescriptions, and open their QR Health Card. |
| **🩺 ASHA Health Worker** | Perform door-to-door village health checks, record clinical vitals, attach photos/voice notes, and sync offline data. |
| **👨‍⚕️ Remote Doctor** | View incoming patient cases sorted by priority, start video/audio calls, write digital e-prescriptions, and refer urgent cases to Civil Hospital. |
| **💊 Pharmacy Store** | Manage generic medicine stock, view reservation requests, and help patients find affordable medicine alternatives. |
| **📊 District Admin** | View an interactive map showing disease trends across Rural villages (like fever or Dengue outbreaks) to dispatch medical aid quickly. |

---

## ⏱️ How to Try the Demo (In 1 Minute)

### Step 1: Open the Application
Open `http://localhost:3000` in your web browser.

### Step 2: Use One-Click Demo Credentials
On the Login screen, click **"🚀 Enter as Dummy Patient"** or use these test details:

- **Email**: `dummy@gmail.com`
- **Password**: `user12345`

You can explore all features—speak symptoms, open the QR card, chat with the AI assistant, or switch to the Doctor and ASHA worker portals!

---

## 🛠️ How to Run the Project (For Evaluators)

### Supabase configuration

The frontend uses the Supabase publishable key only for public directory reads. Clerk
remains the authentication provider, while the FastAPI backend uses the Supabase
secret key for authenticated profile and AI chat history persistence.

1. Run [backend/supabase_schema.sql](./backend/supabase_schema.sql) in the Supabase SQL editor.
2. Copy `backend/.env.example` to `backend/.env` and set `SUPABASE_URL`,
   `SUPABASE_SECRET_KEY`, `GROQ_API_KEY`, and a random `SECRET_KEY`.
3. Copy `frontend/.env.example` to `frontend/.env.local` and set
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
   `VITE_CLERK_PUBLISHABLE_KEY`, and `VITE_API_BASE_URL`.
4. Never put `SUPABASE_SECRET_KEY` or any other server credential in a
   `VITE_*` variable.

### 1. Run the Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate  # (Optional)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Production deployment

The frontend and backend are deployed as separate services:

- **Vercel:** set the project Root Directory to `frontend`, Framework Preset to
  `Vite`, Build Command to `npm run build`, and Output Directory to `dist`.
  Set `VITE_API_BASE_URL` to the public Render API URL without a trailing slash,
  plus the frontend Supabase and Clerk publishable variables shown in
  [frontend/.env.example](./frontend/.env.example).
- **Render:** set the service Root Directory to `backend`, Build Command to
  `pip install -r requirements.txt`, and Start Command to
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set the backend variables
  in [backend/.env.example](./backend/.env.example), including
  `CORS_ORIGINS=https://your-vercel-domain.vercel.app`.
- Configure Supabase by running [backend/supabase_schema.sql](./backend/supabase_schema.sql)
  once in the Supabase SQL editor. Keep the backend secret key and Groq key in
  Render only; only the Supabase publishable key belongs in Vercel.

---

<div align="center">
  <sub>SehatLink — Empowering Rural Healthcare Access in Rural Region, Punjab.</sub>
</div>