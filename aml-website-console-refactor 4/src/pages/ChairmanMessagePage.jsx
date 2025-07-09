import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaUpload, FaChevronLeft, FaChevronRight, FaSpinner, FaSave, FaSortNumericDown } from "react-icons/fa";
import { fetchGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } from "../api/apiRequest";
import toast from "react-hot-toast";
import ChairmanMessageModal from "../modals/CreateAndUpdateModal/ChairmanMessageModal";
import ReactQuill from "react-quill";
import { registerQuillSizes,sizes } from "../component/globalComponent/reactQuillCustumCompoent";
import ChairmanMessageDeleteModal from "../modals/DeleteModals/ChairmanmessageDeleteModal";

const ChairmanMessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [mainTitle, setMainTitle] = useState("");
  const [mainBanner, setMainBanner] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updateBannerLoading, setUpdateBannerLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingOrderValue, setEditingOrderValue] = useState("");
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 6 };
      const res = await fetchGetRequest("/api/chairman-message/get-messages", params);
      if (res) {
        setMessages(res.data || []);
        setMainTitle(res.title || "");
        setMainBanner(res.banner?.frontendUrl ? `${import.meta.env.VITE_API_BASE_URL}${res.banner.frontendUrl}` : "");
        setMainDescription(res.description || "");
        setTotalPages(res.totalPages || 1);
        setTotalMessages(res.total || 0);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.message || "Error fetching messages");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (id, formData) => {
    const ids = mediaPreviews.map((item)=>item._id)
    formData.append("mediaToKeep", ids);
    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("API base URL is not configured");
      }

      const url = id
        ? `${import.meta.env.VITE_API_BASE_URL}/api/chairman-message/update-message/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/chairman-message/create-message`;

      const res = await fetch(url, {
        method: id ? "PUT" : "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Network error" }));
        throw new Error(
          errorData.message || `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();
      await fetchMessages();
      toast.success(
        id ? "Message updated successfully!" : "Message created successfully!"
      );
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Error submitting form");
      return false;
    }
  };

  const handleDeleteProfile = async (id) => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chairman-message/delete-message/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        await fetchMessages();
        toast.success("Message deleted successfully!");
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.message || "Error deleting message");
    } finally {
      setIsDeleting(false);
    }
  };



      useEffect(() => {
      registerQuillSizes();
    }, []);
  // ... Section config, banner upload, update, delete, order update, etc. (similar to AwardsPage)

  return (
    <div className="min-h-screen bg-gray-50/50 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Chairman's Message</h1>
          <p className="text-gray-500 mt-1">Manage chairman's messages</p>
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
                    onChange={e => setMainTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Chairman's Message Section Title"
                    disabled={updateBannerLoading}
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={mainDescription}
                      onChange={setMainDescription}
                      modules={useMemo(
                        () => ({
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
                            
                            
                          ],
                        }),
                        []
                      )}
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
                              onChange={async e => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setIsUploading(true);
                                const formData = new FormData();
                                formData.append("banner", file);
                                try {
                                  await sendPutRequest("/api/chairman-message/section/update", formData);
                                  const tempUrl = URL.createObjectURL(file);
                                  setMainBanner(tempUrl);
                                  toast.success("Image uploaded successfully!");
                                  await fetchMessages();
                                  URL.revokeObjectURL(tempUrl);
                                } catch (error) {
                                  toast.error(error.message || "Something went wrong during image upload.");
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
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
                            onChange={async e => {
                              const file = e.target.files[0];
                              if (!file) return;
                              setIsUploading(true);
                              const formData = new FormData();
                              formData.append("banner", file);
                              try {
                                await sendPutRequest("/api/chairman-message/section/update", formData);
                                const tempUrl = URL.createObjectURL(file);
                                setMainBanner(tempUrl);
                                toast.success("Image uploaded successfully!");
                                await fetchMessages();
                                URL.revokeObjectURL(tempUrl);
                              } catch (error) {
                                toast.error(error.message || "Something went wrong during image upload.");
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                            disabled={updateBannerLoading || isUploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                {/* Save Button */}
                <button
                  onClick={async () => {
                    if (!mainTitle) {
                      toast.error("Title is required.");
                      return;
                    }
                    setUpdateBannerLoading(true);
                    try {
                      await sendPutRequest("/api/chairman-message/section/update", { title: mainTitle, description: mainDescription });
                      await fetchMessages();
                      toast.success("Updated successfully!");
                    } catch (error) {
                      toast.error(error.message || "Error updating section");
                    } finally {
                      setUpdateBannerLoading(false);
                    }
                  }}
                  disabled={updateBannerLoading}
                  className={`w-full flex justify-center items-center space-x-2 bg-blue-500/10 text-blue-600 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${updateBannerLoading ? "opacity-70" : "hover:bg-blue-500/20"}`}
                >
                  {updateBannerLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* List table with all fields, CRUD actions, modal integration */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                <h2 className="text-lg font-medium text-gray-800">Messages</h2>
                <span className="ml-3 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {totalMessages} items
                </span>
              </div>
          
            </div>
            <button
              onClick={() => {
                setCurrentMessage(null);
                setModalOpen(true);
              }}
              className="flex items-center space-x-1.5 text-sm bg-blue-500/10 text-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <FaPlus className="text-xs" />
              <span>Add Message</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {messages.map((msg, idx) => (
                  <tr key={msg._id || idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(page - 1) * 6 + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {msg.mainImage && msg.mainImage.frontendUrl && (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${msg.mainImage.frontendUrl}`} alt="main" className="w-16 h-10 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800 max-w-xs truncate">{msg.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: msg.message }} />
                    </td>
                  
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800 max-w-xs truncate">{msg.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentMessage(msg);
                            setModalOpen(true);
                          }}
                          className="text-gray-500 hover:text-blue-500 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(msg._id);
                            console.log(msg.id,"msggg");
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
            {/* Pagination - match FormerParticipation style */}
            {messages.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  {/* Mobile Pagination */}
                  <div className="flex justify-between sm:hidden w-full">
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
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-500">
                        Showing <span className="font-medium">{(page - 1) * 6 + 1}</span> to {" "}
                        <span className="font-medium">{Math.min(page * 6, totalMessages)}</span> {" "}
                        of <span className="font-medium">{totalMessages}</span> items
                      </p>
                    </div>
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
          </div>
        </div>
        <ChairmanMessageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          setMediaPreviews={setMediaPreviews}
          mediaPreviews={mediaPreviews}
          newMedia={newMedia}
          setNewMedia={setNewMedia}
          profileData={currentMessage}
          refreshData={fetchMessages}
          onSubmit={handleSubmit}
        />
            <ChairmanMessageDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteId(null);
          }}
          deleteId={deleteId}
          onDelete={handleDeleteProfile}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default ChairmanMessagePage; 