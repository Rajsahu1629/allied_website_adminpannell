import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import GlobalLoading from "../../component/globalComponent/GlobalLoading";
import { FaUpload } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const BlogModal = ({ isOpen, onClose, blogData, refreshData,setNewMedia,newMedia,mediaPreviews,setMediaPreviews }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "",
    author: "",
    content: "",
    tags: [],
    status: "draft",
    order: 0,
    date: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
console.log( newMedia,mediaPreviews, "setNewMedia,newMedia,mediaPreviews,setMediaPreviews")
  
  useEffect(() => {
    if (blogData?._id) {
      setFormData({
        title: blogData.title || "",
        subtitle: blogData.subtitle || "",
        category: blogData.category || "",
        author: blogData.author || "",
        content: blogData.content || "",
        tags: blogData.tags || [],
        status: blogData.status || "draft",
        order: blogData.order || 0,
        date: blogData.date ? blogData.date.split('T')[0] : "",
      });
      setMainImagePreview(
        blogData.mainImage?.frontendUrl
          ? `${import.meta.env.VITE_API_BASE_URL}${
              blogData.mainImage.frontendUrl
            }`
          : ""
      );

      setAdditionalImagesPreview(
        blogData.media || []
      );
    } else {
      setFormData({
        title: "",
        subtitle: "",
        category: "",
        author: "",
        content: "",
        tags: [],
        status: "draft",
        order: 0,
        date: "",
      });
      setMainImagePreview("");
      setAdditionalImagesPreview([]);
    }
    setNewMedia([]);
    setMainImage(null);
    setAdditionalImages([]);
  }, [blogData, isOpen]);
  
  console.log(mainImagePreview, "main");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
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

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const getFrontendUrl = (url) => {
    if (!url) return "";
    if (typeof(url)=="string"&&(url.startsWith("http")||url.startsWith("blob"))) {return url};
    if (typeof(url)=="string"&&url.startsWith("\\\\")) {
      // Convert Windows network path to frontend URL
      const fileName = url.frontendUrl.split("\\").pop();
      return `${import.meta.env.VITE_API_BASE_URL}/api/blogs/media/${fileName}`;
    }
    return `${import.meta.env.VITE_API_BASE_URL}${url.frontendUrl}`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      category: "",
      author: "",
      content: "",
      tags: [],
      status: "draft",
      order: 0,
      date: "",
    });
    setMainImagePreview("");
    setAdditionalImagesPreview([]);
    setMainImage(null);
    setAdditionalImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ids =  additionalImagesPreview.map((ele)=>{if(typeof(ele)!=="string"){
      return ele?._id
    }})
    try {
      if (!formData.title || !formData.category || !formData.content) {
        toast.error(
          "Please fill in all required fields (Title, Category, and Content)"
        );
        setIsSubmitting(false);
        return;
      }
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("author", formData.author || "");
      formDataToSend.append("content", formData.content);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append("order", formData.order || 0);
      formDataToSend.append("date", formData.date || "");
      formDataToSend.append("mediaToKeep", ids);
      if (mainImage) {
        formDataToSend.append("mainImage", mainImage);
      }
      additionalImages.forEach((file, index) => {
        formDataToSend.append("media", file);
      });
      const isUpdate = blogData?._id;
      const url = isUpdate
        ? `${import.meta.env.VITE_API_BASE_URL}/api/blogs/update-blog/${
            blogData._id
          }`
        : `${import.meta.env.VITE_API_BASE_URL}/api/blogs/create-blog`;
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save blog");
      }
      toast.success(
        isUpdate ? "Blog updated successfully!" : "Blog created successfully!"
      );
      refreshData();
      if (!blogData) {
        resetForm();
      }
      onClose();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error.message || "Error submitting blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(additionalImagesPreview, "additionalImagesPreviewadditionalImagesPreview")

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
                    {blogData?._id ? 'Edit Blog' : 'Create Blog'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 w-6 h-6 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <GrClose className="w-30 h-3" />
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
                    placeholder="Enter blog title"
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
                {/* Subtitle Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter blog subtitle"
                  />
                </div>
                {/* Author Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Enter author name"
                  />
                </div>
                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  />
                </div>
                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                          setCategories((prev) => [...prev, newCategory.trim()]);
                          setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
                        }
                        setNewCategory("");
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {/* Show added categories as selectable chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat, idx) => (
                      <span
                        key={cat}
                        className={`px-3 py-1 rounded-full text-sm flex items-center cursor-pointer ${formData.category === cat ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
                        onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      >
                        {cat}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategories((prev) => prev.filter((c) => c !== cat));
                            if (formData.category === cat) {
                              setFormData((prev) => ({ ...prev, category: "" }));
                            }
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                {/* Tags Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tags
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Content Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      className=""
                      placeholder="Write your blog content here..."
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
                      onChange={handleMainImageChange}
                      className="hidden"
                      id="mainImage"
                    />
                    <label
                      htmlFor="mainImage"
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
                          className="absolute top-2 right-2 h-[36px] w-[36px] bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
                        >
                          <GrClose className="w-[12px] h-[16px]" />
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
                      id="additionalImages"
                    />
                    <label
                      htmlFor="additionalImages"
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
                              src={getFrontendUrl(src)}
                              alt={`preview-${idx}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {idx + 1}
                            </div>
                            <button
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="absolute top-2  w-8 h-8 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110 shadow-sm"
                            >
                              <GrClose className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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

export default BlogModal;