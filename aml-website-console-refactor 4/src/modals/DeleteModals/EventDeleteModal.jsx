import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { sendDeleteRequest } from "../../api/apiRequest";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const EventDeleteModal = ({ isOpen, onClose, deleteId, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await sendDeleteRequest(`/api/events/delete_event/${deleteId}`);

      if (res.status) {
        toast.success(res?.message);
        refreshData();
        onClose();
      } else {
        toast.error("Failed to delete award.");
      }
    } catch (error) {
      console.error("Error deleting award:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-blue-100/30 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl w-80 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <h2 className="text-xl font-bold text-red-600 mb-3">Delete Event</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md w-1/2 mr-2 transition hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <GlobalLoading/> : "Delete"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md w-1/2 transition hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDeleteModal;
