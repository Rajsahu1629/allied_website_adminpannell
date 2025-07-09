import React from "react";
import { FaSpinner } from "react-icons/fa";

const CategoryDeleteModal = ({ isOpen, onClose, deleteId, onDelete, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delete Category</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-600"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(deleteId)}
            disabled={isDeleting}
            className={`bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? (
              <>
                <FaSpinner className="inline-block mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDeleteModal; 