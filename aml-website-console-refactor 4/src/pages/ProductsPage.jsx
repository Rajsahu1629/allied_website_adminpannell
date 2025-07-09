import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaUpload, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { fetchGetRequest } from "../api/apiRequest";
import toast, { Toaster } from "react-hot-toast";
import GlobalLoading from "../component/globalComponent/GlobalLoading";
import CategoryModal from "../modals/CreateAndUpdateModal/CategoryModal";
import CategoryDeleteModal from "../modals/DeleteModals/CategoryDeleteModal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [categoriesData, setCategoriesData] = useState([]);
  const [mainTitle, setMainTitle] = useState("");
  const [mainBanner, setMainBanner] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updateBannerLoading, setUpdateBannerLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("position");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    title: "",
    description: "",
    banner: { url: "", frontendUrl: "" },
    position: 0
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page, 
        limit: 10,
        sortBy
      };
      const res = await fetchGetRequest('/api/products/get-categories', params);
      console.log("res======>>", res)
      if (res && res.status) {
        setCategoriesData(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Error fetching products");
      
      setProductsData([]);
      setMainTitle("");
      setMainBanner("");
      setMainDescription("");
      setTotalPages(1);
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

  const handleMainBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const tempUrl = URL.createObjectURL(file);
        setMainBanner(tempUrl);
        toast.success("Image uploaded successfully!");
        await fetchProducts();
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

  const handleUpdateBannerAndTitle = async () => {
    if (!mainTitle) {
      toast.error("Title is required.");
      return;
    }

    setUpdateBannerLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/categories`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: mainTitle,
          description: mainDescription
        })
      });

      const data = await res.json();

      if (res.ok) {
        await fetchProducts();
        toast.success("Updated successfully!");
      } else {
        toast.error(data.message || "Failed to update section");
      }
    } catch (error) {
      console.error("Error updating main section:", error);
      toast.error(error.message || "Error updating section");
    } finally {
      setUpdateBannerLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/delete-category/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok) {
        await fetchProducts();
        toast.success("Product deleted successfully!");
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (  
    <div className="p-4 lg:w-[80%] m-auto">
      <h1 className="text-3xl lg:text-4xl text-blue-950 underline font-bold text-center mb-4">
        Products Management
      </h1>

      {/* Main Banner & Text Section */}
      <div className="mt-[50px] rounded-lg p-6 shadow-lg mb-6 mx-auto bg-[#BFDBFE] transform transition-all duration-300 hover:shadow-xl">
        {/* Banner Upload */}
        <div className="relative w-full mb-4">
          {mainBanner ? (
            <img
              src={mainBanner.startsWith('http') ? 
                mainBanner : 
                `${import.meta.env.VITE_API_BASE_URL}${mainBanner}`}
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
          disabled={updateBannerLoading}
        />

        {/* Main Description Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Description *</label>
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

        {/* Update Button */}
        <button
          className={`bg-green-500 text-white cursor-pointer px-4 py-2 rounded-md w-full transition-all duration-300 hover:bg-green-600 ${updateBannerLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpdateBannerAndTitle}
          disabled={updateBannerLoading}
        >
          {updateBannerLoading ? <GlobalLoading /> : "Update"}
        </button>
      </div>

      {/* Add New Product Button */}
      <div className="flex mt-[50px] justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center transition-all duration-300 hover:bg-blue-600 hover:shadow-md"
          onClick={() => {
            setCurrentProduct({
              title: "",
              description: "",
              banner: { url: "", frontendUrl: "" },
              position: 0
            });
            setModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" /> Add New Product
        </button>
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-yellow-400 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-bold">S.No</th>
              <th className="px-4 py-2 text-left w-[100px] text-sm font-bold">Image</th>
              <th className="px-4 py-2 text-left text-sm font-bold">Title</th>
              <th className="px-4 py-2 text-left text-sm font-bold">Description</th>
              <th className="px-4 py-2 text-left text-sm font-bold">Highlighted Features</th>
              <th className="px-4 py-2 text-left text-sm font-bold">No. of Products</th>
              <th className="px-4 py-2 text-left text-sm font-bold">Position</th>
              <th className="px-4 py-2 text-left text-sm font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {productsData?.map((product, index) => (
              <tr key={product._id}>
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 w-[100px] py-2">
                  <img
                    // src={category.banner?.frontendUrl ? 
                    //   (category.banner.frontendUrl.startsWith('http') ? 
                    //     category.banner.frontendUrl : 
                    //     `${import.meta.env.VITE_API_BASE_URL}${category.banner.frontendUrl}`) : 
                    //   '/placeholder.png'}
                    alt={category.title}
                    className="w-20 h-14 w-[100px] rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-sm">{category.title}</td>
                <td className="px-4 py-2 text-sm">{category.description}</td>
                <td className="px-4 py-2 text-sm">{category.position}</td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-2">
                  
                    <button
                      onClick={() => navigate(`/products/${category._id}`)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white p-1.5 rounded-md transition"
                    >
                    
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(product._id);
                        setDeleteModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white p-1.5 rounded-md transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {!isLoading && productsData?.length > 0 && (
        <div className="flex justify-center mt-6 space-x-2 items-center">
          <button
            className={`px-3 py-3 flex items-center rounded-full shadow-md transition-all duration-300 ${
              page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <FaChevronLeft className="text-lg" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`h-[50px] w-[50px] rounded-full shadow-md transition-all duration-300 ${
                page === index + 1 
                  ? "bg-blue-600 text-white font-bold shadow-lg" 
                  : "bg-gray-200 hover:bg-gray-300 hover:shadow-lg"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-3 py-3 flex items-center rounded-full shadow-md transition-all duration-300 ${
              page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <FaChevronRight className="text-lg" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productData={currentProduct}
        setProductData={setCurrentProduct}
        refreshData={fetchProducts}
      />
      <ProductDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
        deleteId={deleteId}
        onDelete={handleDeleteProduct}
        isDeleting={isDeleting}
      />
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

export default ProductsPage; 