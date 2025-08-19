// src/App.js
import { Routes, Route } from "react-router-dom"
import ClassCard from "./Pages/Home"
import Login from "./Pages/Login"
import BookingList from "./Pages/BookingList"
import BookingForm from "./components/BookingForm"
import ClassForm from "./components/classFrom"
import Register from "./Pages/Register"
import ProtectedRoute from "./Pages/ProtectedRoute"
import MyFitnessDashboard from "./Pages/MyFitnessDashboard"

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<ClassCard />} />
        <Route path="/create-class" element={<ClassForm />} />
        <Route path="/edit-class/:id" element={<ClassForm />} />
        <Route path="/book-class" element={<BookingForm />} />
        <Route path="/my-bookings" element={<BookingList />} />
        <Route path="/my-fitness-plans" element={<MyFitnessDashboard />} />
      </Route>
      
    </Routes>
  )
}

export default App
