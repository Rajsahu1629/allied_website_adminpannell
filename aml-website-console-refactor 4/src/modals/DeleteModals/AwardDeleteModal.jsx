import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const AwardDeleteModal = ({ isOpen, onClose, deleteId, onDelete, isDeleting }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-blue-100/30 backdrop-blur-md z-50"
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
            <h2 className="text-xl font-bold text-red-600 mb-3">Delete Award</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this award?</p>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md w-1/2 mr-2 transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onDelete(deleteId)}
                disabled={isDeleting}
              >
                {isDeleting ? <GlobalLoading/> : "Delete"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md w-1/2 transition hover:bg-gray-400"
                onClick={onClose}
                disabled={isDeleting}
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

export default AwardDeleteModal;
