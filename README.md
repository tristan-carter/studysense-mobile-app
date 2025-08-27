# StudySense

**StudySense** is a student-focused productivity app designed to help learners analyse, optimise, and improve their study habits.  
Built from the ground up as a comprehensive **study companion**, it combines **smart flashcards, analytics, and modern iOS integration** to make studying more efficient and engaging.

---

## ✨ Features

### 📚 Smart Flashcards
- **Spaced Repetition & Adaptive Quizzing**: maximises retention and recall.  
- **Custom Flashcards**: students can easily create and organise their own sets.  
- **InstaSets Library**: prebuilt flashcard sets tailored to specific exam boards, generated automatically by scraping freely available teacher content (via a custom scraping algorithm).  

### 📊 Study Analytics
- Custom study timers and tracking.  
- Detailed analytics on revision patterns and efficiency.  
- Actionable insights into when and how much to revise.  

### 📱 iOS Native Features
- **Apple Live Activities**: real-time study session progress directly on the lock screen.  
- Full **offline functionality**: study anywhere without internet; data syncs seamlessly with Firebase when online again.  

---

## 🛠️ Technical Overview

- **Language/Frameworks:** Swift (iOS), Firebase (backend).  
- **Architecture:** Offline-first design with background sync to cloud storage.  
- **Algorithms:** Spaced repetition scheduling, adaptive quizzing, automatic flashcard generation from scraped resources.  
- **Frontend:** SwiftUI with native iOS APIs (Live Activities).  
- **Backend:** Firebase Realtime Database & Authentication for multi-device data sync.  
