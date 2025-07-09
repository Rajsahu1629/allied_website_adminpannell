import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CategoryModal = ({
  isOpen,
  onClose,
  categoryData,
  setCategoryData,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial preview URLs when categoryData changes
  useEffect(() => {
    if (categoryData._id) {
      // Handle mainImage
      if (categoryData.mainImage?.frontendUrl) {
        setPreviewUrls([{
          url: `${import.meta.env.VITE_API_BASE_URL}${categoryData.mainImage.frontendUrl}`,
          alt: categoryData.mainImage.alt || categoryData.title
        }]);
      }
      // Handle media array
      else if (categoryData.media?.length > 0) {
        setPreviewUrls(categoryData.media.map(img => ({
          url: `${import.meta.env.VITE_API_BASE_URL}${img.frontendUrl}`,
          alt: img.alt || categoryData.title
        })));
      }
      // Handle images array (legacy format)
      else if (categoryData.images?.length > 0) {
        setPreviewUrls(categoryData.images.map(img => ({
          url: img,
          alt: categoryData.title
        })));
      }
    }
  }, [categoryData]);

  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding new images would exceed the limit
    const currentImages = previewUrls.length;
    if (currentImages + files.length > 10) {
      toast.error("You can only upload up to 10 images");
      return;
    }

    // Create preview URLs for selected files
    const newPreviewUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      alt: file.name
    }));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prev[indexToRemove].url);
      return newPreviews;
    });
  };

  const handleTitleChange = (e) => {
    setCategoryData({ ...categoryData, title: e.target.value });
  };

  const handleCategoryNameChange = (e) => {
    setCategoryData({ ...categoryData, categoryName: e.target.value });
  };

  const handleDescriptionChange = (content) => {
    setCategoryData({ ...categoryData, description: content });
  };

  const handlePositionChange = (e) => {
    setCategoryData({ ...categoryData, position: parseInt(e.target.value) || 0 });
  };

  const handleHighlightedFeaturesChange = (e) => {
    setCategoryData({ ...categoryData, highlightedFeatures: e.target.value });
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("banner", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories/banner`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const tempUrl = URL.createObjectURL(file);
        setCategoryData({
          ...categoryData,
          mainImage: {
            url: data.url,
            frontendUrl: data.frontendUrl,
            type: "image",
            alt: file.name
          }
        });
        toast.success("Image uploaded successfully!");
        URL.revokeObjectURL(tempUrl);
      } else {
        toast.error(data.message || "Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Something went wrong during image upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryData.title) {
      toast.error("Title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Category created successfully!");
        onClose();
        refreshData();
      } else {
        toast.error(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.message || "Error creating category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Category</h2>

        <form onSubmit={handleSubmit}>
          {/* Banner Upload */}
          <div className="relative w-full mb-4">
            {categoryData.mainImage?.frontendUrl ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${categoryData.mainImage.frontendUrl}`}
                alt="Category Banner"
                className="w-full h-64 object-cover rounded-md shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.png';
                }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
                No Banner Selected
              </div>
            )}
            <label className={`absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-md cursor-pointer flex items-center transition-all duration-300 hover:bg-blue-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" /> Upload Banner
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={categoryData.title}
              onChange={handleTitleChange}
              className="border bg-white outline-none border-gray-400 rounded-md p-2 w-full transition-all duration-300 focus:border-blue-500 focus:shadow-md"
              placeholder="Enter Category Title"
              required
            />
          </div>

          {/* Category Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={categoryData.categoryName}
              onChange={handleCategoryNameChange}
              className="border bg-white outline-none border-gray-400 rounded-md p-2 w-full transition-all duration-300 focus:border-blue-500 focus:shadow-md"
              placeholder="Enter Category Name"
            />
          </div>

          {/* Position Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="number"
              value={categoryData.position}
              onChange={handlePositionChange}
              className="border bg-white outline-none border-gray-400 rounded-md p-2 w-full transition-all duration-300 focus:border-blue-500 focus:shadow-md"
              placeholder="Enter Position"
            />
          </div>

          {/* Highlighted Features Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Features</label>
            <input
              type="text"
              value={categoryData.highlightedFeatures}
              onChange={handleHighlightedFeaturesChange}
              className="border bg-white outline-none border-gray-400 rounded-md p-2 w-full transition-all duration-300 focus:border-blue-500 focus:shadow-md"
              placeholder="Enter Highlighted Features"
            />
          </div>
          
          {/* Description Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <ReactQuill 
              theme="snow" 
              value={categoryData.description} 
              onChange={handleDescriptionChange}
              className="bg-white"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="inline-block mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal; 