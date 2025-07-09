import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";
import { FaUpload, FaPlay } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AwardModal = ({
  isOpen,
  onClose,
  awardData,
  setAwardData,
  refreshData,
  setNewMedia,
  newMedia,
  mediaPreviews,
  setMediaPreviews

}) => {
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  


  useEffect(() => {
    if (awardData && awardData.mainImage && (awardData.mainImage.frontendUrl || awardData.mainImage.url)) {
      setMainImagePreview(
        awardData.mainImage.frontendUrl
          ? `${import.meta.env.VITE_API_BASE_URL}${awardData.mainImage.frontendUrl}`
          : awardData.mainImage.url
      );
    } else {
      setMainImagePreview(null);
      setMediaPreviews(awardData && awardData.media ? awardData.media : []);
    }
    setNewMedia([]);
  },
 [awardData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAwardData(prev => ({ ...prev, [name]: value }));

  };

  const handleDescriptionChange = (content) => {
    setAwardData(prev => ({ ...prev, description: content }));
    
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

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (mediaPreviews.length + newMedia.length + files.length > 10) {
      toast.error("You can only upload up to 10 media items");
      return;
    }
    const newPreviews = files.map(file => ({
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      preview: URL.createObjectURL(file),
      alt: file.name
    }));
    setNewMedia(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveMedia = (index, isNew = false) => {
    if (isNew) {
      setNewMedia(prev => {
        const updated = [...prev];
        URL.revokeObjectURL(updated[index].preview);
        updated.splice(index, 1);
        return updated;
      });
    } else {
      setMediaPreviews(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const resetForm = () => {
    setAwardData({
      title: '',
      subtitle: '',
      category: '',
      year: '',
      awardingBody: '',
      description: '',
      media: [],
      mainImage: { url: '', frontendUrl: '', type: 'image', alt: '' }
    });
    setMainImage(null);
    setMainImagePreview(null);
    setMediaPreviews([]);
    setNewMedia([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', awardData.title);
      submitData.append('subtitle', awardData.subtitle || '');
      submitData.append('category', awardData.category || '');
      submitData.append('year', awardData.year || '');
      submitData.append('awardingBody', awardData.awardingBody || '');
      submitData.append('description', awardData.description);
      submitData.append('order', awardData.order || 0);
      if (mainImage) {
        submitData.append('mainImage', mainImage);
      }
      mediaPreviews.forEach(media => {
        if (media._id) {
          submitData.append('media', media._id);
        }
      });
      newMedia.forEach(media => {
        submitData.append('media', media.file);
      });
      const isUpdate = !!awardData._id;
      let url, method;
      if (isUpdate) {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/awards/update-award/${awardData._id}`;
        method = "PUT";
      } else {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/awards/create-award`;
        method = "POST";
      }
      const res = await fetch(url, {
        method,
        body: submitData
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || (isUpdate ? "Award updated successfully!" : "Award added successfully!"));
        refreshData();
        if (!isUpdate) resetForm();
        onClose();
      } else {
        toast.error(data.message || "Failed to update award.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = (media, index, isNew = false, number = null) => {
    if (media.type === 'video') {
      const videoUrl = isNew ? media.preview : `${import.meta.env.VITE_API_BASE_URL}${media.frontendUrl}`;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <video
            src={videoUrl}
            className="w-full h-full rounded-lg"
            controls
            preload="metadata"
          >
            <source src={videoUrl} type={media.file?.type || 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <FaPlay className="w-3 h-3" />
            <span>Video</span>
          </div>
          <button
            onClick={() => handleRemoveMedia(index, isNew)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
            aria-label="Remove video"
          >
            <GrClose className="w-3 h-3" />
          </button>
        </motion.div>
      );
    }
    const imageUrl = isNew ? media.preview : `${import.meta.env.VITE_API_BASE_URL}${media.frontendUrl}`;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={imageUrl}
          alt={media.alt || 'Media preview'}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {number !== null ? number : index + 1}
        </div>
        <button
          onClick={() => handleRemoveMedia(index, isNew)}
          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
          aria-label="Remove image"
        >
          <GrClose className="w-3 h-3" />
        </button>
      </motion.div>
    );
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
                    {awardData._id ? 'Edit Award' : 'Create Award'}
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
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={awardData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter award title"
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
                    value={awardData.order || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Display order"
                  />
                </div>
                {/* Subtitle Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={awardData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter award subtitle"
                  />
                </div>
                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={awardData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Healthcare Excellence">Healthcare Excellence</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Research">Research</option>
                    <option value="Patient Care">Patient Care</option>
                  </select>
                </div>
                {/* Year Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={awardData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter award year"
                  />
                </div>
                {/* Awarding Body Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Awarding Body
                  </label>
                  <input
                    type="text"
                    name="awardingBody"
                    value={awardData.awardingBody}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter awarding body"
                  />
                </div>
                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={awardData.description}
                      onChange={handleDescriptionChange}
                      className="h-48"
                      placeholder="Write your description here..."
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
                          ["image"],
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
                      onChange={handleMainImageSelect}
                      className="hidden"
                      id="mainImageUpload"
                    />
                    <label
                      htmlFor="mainImageUpload"
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
                          alt="Main image preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                          className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
                        >
                          <GrClose className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Additional Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Additional Media (Images & Videos)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:border-blue-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaSelect}
                      className="hidden"
                      id="mediaUpload"
                    />
                    <label
                      htmlFor="mediaUpload"
                      className="inline-flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <FaUpload className="text-lg" />
                      </div>
                      <span className="text-sm font-medium text-blue-600 mb-1">Upload Media</span>
                      <span className="text-xs text-gray-500">Supports images and videos</span>
                    </label>
                  </div>
                </div>
                {/* Existing Media */}
                {mediaPreviews.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Existing Media</h3>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                      {mediaPreviews.map((media, index) => (
                        <div key={index} className="aspect-square">
                          {renderMediaPreview(media, index, false, index + 1)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* New Media */}
                {newMedia.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">New Media</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {newMedia.map((media, index) => (
                        <div key={index} className="aspect-square">
                          {renderMediaPreview(media, index, true, mediaPreviews.length + index + 1)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-100 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaUpload className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save</span>
                    </>
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

export default AwardModal;