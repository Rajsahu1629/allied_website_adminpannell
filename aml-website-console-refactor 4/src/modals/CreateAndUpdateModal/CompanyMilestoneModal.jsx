import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const CompanyMilestoneModal = ({
  isOpen,
  onClose,
  milestoneData,
  refreshData,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    order: 0,
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (milestoneData?._id) {
      setFormData({
        title: milestoneData.title || "",
        date: milestoneData.date || "",
        description: milestoneData.description || "",
        order: milestoneData.order || 0,
      });
      setMainImagePreview(
        milestoneData.mainImage?.frontendUrl
          ? `${import.meta.env.VITE_API_BASE_URL}${
              milestoneData.mainImage.frontendUrl
            }`
          : ""
      );
      setAdditionalImagesPreview(
        milestoneData.media?.slice(1).map((img) => img.url) || []
      );
    } else {
      setFormData({
        title: "",
        date: "",
        description: "",
        order: 0,
      });
      setMainImage(null);
      setMainImagePreview("");
      setAdditionalImages([]);
      setAdditionalImagesPreview([]);
    }
  }, [milestoneData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setAdditionalImagesPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImagePreview("");
  };

  const handleRemoveAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formDataToSend = new FormData();
      const isUpdate = Boolean(milestoneData?._id);
  
      // Append only changed fields if updating, otherwise append all
      if (isUpdate) {
        if (formData.title !== milestoneData.title) {
          formDataToSend.append("title", formData.title || "");
        }
        if (formData.date !== milestoneData.date) {
          formDataToSend.append("date", formData.date || "");
        }
        if (formData.description !== milestoneData.description) {
          formDataToSend.append("description", formData.description || "");
        }
        if (formData.order !== milestoneData.order) {
          formDataToSend.append("order", formData.order || 0);
        }
      } else {
        formDataToSend.append("title", formData.title || "");
        formDataToSend.append("date", formData.date || "");
        formDataToSend.append("description", formData.description || "");
        formDataToSend.append("order", formData.order || 0);
      }
  
      // Handle main image
      if (!isUpdate || mainImage !== null) {
        formDataToSend.append("mainImage", mainImage);
      }
  
      // Append additional images (no need to diff these — re-send them)
      additionalImages.forEach((image) => {
        formDataToSend.append("additionalImages", image);
      });
  
      // Log the FormData (for debugging)
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
  
      // Decide endpoint
      const url = isUpdate
        ? `${import.meta.env.VITE_API_BASE_URL}/api/company-milestone/update-milestone/${milestoneData._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/company-milestone/create-milestone`;
  
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        body: formDataToSend,
      });
  
      const data = await res.json();
  
      refreshData();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error submitting milestone");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
                  <h2 className="text-lg font-medium text-gray-800">
                    {milestoneData?._id ? 'Edit Milestone' : 'Create Milestone'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <GrClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Title
                    {!milestoneData?._id && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter milestone title"
                  />
                </div>
                {/* Order Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Display order"
                  />
                </div>
                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Date
                    {!milestoneData?._id && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                    {!milestoneData?._id && <span className="text-red-500">*</span>}
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      className="h-48"
                      placeholder="Write your milestone description here..."
                      modules={{
                        toolbar: [
                          [{ font: [] }, { size: [] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ color: [] }, { background: [] }],
                          [{ script: "sub" }, { script: "super" }],
                          ["blockquote", "code-block"],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          [{ direction: "rtl" }],
                          [{ align: [] }],
                          
                        ],
                      }}
                    />
                  </div>
                </div>
                 {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Main Image
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:border-blue-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                      id="milestoneMainImage"
                    />
                    <label
                      htmlFor="milestoneMainImage"
                      className="inline-flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <FaUpload className="text-lg" />
                      </div>
                      <span className="text-sm font-medium text-blue-600 mb-1">Upload Main Image</span>
                      <span className="text-xs text-gray-500">Supports images only</span>
                    </label>
                    {mainImagePreview && (
                      <div className="relative w-full h-208 mt-4">
                        <img
                          src={mainImagePreview}
                          alt="Main Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={handleRemoveMainImage}
                          className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
                        >
                          <GrClose className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Additional Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Additional Images
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:border-blue-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                      id="milestoneAdditionalImages"
                    />
                    <label
                      htmlFor="milestoneAdditionalImages"
                      className="inline-flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <FaUpload className="text-lg" />
                      </div>
                      <span className="text-sm font-medium text-blue-600 mb-1">Upload Images</span>
                      <span className="text-xs text-gray-500">Supports images only</span>
                    </label>
                    {additionalImagesPreview.length > 0 && (
                      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {additionalImagesPreview.map((src, idx) => (
                          <div key={idx} className="relative aspect-square">
                            <img
                              src={src}
                              alt={`preview-${idx}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
                            >
                              <GrClose className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Description Editor */}
            
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-100 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <span>
                      {milestoneData?._id ? 'Update Milestone' : 'Create Milestone'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompanyMilestoneModal;