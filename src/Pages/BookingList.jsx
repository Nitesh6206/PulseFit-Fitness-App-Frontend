"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../redux/axiosConfig"
import { useNavigate } from "react-router-dom"
import { Calendar, User, Trash2, ArrowLeft, BookOpen, Clock, Mail } from "lucide-react"

const BookingList = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchBookingsDetails = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axiosInstance.get("/bookings/")
      setBookings(response.data)
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookingsDetails()
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return
    try {
      await axiosInstance.delete("/bookings/", {
        data: { id: bookingId },
      })
      fetchBookingsDetails()
    } catch (error) {
      console.error("Failed to cancel booking")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your fitness class reservations</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't booked any classes yet. Browse our available classes and reserve your spot today.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Browse Classes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="bg-gray-900 text-white p-6 rounded-t-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold">{booking.fitness_class_details?.class_type || "N/A"}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Booking #{booking.id}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Instructor</p>
                        <p className="font-semibold text-gray-900">
                          {booking.fitness_class_details?.instructor || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Time</p>
                        <p className="font-semibold text-gray-900">
                          {booking.fitness_class_details?.date_time
                            ? new Date(booking.fitness_class_details.date_time).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Booked by</p>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{booking.client_name}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-600">{booking.client_email}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingList
