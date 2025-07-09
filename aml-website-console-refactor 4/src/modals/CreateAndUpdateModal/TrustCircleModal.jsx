import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GrClose } from "react-icons/gr";
import { FaFileUpload, FaUpload, FaSpinner } from "react-icons/fa";
import UpcommingEvents from "../../pages/UpcommingEvents";

const sizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px'];

const fonts = [
  'sans-serif', 'serif', 'monospace', 
];


const TrustCircleModal = ({
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        title: profileData.title || '',
        description: profileData.description || '',
        order: profileData.order || 0,
        media: profileData.media || []
      });
      setMediaPreviews(profileData.media || []);
    } else {
      setFormData({
        title: '',
        description: '',
        order: 0,
        media: []
      });
      setMediaPreviews([]);
    }
    setNewMedia([]);
  }, [profileData, isOpen]);

  // Register custom fonts if needed
  useEffect(() => {
    if (typeof Quill !== 'undefined') {
      const Font = Quill.import('formats/font');
      Font.whitelist = fonts;
      Quill.register(Font, true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (mediaPreviews.length + files.length > 10) {
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
    setFormData({
      title: '',
      description: '',
      order: 0,
      media: []
    });
    setMediaPreviews([]);
    setNewMedia([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('order', formData.order);

      newMedia.forEach(media => {
        submitData.append('media', media.file);
      });

      const success = await onSubmit(profileData?._id || null, submitData);
      if (success) {
        refreshData();
        if (!profileData) resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = (media, index, isNew = false) => {
    const isVideo = media.type === 'video';
    const mediaUrl = isNew ? media.preview : `${import.meta.env.VITE_API_BASE_URL}${media.frontendUrl}`;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {isVideo ? (
          <video src={mediaUrl} className="w-full h-full rounded-lg" controls preload="metadata" />
        ) : (
          <img src={mediaUrl} alt={media.alt || 'preview'} className="w-full h-full object-cover rounded-lg" />
        )}

        <div className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full bg-black/60 text-white">
          {isVideo ? 'Video' : `#${index + 1}`}
        </div>

        <button
  onClick={() => handleRemoveMedia(index, isNew)}
  className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-sm flex items-center justify-center"
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-5xl bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
                  <h2 className="text-lg font-medium text-gray-800">
                    {profileData ? 'Edit Profile' : 'Create Profile'}
                  </h2>
                </div>
                <button
                onClick={onClose}
                className="w-6 h-6 p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors flex items-center justify-center"
              >
                <GrClose className="w-3 h-3" />
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
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter profile title"
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
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Display order"
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
                      value={formData.description}
                      onChange={handleDescriptionChange}
                     
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

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Media Gallery
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

                {/* Media Previews */}
                {(mediaPreviews.length > 0 || newMedia.length > 0) && (
                  <div className="space-y-4">
                    {mediaPreviews.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Existing Media</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {mediaPreviews.map((media, index) => (
                            <div key={`existing-${index}`} className="aspect-square">
                              {renderMediaPreview(media, index)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {newMedia.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">New Media</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {newMedia.map((media, index) => (
                            <div key={`new-${index}`} className="aspect-square">
                              {renderMediaPreview(media, index, true)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                      <FaSpinner className="animate-spin" />
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

export default  TrustCircleModal;
