
# 🏋️‍♂️ Fitness Booking Frontend

A responsive frontend application for fitness class bookings, built with React, integrated with a backend API, and styled using modern UI libraries.

---

## 🚀 Tech Stack

- **React** (with functional components and hooks)  
- **React Router** for client-side routing  
- **Axios** for API integration  
- **CSS Modules** / **Styled Components** for component-level styling  


---

## 🔍 Features

- 🧭 **Class Listing**: Browse upcoming fitness sessions.  
- 📅 **Booking Flow**: Book a slot via a user-friendly form.  
- 🧑‍💻 **Authentication**: Login/logout to personalize experience.  
- 🔐 Session handling with tokens (bearer JWT).  
- 📲 **Responsive Design**: Works smoothly on mobile and desktop.  
- ⚙️ **Routing**: SPA navigation across Home, Classes, Booking, Profile, etc.

---

## 📁 Project Structure

```
fitness-booking-frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── apiClient.js
│   ├── components/
│   │   ├── ClassCard/
│   │   ├── BookingForm/
│   │   └── Header, Footer, etc.
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Classes.js
│   │   ├── Booking.js
│   │   ├── Profile.js
│   │   └── Login.js, Signup.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       └── global.css or similar
├── package.json
└── README.md
```

---

## 📦 Getting Started

### Prerequisites

- Node.js >= 14  
- npm or Yarn  

### Setup & Run

1. Clone the repo:  
   ```bash
   git clone https://github.com/Nitesh6206/fitness-booking-frontend.git
   cd fitness-booking-frontend
   ```

2. Install dependencies:  
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure API endpoint:  
   In `.env` or `api/apiClient.js`, set your backend base URL:  
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. Start dev server:  
   ```bash
   npm start
   # or
   yarn start
   ```

5. (Optional) Run tests:  
   ```bash
   npm test
   # or
   yarn test
   ```

---

## 🎯 Usage Guide

- **Home Page**: View featured fitness classes.  
- **Classes**: Browse by type, difficulty, or schedule.  
- **Booking**: Select class and date, then submit booking form.  
- **Profile**: View or cancel upcoming bookings.  
- **Login/Signup**: Secure access with authentication.

---

## 📐 Configuration

You can customize these via `.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_LOGGING=true
REACT_APP_MAPS_API_KEY=your-api-key
```

---

## 📚 Extend & Contribute

- ✅ Feature suggestions: user reviews, instructor profiles, waitlists  
- 🧪 Add unit/integration tests  
- 🌐 Support internationalization (i18n)  
- Performance optimizations, lazy loading, caching

---

## 👨‍💻 Author

**Nitesh Kumar**  
[GitHub](https://github.com/Nitesh6206)  

---

## 📜 License

MIT License. See [LICENSE](LICENSE) file.

---

*Built with ❤️ and React.*
