import React, { useState, useEffect, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaSave,
  FaSortNumericDown,
} from "react-icons/fa";
import { BlogModal } from "../modals/CreateAndUpdateModal/BlogModal";
import {
  fetchGetRequest,
  sendPostRequest,
  sendPutRequest,
  sendDeleteRequest,
} from "../api/apiRequest";
import toast, { Toaster } from "react-hot-toast";
import GlobalLoading from "../component/globalComponent/GlobalLoading";
import BlogDeleteModal from "../modals/DeleteModals/BlogDeleteModal";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { registerQuillSizes,sizes } from "../component/globalComponent/reactQuillCustumCompoent";

const BlogPage = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [mainTitle, setMainTitle] = useState("");
  const [mainBanner, setMainBanner] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updateBannerLoading, setUpdateBannerLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blogSummary, setBlogSummary] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    categories: 0,
  });

  const [currentBlog, setCurrentBlog] = useState({
    title: "",
    subtitle: "",
    category: "",
    author: "",
    content: "",
    tags: [],
    status: "draft",
    mainImage: { url: "", type: "image", alt: "" },
    media: [],
  });
  const [deleteId, setDeleteId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingOrderValue, setEditingOrderValue] = useState("");
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "Healthcare",
    "Technology",
    "Research",
    "Education"
  ]);




 
  useEffect(() => {
    fetchBlogs();
  }, [page, selectedCategory, sortBy, sortOrder]);

  const getFrontendUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("\\\\")) {
      // Convert Windows network path to frontend URL
      const fileName = url.split("\\").pop();
      return `${import.meta.env.VITE_API_BASE_URL}/api/blogs/media/${fileName}`;
    }
    return `${import.meta.env.VITE_API_BASE_URL}${url}`;
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        category: selectedCategory || undefined,
        sortBy,
        sortOrder: (sortBy === "order" || sortBy === "date") ? sortOrder : undefined,
      };

      const res = await fetchGetRequest("/api/blogs/get-blogs", params);
      console.log(res, "resss");
      console.log("Blogs API Response:", res); // Debug log

      if (res) {
        const processedBlogs = (res.data || []).map((blog) => ({
          ...blog,
          mainImage: blog.mainImage
            ? {
                ...blog.mainImage,
                url:
                  blog.mainImage.frontendUrl ||
                  getFrontendUrl(blog.mainImage.url),
              }
            : null,
          media: (blog.media || []).map((media) => ({
            ...media,
            url: media.frontendUrl || getFrontendUrl(media.url),
          })),
        }));

        setBlogsData(processedBlogs);
        setMainTitle(res.title || "");
        setMainBanner(
          res.banner?.frontendUrl
            ? `${import.meta.env.VITE_API_BASE_URL}${res.banner.frontendUrl}`
            : getFrontendUrl(res.banner?.url) || ""
        );
        setMainDescription(res.description || "");
        setTotalPages(res.totalPages || 1);

        setBlogSummary({
          totalBlogs: res.totalBlogs || 0,
          publishedBlogs:
            res.data?.filter((blog) => blog.order === "published").length || 0,
          draftBlogs:
            res.data?.filter((blog) => blog.status === "draft").length || 0,
          categories: new Set(res.data?.map((blog) => blog.category)).size || 0,
        });
      } else {
        setBlogsData([]);
        setMainTitle("");
        setMainBanner("");
        setMainDescription("");
        setTotalPages(1);
        setBlogSummary({
          totalBlogs: 0,
          publishedBlogs: 0,
          draftBlogs: 0,
          categories: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(error.message || "Error fetching blogs");

      setBlogsData([]);
      setMainTitle("");
      setMainBanner("");
      setMainDescription("");
      setTotalPages(1);
      setBlogSummary({
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        categories: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/delete-blog/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        await fetchBlogs();
        toast.success("Blog deleted successfully!");
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.message || "Error deleting blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMainBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("banner", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/section/update`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        const tempUrl = URL.createObjectURL(file);
        setMainBanner(tempUrl);
        toast.success("Image uploaded successfully!");
        await fetchBlogs();
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

  const handleMainTitleChange = (e) => {
    setMainTitle(e.target.value);
  };

  const handleMainDescriptionChange = (content) => {
    setMainDescription(content);
  };

  const handleUpdateBannerAndTitle = async () => {
    if (!mainTitle) {
      toast.error("Title is required.");
      return;
    }

    setUpdateBannerLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/section/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: mainTitle,
            description: mainDescription,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchBlogs();
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

  const renderMediaPreview = (media) => {
    if (!media) return null;

    const firstMedia = media;

    // Construct the full image URL
    const imageUrl = firstMedia.frontendUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${firstMedia.frontendUrl}`
      : firstMedia.url || "";

    if (firstMedia.type === "video") {
      return (
        <div className="relative w-20 h-14 bg-gray-100 rounded flex items-center justify-center">
          <FaPlay className="text-gray-400" />
          <span className="absolute bottom-1 right-1 text-xs text-gray-500">
            {media.length > 1 ? `+${media.length - 1}` : ""}
          </span>
        </div>
      );
    }


      
    
    return (
      <div className="relative w-20 h-14">
        <img
          src={imageUrl}
          alt={firstMedia.alt || "Blog media"}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            e.target.style.display = "none";
          }}
        />
        {media.length > 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded">
            +{media.length - 1}
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
        registerQuillSizes();
      }, []);
  const handleOrderUpdate = async (id) => {
    if (!id) return;
    setOrderUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/update-blog/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: editingOrderValue,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await fetchBlogs();
        toast.success("Order updated successfully!");
        setEditingOrderId(null);
        setEditingOrderValue("");
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.message || "Error updating order");
    } finally {
      setOrderUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Blog Management</h1>
          <p className="text-gray-500 mt-1">Manage your company's blog posts</p>
        </div>
        {/* Main Configuration Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
              <h2 className="text-lg font-medium text-gray-800">Main Configuration</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={mainTitle}
                    onChange={handleMainTitleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Our Company Blog"
                    disabled={updateBannerLoading}
                  />
                </div>
                {/* Description - move directly below title */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={mainDescription}
                      onChange={handleMainDescriptionChange}
                      modules={{
                        toolbar: [
                          [{ font: [] }, { size: sizes }],
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
              </div>
              {/* Right Column */}
              <div className="space-y-6">
                {/* Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Banner Image</label>
                  <div className="relative group h-48 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                    {mainBanner ? (
                      <>
                        <img
                          src={mainBanner}
                          alt="Banner preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white/90 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-2 shadow-sm">
                            <FaUpload className="text-xs" />
                            <span>Change Image</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleMainBannerUpload}
                              disabled={updateBannerLoading || isUploading}
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <FaUpload className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 mb-3">Upload banner image</p>
                        <label className="cursor-pointer bg-blue-500/10 text-blue-600 px-4 py-2 rounded-md text-xs font-medium">
                          {isUploading ? (
                            <FaSpinner className="animate-spin mx-auto" />
                          ) : (
                            "Select File"
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleMainBannerUpload}
                            disabled={updateBannerLoading || isUploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                {/* Save Button */}
                <button
                  onClick={handleUpdateBannerAndTitle}
                  disabled={updateBannerLoading}
                  className={`w-full flex justify-center items-center space-x-2 bg-blue-500/10 text-blue-600 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    updateBannerLoading ? "opacity-70" : "hover:bg-blue-500/20"
                  }`}
                >
                  {updateBannerLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Blogs Section */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                <h2 className="text-lg font-medium text-gray-800">Blog Items</h2>
                <span className="ml-3 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {blogSummary.totalBlogs} items
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="font-semibold text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md text-sm font-medium transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="order">Order</option>
                  <option value="date">Date</option>
                  {/* <option value="title">Title</option> */}
                </select>
                <label className="font-semibold text-sm ml-2">Direction:</label>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md text-sm font-medium transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <input
                  type="text"
                  placeholder="Filter by Title"
                  value={titleFilter}
                  onChange={e => setTitleFilter(e.target.value)}
                  className="ml-2 px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentBlog({
                  title: "",
                  subtitle: "",
                  category: "",
                  author: "",
                  content: "",
                  tags: [],
                  status: "draft",
                  mainImage: { url: "", type: "image", alt: "" },
                  media: [],
                });
                setModalOpen(true);
              }}
              className="flex items-center space-x-1.5 text-sm bg-blue-500/10 text-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <FaPlus className="text-xs" />
              <span>Add Blog</span>
            </button>
          </div>
          {/* Loading State */}
          {/* {isLoading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="text-center space-y-3">
                <FaSpinner className="animate-spin text-2xl text-blue-400 mx-auto" />
                <p className="text-gray-500 text-sm">Loading blogs...</p>
              </div>
            </div>
          ) : (
            <> */}
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Media
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {blogsData
                      .filter(blog =>
                        !titleFilter || blog.title?.toLowerCase().includes(titleFilter.toLowerCase())
                      )
                      .map((blog, index) => (
                        <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(page - 1) * 6 + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderMediaPreview(blog?.mainImage)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-800 max-w-xs truncate">
                              {blog.title}
                            </div>
                            <div
                              className="text-xs text-gray-500 mt-1 line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: blog.subtitle || blog.content || '',
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingOrderId === blog._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={editingOrderValue}
                                  onChange={(e) => setEditingOrderValue(e.target.value)}
                                  onBlur={() => handleOrderUpdate(blog._id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleOrderUpdate(blog._id);
                                    if (e.key === "Escape") {
                                      setEditingOrderId(null);
                                      setEditingOrderValue("");
                                    }
                                  }}
                                  className="w-16 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                                  autoFocus
                                  disabled={orderUpdating}
                                />
                                {orderUpdating && (
                                  <FaSpinner className="animate-spin text-blue-400 text-xs" />
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingOrderId(blog._id);
                                  setEditingOrderValue(blog.order);
                                }}
                                className="flex items-center space-x-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <FaSortNumericDown className="text-gray-400" />
                                <span>{blog.order}</span>
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {blog.date ? new Date(blog.date).toLocaleDateString() : ""}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {blog.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentBlog(blog);
                                  setModalOpen(true);
                                }}
                                className="text-gray-500 hover:text-blue-500 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteId(blog._id);
                                  setDeleteModalOpen(true);
                                }}
                                className="text-gray-500 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Empty State */}
              {blogsData?.length === 0 && (
                <div className="p-12 text-center">
                  <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-700 mb-1">
                    No blog items yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Create your first blog post to showcase your company
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                      <FaPlus className="-ml-1 mr-2" />
                      Add Blog Item
                    </button>
                  </div>
                </div>
              )}
              {/* Pagination */}
              {blogsData?.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-3 py-1.5 border border-gray-200 text-xs font-medium rounded text-gray-700 bg-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="ml-3 relative inline-flex items-center px-3 py-1.5 border border-gray-200 text-xs font-medium rounded text-gray-700 bg-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        Showing <span className="font-medium">{(page - 1) * 6 + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(page * 6, blogsData.length * totalPages)}</span> of <span className="font-medium">{blogsData.length * totalPages}</span> items
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <FaChevronLeft className="h-3 w-3" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`relative inline-flex items-center px-3 py-1.5 border text-xs font-medium ${
                              page === p
                                ? "z-10 bg-blue-50 border-blue-300 text-blue-600"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <FaChevronRight className="h-3 w-3" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            {/* </> */}
          {/* )} */}
        </div>
        {/* Modals */}
        <BlogModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          blogData={currentBlog}
          setBlogData={setCurrentBlog}
          refreshData={fetchBlogs}
          setMediaPreviews={setMediaPreviews}
          mediaPreviews={mediaPreviews}
          setNewMedia={setNewMedia}
          newMedia={newMedia}
        />
        <BlogDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteId(null);
          }}
          deleteId={deleteId}
          onDelete={handleDeleteBlog}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default BlogPage;