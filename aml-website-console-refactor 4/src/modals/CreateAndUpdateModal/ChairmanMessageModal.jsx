import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { GrClose } from "react-icons/gr";
import { FaUpload, FaSpinner } from "react-icons/fa";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const sizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px'];
const fonts = ['sans-serif', 'serif', 'monospace'];

const ChairmanMessageModal = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
  refreshData,
  setNewMedia,
  newMedia,
  mediaPreviews,
  setMediaPreviews
}) => {
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    message: '',
    media: []
  });

  useEffect(() => {
    if (typeof Quill !== 'undefined') {
      const Font = Quill.import('formats/font');
      Font.whitelist = fonts;
      Quill.register(Font, true);
    }
  }, []);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        designation: profileData.designation || '',
        message: profileData.message || '',
        media: profileData.media || []
      });
      setMediaPreviews(profileData.media || []);
      if (profileData.mainImage && (profileData.mainImage.frontendUrl || profileData.mainImage.url)) {
        setMainImagePreview(
          profileData.mainImage.frontendUrl
            ? `${import.meta.env.VITE_API_BASE_URL}${profileData.mainImage.frontendUrl}`
            : profileData.mainImage.url
        );
      } else {
        setMainImagePreview(null);
      }
    } else {
      setFormData({
        name: '',
        designation: '',
        message: '',
        media: []
      });
      setMediaPreviews([]);
      setMainImagePreview(null);
    }
    setNewMedia([]);
    setMainImage(null);
  }, [profileData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleMessageChange = (content) => {
    setFormData(prev => ({ ...prev, message: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('designation', formData.designation);
      submitData.append('message', formData.message);
      if (mainImage) {
        submitData.append('mainImage', mainImage);
      }
      newMedia.forEach(media => {
        submitData.append('media', media.file);
      });
      const success = await onSubmit(profileData?._id || null, submitData);
      if (success) {
        refreshData();
        if (!profileData) setFormData({ name: '', designation: '', message: '', media: [] });
        setMainImage(null);
        setMainImagePreview(null);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error submitting form');
    } finally {
      setLoading(false);
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-5xl bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">
                {profileData ? 'Edit Message' : 'Create Message'}
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors flex items-center justify-center"
              >
                <GrClose className="w-3 h-3" />
              </button>
            </div>
            {/* Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  placeholder="Enter name"
                />
              </div>
              {/* Designation Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  placeholder="Enter designation"
                />
              </div>
              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Message <span className="text-red-500">*</span></label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.message}
                    onChange={handleMessageChange}
                    modules={{
                      toolbar: [
                        [{ font: fonts }, { size: sizes }],
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
                <label className="block text-sm font-medium text-gray-600 mb-2">Main Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50 hover:border-blue-300 transition-colors">
                  {mainImagePreview ? (
                    <div className="relative">
                      <img
                        src={mainImagePreview}
                        alt="Main image preview"
                        className="w-full  object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMainImage(null);
                          setMainImagePreview(null);
                        }}
                        className="absolute w-8 h-8 top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <GrClose className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageSelect}
                        className="hidden"
                        id="mainImageUpload"
                      />
                      <label
                        htmlFor="mainImageUpload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <FaUpload className="text-2xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload Main Image</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {/* Media Upload (gallery) */}
              {/* Use the same media upload logic as other modals */}
            </form>
            {/* Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChairmanMessageModal; 