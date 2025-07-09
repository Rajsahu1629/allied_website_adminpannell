import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { sendPostRequest, sendPutRequest } from "../../api/apiRequest";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const EventModal = ({
  isOpen,
  onClose,
  eventsData,
  setEvents,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  console.log(eventsData, "asdff");
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload_image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setEvents((prev) => ({ ...prev, eventBanner: data.imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.message || "Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Something went wrong during image upload.");
    }
  };

  const handleSubmit = async () => {
    if (
      !eventsData.eventName ||
      !eventsData.eventBanner ||
      !eventsData.eventDate ||
      !eventsData.eventTime ||
      !eventsData.location
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const isUpdate = !!eventsData._id;
    const url = isUpdate
      ? `/api/events/update_event/${eventsData._id}`
      : "/api/events/create_events";
    const payload = {
      eventName: eventsData.eventName,
      eventBanner: eventsData.eventBanner,
      eventDate: eventsData.eventDate,
      eventTime: eventsData.eventTime,
      location: eventsData.location,
    };

    try {
      const res = isUpdate
        ? await sendPutRequest(url, payload)
        : await sendPostRequest(url, payload);
      if (res.status) {
        toast.success(res?.message);
        refreshData();
        onClose();
        setEvents({
          eventName: "",
          eventBanner: "",
          eventDate: "",
          eventTime: "",
          location: "",
        });
      } else {
        toast.error("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating/adding event:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex p-2 items-center justify-center bg-blue-100/30 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl md:w-150"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <h2 className="text-xl font-bold text-blue-700 mb-3">
              {eventsData._id ? "Edit Event" : "Add New Event"}
            </h2>
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
              value={eventsData.eventName}
              onChange={(e) =>
                setEvents({ ...eventsData, eventName: e.target.value })
              }
            />
            <input
              type="date"
              name="eventDate"
              className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
              value={eventsData.eventDate}
              onChange={(e) =>
                setEvents({ ...eventsData, eventDate: e.target.value })
              }
            />
            <input
              type="text"
              name="eventTime"
              placeholder="Event Time"
              className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
              value={eventsData.eventTime}
              onChange={(e) =>
                setEvents({ ...eventsData, eventTime: e.target.value })
              }
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
              value={eventsData.location}
              onChange={(e) =>
                setEvents({ ...eventsData, location: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              className="w-full mb-2"
              onChange={handleImageUpload}
            />
            {imageUploading && (
              <p className="text-blue-600 text-sm">Uploading image...</p>
            )}
            {eventsData.eventBanner && (
              <img
                src={eventsData.eventBanner}
                alt="Event Banner"
                className="w-full h-32 object-cover mb-2 rounded-md shadow-md"
              />
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full transition hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading || imageUploading}
            >
              {loading ? (
                <GlobalLoading />
              ) : eventsData._id ? (
                "Update Event"
              ) : (
                "Add Event"
              )}
            </button>
            <button
              className="mt-2 w-full text-gray-500 hover:text-gray-700 transition"
              onClick={onClose}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
