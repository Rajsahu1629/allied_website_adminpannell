import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaUpload, FaChevronLeft, FaSpinner } from "react-icons/fa";
import { fetchGetRequest } from "../api/apiRequest";
import toast, { Toaster } from "react-hot-toast";
import GlobalLoading from "../component/globalComponent/GlobalLoading";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductDetailPage = () => {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [mainTitle, setMainTitle] = useState("");
  const [mainBanner, setMainBanner] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [highlightedFeatures, setHighlightedFeatures] = useState("");
  const [position, setPosition] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
  
    try {
      const res = await fetchGetRequest(`/api/products/products/${productId}/details`);
      if (res) {
        setProductData(res);
        setMainTitle(res.title || "");
        setMainBanner(res.banner?.frontendUrl || "");
        setMainDescription(res.description || "");
        setHighlightedFeatures(res.highlightedFeatures || "");
        setPosition(res.position || 0);
        setMedia(res.media || []);
        if (res.mainImage?.frontendUrl) {
          setPreviewUrls([{
            url: `${import.meta.env.VITE_API_BASE_URL}${res.mainImage.frontendUrl}`,
            alt: res.mainImage.alt || res.title
          }]);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error(error.message || "Error fetching product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainTitleChange = (e) => {
    setMainTitle(e.target.value);
  };

  const handleMainDescriptionChange = (content) => {
    setMainDescription(content);
  };

  const handleHighlightedFeaturesChange = (content) => {
    setHighlightedFeatures(content);
  };

  const handlePositionChange = (e) => {
    setPosition(parseInt(e.target.value) || 0);
  };

  const handleMainBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("banner", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/banner`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const tempUrl = URL.createObjectURL(file);
        setMainBanner(tempUrl);
        toast.success("Image uploaded successfully!");
        await fetchProductDetails();
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

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append("media", file);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/media`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Media uploaded successfully!");
        await fetchProductDetails();
      } else {
        toast.error(data.message || "Media upload failed.");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Something went wrong during media upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!mediaId) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/products/${productId}/details/${mediaId}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok) {
        await fetchProductDetails();
        toast.success("Media deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete media");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error(error.message || "Error deleting media");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!mainTitle) {
        toast.error("Title is required.");
        return;
    }

    setUpdateLoading(true);
    try {
        const productData = {
            title: mainTitle,
            description: mainDescription,
            highlightedFeatures,
            position,
            banner: mainBanner ? { url: mainBanner, frontendUrl: mainBanner } : { url: "", frontendUrl: "" },
            media: media || []
        };

        let url;
        let method;

        if (productId) {
            url = `${import.meta.env.VITE_API_BASE_URL}/api/products/products/${productId}`;
            method = "PUT";
        } else {
            url = `${import.meta.env.VITE_API_BASE_URL}/api/products/categories/${categoryId}/add-product`;
            method = "PATCH";
        }

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        const data = await res.json();

        if (res.ok) {
            await fetchProductDetails();
            toast.success(productId ? "Product updated successfully!" : "Product created successfully!");
            if (!productId) {
                navigate(`/products/${categoryId}`);
            }
        } else {
            toast.error(data.error || (productId ? "Failed to update product" : "Failed to create product"));
        }
    } catch (error) {
        console.error("Error with product:", error);
        toast.error(error.message || (productId ? "Error updating product" : "Error creating product"));
    } finally {
        setUpdateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:w-[80%] m-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/products/${categoryId}`)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaChevronLeft className="mr-2" /> Back to Category
        </button>
      </div>

      <h1 className="text-3xl lg:text-4xl text-blue-950 underline font-bold text-center mb-4">
        Product Details
      </h1>

      {/* Main Banner & Text Section */}
      <div className="mt-[50px] rounded-lg p-6 shadow-lg mb-6 mx-auto bg-[#BFDBFE] transform transition-all duration-300 hover:shadow-xl">
        {/* Banner Upload */}
        <div className="relative w-full mb-4">
          {mainBanner ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${mainBanner}`}
              alt="Main Banner"
              className="w-full h-80 object-fill rounded-md shadow-md"
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
              onChange={handleMainBannerUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Main Title Input */}
        <input
          type="text"
          value={mainTitle}
          onChange={handleMainTitleChange}
          className="text-xl font-bold border bg-white outline-none border-gray-400 rounded-md p-2 w-full mb-4 text-center transition-all duration-300 focus:border-blue-500 focus:shadow-md"
          placeholder="Enter Main Title"
          disabled={updateLoading}
        />

        {/* Position Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <input
            type="number"
            value={position}
            onChange={handlePositionChange}
            className="border bg-white outline-none border-gray-400 rounded-md p-2 w-full transition-all duration-300 focus:border-blue-500 focus:shadow-md"
            placeholder="Enter Position"
            disabled={updateLoading}
          />
        </div>

        {/* Main Description Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <ReactQuill 
            theme="snow" 
            value={mainDescription} 
            onChange={handleMainDescriptionChange}
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

        {/* Highlighted Features Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Features</label>
          <ReactQuill 
            theme="snow" 
            value={highlightedFeatures} 
            onChange={handleHighlightedFeaturesChange}
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

        {/* Update Button */}
        <button
          className={`bg-green-500 text-white cursor-pointer px-4 py-2 rounded-md w-full transition-all duration-300 hover:bg-green-600 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpdateProduct}
          disabled={updateLoading}
        >
          {updateLoading ? <GlobalLoading /> : "Update Product"}
        </button>
      </div>

      {/* Media Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Media Gallery</h2>
        
        {/* Media Upload Button */}
        <div className="mb-4">
          <label className={`inline-block bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer flex items-center transition-all duration-300 hover:bg-blue-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isUploading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" /> Upload Media
              </>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <div key={item._id} className="relative group">
              {item.type.startsWith('image/') ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.frontendUrl}`}
                  alt="Media"
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.png';
                  }}
                />
              ) : (
                <video
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.frontendUrl}`}
                  className="w-full h-48 object-cover rounded-md"
                  controls
                />
              )}
              <button
                onClick={() => handleDeleteMedia(item._id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default ProductDetailPage; 