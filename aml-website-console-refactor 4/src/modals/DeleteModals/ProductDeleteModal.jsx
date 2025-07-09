import React from "react";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const ProductDeleteModal = ({
  isOpen,
  onClose,
  deleteId,
  onDelete,
  isDeleting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-[90%] max-w-md mx-auto"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? <GlobalLoading /> : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
=======
import { FaSpinner } from "react-icons/fa";

const ProductDeleteModal = ({ isOpen, onClose, deleteId, onDelete, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Product</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(deleteId)}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <FaSpinner className="w-5 h-5 animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
>>>>>>> 09f37656b8454947a033a3634f7dc1331ceda08a
  );
};

export default ProductDeleteModal; 