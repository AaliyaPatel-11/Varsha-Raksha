# VarshaRaksha 🌧️  
**Your Community's Monsoon Lifeline**  

**Live Demo:** [https://aaliyapatel-11.github.io/Varsha-Raksha/](https://aaliyapatel-11.github.io/Varsha-Raksha/)

---

## 🌀 The Problem

Every monsoon, our communities in Indian cities face two floods: one of water, and another of misinformation.  

During local emergencies like flash floods, waterlogging, or power cuts, communication becomes chaotic.  
Critical alerts on WhatsApp are buried under a flood of unverified news, forwards, and panicked messages.  

People who need help have no efficient way to connect with neighbours who can offer it — and there’s no single, trusted source of truth for the situation in your immediate vicinity.

---

## 🌈 Our Solution: VarshaRaksha

**VarshaRaksha (meaning “Rain Protection”)** is a hyper-local, real-time web application designed to replace chaos with clarity during local emergencies.  

It acts as a **digital bridge**, connecting residents to verified information and to each other — empowering communities to become more resilient and self-sufficient.

Instead of a single messy chat feed, VarshaRaksha structures communication into actionable insights and provides a single source of truth for your neighborhood.

---

## ⚙️ Core Features

### 1. Real-Time, Geo-Tagged Community Feed
- **Post, View, and Filter:** Users can create posts and tag them as an Alert (🚨), a Request (🙏), or an Offer (❤️).  
- **Image & Location Sharing:** Upload images and attach precise locations automatically via GPS or by typing an address.  
- **“Today’s Feed” Only:** Always shows posts from the current day, acting as a daily briefing. Older posts move to the user’s profile.  
- **Timestamps:** Every post includes date and time for instant context.

---

### 2. Live Interactive Map
- **Visual Intelligence:** Real-time map displays all location-tagged posts as interactive red pins.  
- **Instant Insight:** Click any pin to view post details and assess the situation in your area or along a travel route.

---

### 3. Official Info Hub
- **Live Local Weather:** Integrated weather card showing real-time conditions based on the user’s location.  
- **AI-Powered News Feed:** Uses the Gemini API with Google Search grounding to fetch, summarize, and display the latest local weather news — complete with images, summaries, and direct links.

---

### 4. Full User & Post Management
- **Secure Authentication:** Google Sign-In for safe and simple onboarding.  
- **Personal Profile Page:** View all your past posts in one place.  
- **Edit & Delete:** Users can edit text or delete posts (and associated images) anytime.

---

### 5. AI Safety Assistant ("Raksha Mitra")
- **Instant Help:** A floating chatbot powered by the Gemini API.  
- **Safety First:** Raksha Mitra provides concise, practical advice about monsoon safety, first-aid, and emergency preparedness.

---

## 🧠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js (Vite) |
| **Backend & Database** | Google Firebase (Firestore, Authentication, Storage) |
| **Mapping** | React-Leaflet + OpenStreetMap |
| **Geolocation APIs** | Browser Geolocation API, OpenWeatherMap API |
| **Generative AI** | Google Gemini API |
| **Deployment** | GitHub Pages |

---

## 👥 Team Members
- **Patel Aaliya Mubashira** – Full-Stack Developer  
- **Narra Navya Sri** – Front-End Developer  
- **Pagala Bhavadeep Reddy** – Back-End Developer  
- **R Jithin Sai** – Full-Stack Designer  

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/aaliyapatel-11/Varsha-Raksha.git
cd Varsha-Raksha
```
### 2. Install dependencies:
```bash
npm install
```
### 3. Set up environment variables:
->Create a .env file in the root of the project.
->Add your Firebase, OpenWeatherMap, and Gemini API keys:
```bash
VITE_API_KEY="your_firebase_api_key"
VITE_AUTH_DOMAIN="..."
VITE_PROJECT_ID="..."
VITE_STORAGE_BUCKET="..."
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."
VITE_OPENWEATHER_API_KEY="your_openweathermap_api_key"
VITE_GEMINI_API_KEY="your_gemini_api_key"
```
### 4. Run the development server:
```bash
npm run dev

```
