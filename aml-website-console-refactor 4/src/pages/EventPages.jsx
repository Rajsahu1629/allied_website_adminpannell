import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { fetchGetRequest } from "../api/apiRequest";
import EventModal from "../modals/CreateAndUpdateModal/EventModal";
import EventDeleteModal from "../modals/DeleteModals/EventDeleteModal";

const EventPages = () => {
  const [eventsData, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    eventName: "",
    eventBanner: "",
    eventTime: "",
    eventDate: "",

    location: "",
  });

  // Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchGetRequest("/api/events/get_all_events");
      console.log(res, "resData");
      setEvents(res);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Modal for Add/Edit
  const openModal = (event = null) => {
    setModalOpen(true);
    setCurrentEvent(event);
    if (event) {
      setFormData({
        eventName: event.eventName,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        location: event.location,
      });
    } else {
      setFormData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        location: "",
      });
    }
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        await axios.put(`/update_event/${currentEvent._id}`, formData);
      } else {
        await axios.post("/create_events", formData);
      }
      fetchEvents();
      closeModal();
    } catch (err) {
      setError("Failed to save event");
    }
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/delete_event/${id}`);
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <div className="p-6  lg:w-[80%] m-auto ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl lg:text-4xl text-blue-950 underline font-bold text-center mb-4">
        Event Management
      </h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openModal()}
        >
          <FaPlus className="mr-2" /> Add Event
        </button>
      </div>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2   lg:grid-cols-3 m-auto  gap-4">
        {eventsData?.map((event) => (
          <div
            key={event._id}
            className="relative flex w-[100%] flex-col rounded-xl bg-[#BFDBFE] bg-clip-border text-gray-700 shadow-md"
          >
            <img
              src={event.eventBanner}
              alt={event.eventName}
              className="w-full h-60 object-fit rounded-t-xl mb-3"
            />
            <div className="p-6">
              <h2 className="text-lg font-semibold">{event.eventName}</h2>
              <p className="text-gray-600">
                {event.eventDate} - {event.eventTime}
              </p>
              <p className="text-gray-700">{event.location}</p>
            </div>
            <div className="">
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => {
                    setFormData(event);
                    setModalOpen(true);
                  }}
                  className="bg-yellow-500 cursor-pointer duration-500 ease-in-out hover:bg-yellow-700 text-white p-2 rounded-md"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(event._id);
                    setDeleteModalOpen(true);
                  }}
                  className="bg-red-500 duration-500 ease-in-out hover:bg-red-700 text-white cursor-pointer p-2 rounded-md"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eventsData={formData}
        setEvents={setFormData}
        refreshData={fetchEvents}
      />
      <EventDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        deleteId={deleteId}
        refreshData={fetchEvents}
      />
    </div>
  );
};

export default EventPages;
