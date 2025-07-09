import React from 'react';
import GlobalLoading from "../../component/globalComponent/GlobalLoading";

const CompanyMilestoneDeleteModal = ({ isOpen, onClose, deleteId, onDelete, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this milestone?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(deleteId)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            {isDeleting ? <GlobalLoading /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyMilestoneDeleteModal; 