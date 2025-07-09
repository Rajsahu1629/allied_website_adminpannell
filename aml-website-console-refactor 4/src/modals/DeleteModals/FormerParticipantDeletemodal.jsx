import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const FormerParticipantDeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  deleteId,
  isDeleting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Delete Profile</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this profile? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <GlobalLoading />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormerParticipantDeleteModal; 