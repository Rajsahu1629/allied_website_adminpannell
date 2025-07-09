import React, { useState } from "react";
import { FaUpload, FaSpinner, FaTimes } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from "react-hot-toast";
// import { postRequest, putRequest } from '../../../utils/api';

const ProductModal = ({ isOpen, onClose, productData, setProductData, refreshData, categoryId }) => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: productData?.title || '',
    description: productData?.description || '',
    highlightedFeatures: productData?.highlightedFeatures || '',
    position: productData?.position || 0,
    banner: productData?.banner || null,
    media: productData?.media || []
  });

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleHighlightedFeaturesChange = (content) => {
    setFormData(prev => ({ ...prev, highlightedFeatures: content }));
  };

  const handlePositionChange = (e) => {
    setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('images', file);

    try {
      setUploading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories/${categoryId}`, {
        method: 'POST',
        body: formDataObj
      });
      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({ ...prev, banner: data.data.banner }));
        toast.success('Banner uploaded successfully');
      } else {
        toast.error(data.message || 'Error uploading banner');
      }
    } catch (error) {
      toast.error('Error uploading banner');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataObj = new FormData();
    files.forEach(file => {
      formDataObj.append('media', file);
    });

    try {
      setUploading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories/${categoryId}`, {
        method: 'POST',
        body: formDataObj
      });
      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, ...data.data.media]
        }));
        toast.success('Media uploaded successfully');
      } else {
        toast.error(data.message || 'Error uploading media');
      }
    } catch (error) {
      toast.error('Error uploading media');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      if (productData?._id) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Product updated successfully');
          refreshData();
          onClose();
        } else {
          toast.error(data.message || 'Error updating product');
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories/${categoryId}/add-product`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Product created successfully');
          refreshData();
          onClose();
        } else {
          toast.error(data.message || 'Error creating product');
        }
      }
    } catch (error) {
      toast.error(productData ? 'Error updating product' : 'Error creating product');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {productData ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Banner Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
              {formData.banner?.frontendUrl ? (
                <img
                  src={formData.banner.frontendUrl}
                  alt="Product Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No banner uploaded
                </div>
              )}
              <label className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-50">
                {uploading ? (
                  <FaSpinner className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <FaUpload className="w-5 h-5 text-gray-600" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product title"
            />
          </div>

          {/* Position Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={handlePositionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter position"
            />
          </div>

          {/* Description Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className=" mb-12"
            />
          </div>

          {/* Highlighted Features Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlighted Features
            </label>
            <ReactQuill
              value={formData.highlightedFeatures}
              onChange={handleHighlightedFeaturesChange}
              className=" mb-12"
            />
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Media
            </label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {formData.media.map((media, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                    {media.type === 'image' ? (
                      <img
                        src={media.frontendUrl}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.frontendUrl}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              {uploading ? (
                <FaSpinner className="w-5 h-5 text-blue-600 animate-spin mr-2" />
              ) : (
                <FaUpload className="w-5 h-5 text-gray-600 mr-2" />
              )}
              Upload Media
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : productData ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal; 