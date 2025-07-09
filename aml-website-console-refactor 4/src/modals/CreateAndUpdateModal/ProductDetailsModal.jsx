import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";
import { FaTimes, FaUpload, FaPlus, FaTrash } from "react-icons/fa";

const ProductDetailsModal = ({
  isOpen,
  onClose,
  detailsData,
  setDetailsData,
  refreshData,
  productId
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Set initial preview URLs when detailsData changes
  useEffect(() => {
    if (detailsData._id && detailsData.media?.length > 0) {
      setPreviewUrls(detailsData.media.map(media => ({
        url: media.url,
        alt: media.alt || detailsData.title
      })));
    }
  }, [detailsData]);

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

  const handleAddKeyFeature = () => {
    setDetailsData(prev => ({
      ...prev,
      keyFeatures: [...(prev.keyFeatures || []), { title: "", description: "" }]
    }));
  };

  const handleRemoveKeyFeature = (index) => {
    setDetailsData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleKeyFeatureChange = (index, field, value) => {
    setDetailsData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleAddTechnicalSpec = () => {
    setDetailsData(prev => ({
      ...prev,
      technicalSpecification: [...(prev.technicalSpecification || []), { title: "", description: "" }]
    }));
  };

  const handleRemoveTechnicalSpec = (index) => {
    setDetailsData(prev => ({
      ...prev,
      technicalSpecification: prev.technicalSpecification.filter((_, i) => i !== index)
    }));
  };

  const handleTechnicalSpecChange = (index, field, value) => {
    setDetailsData(prev => ({
      ...prev,
      technicalSpecification: prev.technicalSpecification.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleAddBenefit = () => {
    setDetailsData(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), ""]
    }));
  };

  const handleRemoveBenefit = (index) => {
    setDetailsData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleBenefitChange = (index, value) => {
    setDetailsData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const handleAddInstructionStep = () => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        steps: [...(prev.instructionsForUse?.steps || []), ""]
      }
    }));
  };

  const handleRemoveInstructionStep = (index) => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        steps: prev.instructionsForUse.steps.filter((_, i) => i !== index)
      }
    }));
  };

  const handleInstructionStepChange = (index, value) => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        steps: prev.instructionsForUse.steps.map((step, i) => i === index ? value : step)
      }
    }));
  };

  const handleAddWarning = () => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        warning: [...(prev.instructionsForUse?.warning || []), ""]
      }
    }));
  };

  const handleRemoveWarning = (index) => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        warning: prev.instructionsForUse.warning.filter((_, i) => i !== index)
      }
    }));
  };

  const handleWarningChange = (index, value) => {
    setDetailsData(prev => ({
      ...prev,
      instructionsForUse: {
        ...prev.instructionsForUse,
        warning: prev.instructionsForUse.warning.map((warn, i) => i === index ? value : warn)
      }
    }));
  };

  const handleSubmit = async () => {
    const isUpdate = !!detailsData._id;

    // Validate required fields
    if (!detailsData.title) {
      toast.error("Title is required.");
      return;
    }

    setLoading(true);
    try {
      // Create FormData for the product details
      const formData = new FormData();
      
      // Append all product details data
      formData.append('title', detailsData.title);
      formData.append('description', detailsData.description || '');
      formData.append('subDescription', detailsData.subDescription || '');
      formData.append('keyFeatures', JSON.stringify(detailsData.keyFeatures || []));
      formData.append('technicalSpecification', JSON.stringify(detailsData.technicalSpecification || []));
      formData.append('benefits', JSON.stringify(detailsData.benefits || []));
      formData.append('instructionsForUse', JSON.stringify(detailsData.instructionsForUse || {
        overview: "",
        steps: [],
        warning: []
      }));
      formData.append('productId', productId);
      
      // Append images
      selectedFiles.forEach((file, index) => {
        formData.append(`media`, file);
      });

      let url;
      let method;

      if (isUpdate) {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/products/products/${productId}/details/${detailsData._id}`;
        method = "PATCH";
      } else {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/products/products/${productId}/add-detail`;
        method = "PATCH";
      }
      
      const res = await fetch(url, {
        method: method,
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || (isUpdate ? "Product details updated successfully!" : "Product details added successfully!"));
        refreshData();
        onClose();
        // Clean up
        previewUrls.forEach(preview => URL.revokeObjectURL(preview.url));
        setSelectedFiles([]);
        setPreviewUrls([]);
        setDetailsData({ 
          title: "",
          description: "",
          subDescription: "",
          keyFeatures: [],
          technicalSpecification: [],
          benefits: [],
          instructionsForUse: {
            overview: "",
            steps: [],
            warning: []
          },
          media: []
        });
      } else {
        toast.error(data.message || "Failed to update product details.");
      }
    } catch (error) {
      console.error("Error updating/adding product details:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex p-2 items-center justify-center bg-blue-100/30 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl md:w-[800px] max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              {detailsData._id ? "Edit Product Details" : "Add Product Details"}
            </h2>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter details title"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    value={detailsData.title}
                    onChange={(e) =>
                      setDetailsData({ ...detailsData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter description"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    value={detailsData.description}
                    onChange={(e) =>
                      setDetailsData({ ...detailsData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Description
                  </label>
                  <textarea
                    name="subDescription"
                    placeholder="Enter sub description"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    value={detailsData.subDescription}
                    onChange={(e) =>
                      setDetailsData({ ...detailsData, subDescription: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">Key Features</h3>
                  <button
                    onClick={handleAddKeyFeature}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                  >
                    <FaPlus size={12} />
                    <span>Add Feature</span>
                  </button>
                </div>

                {(detailsData.keyFeatures || []).map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Feature title"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={feature.title}
                        onChange={(e) => handleKeyFeatureChange(index, 'title', e.target.value)}
                      />
                      <textarea
                        placeholder="Feature description"
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={feature.description}
                        onChange={(e) => handleKeyFeatureChange(index, 'description', e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveKeyFeature(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Technical Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">Technical Specifications</h3>
                  <button
                    onClick={handleAddTechnicalSpec}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                  >
                    <FaPlus size={12} />
                    <span>Add Spec</span>
                  </button>
                </div>

                {(detailsData.technicalSpecification || []).map((spec, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Specification title"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={spec.title}
                        onChange={(e) => handleTechnicalSpecChange(index, 'title', e.target.value)}
                      />
                      <textarea
                        placeholder="Specification description"
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={spec.description}
                        onChange={(e) => handleTechnicalSpecChange(index, 'description', e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveTechnicalSpec(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">Benefits</h3>
                  <button
                    onClick={handleAddBenefit}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                  >
                    <FaPlus size={12} />
                    <span>Add Benefit</span>
                  </button>
                </div>

                {(detailsData.benefits || []).map((benefit, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <input
                      type="text"
                      placeholder="Enter benefit"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                    />
                    <button
                      onClick={() => handleRemoveBenefit(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Instructions for Use */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Instructions for Use</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overview
                  </label>
                  <textarea
                    placeholder="Enter instructions overview"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    value={detailsData.instructionsForUse?.overview || ''}
                    onChange={(e) =>
                      setDetailsData({
                        ...detailsData,
                        instructionsForUse: {
                          ...detailsData.instructionsForUse,
                          overview: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Steps
                    </label>
                    <button
                      onClick={handleAddInstructionStep}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                    >
                      <FaPlus size={12} />
                      <span>Add Step</span>
                    </button>
                  </div>

                  {(detailsData.instructionsForUse?.steps || []).map((step, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <input
                        type="text"
                        placeholder={`Step ${index + 1}`}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={step}
                        onChange={(e) => handleInstructionStepChange(index, e.target.value)}
                      />
                      <button
                        onClick={() => handleRemoveInstructionStep(index)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Warnings
                    </label>
                    <button
                      onClick={handleAddWarning}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                    >
                      <FaPlus size={12} />
                      <span>Add Warning</span>
                    </button>
                  </div>

                  {(detailsData.instructionsForUse?.warning || []).map((warn, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <input
                        type="text"
                        placeholder="Enter warning"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        value={warn}
                        onChange={(e) => handleWarningChange(index, e.target.value)}
                      />
                      <button
                        onClick={() => handleRemoveWarning(index)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between mb-4">
                  <div className="block text-sm font-medium text-gray-700">
                    Media (Max 10)
                  </div>
                  <div className="text-sm font-medium text-gray-700">Max width 200px</div>
                </div>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 hover:border-blue-400 transition-colors mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="productDetailsMedia"
                    onChange={handleImagesSelect}
                    disabled={previewUrls.length >= 10}
                  />
                  <label
                    htmlFor="productDetailsMedia"
                    className={`cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-md transition-colors inline-flex items-center space-x-2 w-full justify-center ${
                      previewUrls.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaUpload className="text-lg" />
                    <span>Upload Media</span>
                  </label>
                </div>

                {/* Uploaded Images Grid */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Media
                    </h3>
                    <div className="h-[400px] overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 gap-4">
                        {previewUrls.map((preview, index) => (
                          <div key={index} className="relative w-[200px] h-[200px] mx-auto">
                            <img
                              src={preview.url}
                              alt={preview.alt || `Media ${index + 1}`}
                              className="w-full h-full object-cover rounded-md shadow-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md transition hover:bg-blue-700 shadow-md hover:shadow-lg"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <GlobalLoading />
                ) : detailsData._id ? (
                  "Update Details"
                ) : (
                  "Add Details"
                )}
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-md transition hover:bg-gray-200 shadow-md hover:shadow-lg"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal; 