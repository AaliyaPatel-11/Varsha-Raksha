VarshaRaksha - Your Community's Monsoon Lifeline
Live Demo: https://aaliyapatel-11.github.io/Varsha-Raksha/

The Problem
Every monsoon, our communities in Indian cities face two floods: one of water, and another of misinformation. During local emergencies like flash floods, waterlogging, or power cuts, communication is chaotic. Critical alerts on WhatsApp are buried under a flood of unverified news, forwards, and panicked messages. People who need help have no efficient way to connect with neighbours who can offer it, and there is no single, trusted source of truth for the situation in your immediate vicinity.

Our Solution: VarshaRaksha
VarshaRaksha (meaning "Rain Protection") is a hyper-local, real-time web application designed to replace chaos with clarity during local emergencies. It acts as a digital bridge, connecting residents to verified information and to each other, empowering communities to become more resilient and self-sufficient.

Instead of a single, messy chat feed, VarshaRaksha structures communication into actionable insights and provides a single source of truth for your neighborhood.

Core Features
Our platform is packed with features designed for real-world usability during a crisis:

1. Real-Time, Geo-Tagged Community Feed
Post, View, and Filter: Users can create posts and tag them as an Alert (🚨), a Request (🙏), or an Offer (❤️).

Image & Location Sharing: Enhance posts by uploading images and attaching a precise location, either automatically (via GPS) or by typing an address.

"Today's Feed" Only: The main feed is always fresh, showing only posts from the current day to act as a daily briefing. Older posts are archived on the user's profile.

Timestamps: Every post is timestamped with the date and time.

2. Live Interactive Map
Visual Intelligence: A real-time map that displays all location-tagged community posts as interactive red pins.

Instant Insight: Users can click on any pin to see the details of the post, allowing them to visually assess the situation in their area or along a potential travel route.

3. Official Info Hub
Live Local Weather: An integrated weather card that shows real-time conditions for the user's current location.

AI-Powered News Feed: A "wow" feature that uses the Gemini API with Google Search grounding to fetch, summarize, and display the latest news articles about weather events in the local area (Hyderabad), complete with images, summaries, and direct links.

4. Full User & Post Management
Secure Authentication: Simple and secure user onboarding with Google Sign-In, authorized for the live domain.

Personal Profile Page: A dedicated page where users can view all their past posts.

Edit & Delete: Full control over their content, with the ability to edit the text of their posts or delete them entirely (which also removes the associated image from storage).

5. AI Safety Assistant ("Raksha Mitra")
Instant Help: A floating chatbot powered by the Gemini API.

Safety First: "Raksha Mitra" is trained to provide friendly, concise, and practical answers to questions about monsoon safety, first-aid, and emergency preparedness.

Tech Stack
Frontend: React.js (with Vite)

Backend & Database: Google Firebase (Firestore, Authentication, Storage)

Mapping: React-Leaflet with OpenStreetMap

Geolocation APIs:

Browser Geolocation API

OpenWeatherMap API (for live weather & geocoding)

Generative AI: Google Gemini API (for AI Chatbot and Live News Summaries)

Deployment: GitHub Pages

Team Members
Patel Aaliya Mubashira (Full-Stack Developer)

Narra Navya Sri (Front-End Developer)

Pagala Bhavadeep Reddy (Back-End Developer)

R Jithin Sai (Full-Stack Designer)

Getting Started Locally
Clone the repository:

git clone [https://github.com/your-github-username/Varsha-Raksha.git](https://github.com/your-github-username/Varsha-Raksha.git)
cd Varsha-Raksha

Install dependencies:

npm install

Set up environment variables:

Create a .env file in the root of the project.

Add your Firebase, OpenWeatherMap, and Gemini API keys:

VITE_API_KEY="your_firebase_api_key"
VITE_AUTH_DOMAIN="..."
VITE_PROJECT_ID="..."
VITE_STORAGE_BUCKET="..."
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."
VITE_OPENWEATHER_API_KEY="your_openweathermap_api_key"
VITE_GEMINI_API_KEY="your_gemini_api_key"

Run the development server:

npm run dev
