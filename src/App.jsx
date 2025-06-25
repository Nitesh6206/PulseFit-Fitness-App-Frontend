// src/App.js
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ClassCard from './components/ClassCard';
import Login from './components/Login';
import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import ClassForm from './components/classFrom';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';


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
      </Route >
    </Routes >
  );
};

export default App;