import React, { useState, useEffect, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaPlay,
  FaImage,
  FaSave,
  FaSortNumericDown
} from "react-icons/fa";
import {
  fetchGetRequest,
  sendPostRequest,
  sendPutRequest,
  sendDeleteRequest,
} from "../api/apiRequest";
import toast from "react-hot-toast";
import GlobalLoading from "../component/globalComponent/GlobalLoading";
import CompanyProfileDeleteModal from "../modals/DeleteModals/CompanyProfileDeleteModal";
import ReactQuill, { Quill } from "react-quill";
import { registerQuillSizes,sizes } from "../component/globalComponent/reactQuillCustumCompoent";
import UpcommingEventModal from "../modals/CreateAndUpdateModal/UpcommingEventModal";

const UpcommingEvents = () => {
  const [profileData, setProfileData] = useState([]);
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
  const [currentProfile, setCurrentProfile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingOrderValue, setEditingOrderValue] = useState("");
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  useEffect(() => {
    fetchProfiles();
  }, [page, selectedCategory, sortBy, sortOrder]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        sortBy,
        sortOrder: sortBy === "order" ? sortOrder : undefined,
      };

      const res = await fetchGetRequest(
        "/api/upcoming-events/get-upcoming-events",
        params
      );
      if (res) {
        setProfileData(res.data || []);
        setMainTitle(res.title || "");
        setMainBanner(
          res.banner?.frontendUrl
            ? `${import.meta.env.VITE_API_BASE_URL}${res.banner.frontendUrl}`
            : ""
        );
        setMainDescription(res.description || "");
        setTotalPages(res.totalPages || 1);
        setTotalProfiles(res.totalProfiles || 0);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error(error.message || "Error fetching profiles");
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
    formData.append("banner", file);

    try {
      await sendPutRequest("/api/upcoming-events/section/update", formData);
      const tempUrl = URL.createObjectURL(file);
      setMainBanner(tempUrl);
      toast.success("Image uploaded successfully!");
      await fetchProfiles();
      URL.revokeObjectURL(tempUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Something went wrong during image upload.");
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
      await sendPutRequest("/api/upcoming-events/section/update", {
        title: mainTitle,
        description: mainDescription,
      });
      await fetchProfiles();
      toast.success("Updated successfully!");
    } catch (error) {
      console.error("Error updating main section:", error);
      toast.error(error.message || "Error updating section");
    } finally {
      setUpdateBannerLoading(false);
    }
  };

  const handleDeleteProfile = async (id) => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await sendDeleteRequest(`/api/upcoming-events/delete-upcoming-event/${id}`);
      await fetchProfiles();
      toast.success("Event deleted successfully!");
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Error deleting event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (id, formData) => {
    const ids = mediaPreviews.map((item)=>item._id)
    formData.append("mediaToKeep",ids);
    try {
      let data;
      if (id) {
        data = await sendPutRequest(`/api/upcoming-events/update-upcoming-event/${id}`, formData);
      } else {
        data = await sendPostRequest("/api/upcoming-events/create-upcoming-event", formData);
      }
      await fetchProfiles();
      toast.success(id ? "Event updated successfully!" : "Event created successfully!");
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Error submitting form");
      return false;
    }
  };

  const renderMediaPreview = (media) => {
    if (!media || media.length === 0) {
      return (
        <div className="relative w-16 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
          <FaImage className="text-gray-300 text-sm" />
        </div>
      );
    }

    const firstMedia = media[0];
    const imageUrl = firstMedia.frontendUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${firstMedia.frontendUrl}`
      : firstMedia.url || "";

    if (firstMedia.type === "video") {
      return (
        <div className="relative w-16 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <FaPlay className="text-gray-400 text-xs" />
          </div>
          {media.length > 1 && (
            <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">
              +{media.length - 1}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-100">
        <img
          src={imageUrl}
          alt={firstMedia.alt || "Profile media"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentElement.innerHTML = `
              <div class=\"w-full h-full bg-gray-50 flex items-center justify-center\">
                <FaImage class=\"text-gray-300 text-sm\"/>
              </div>
            `;
          }} 
        />
        {media.length > 1 && (
          <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">
            +{media.length - 1}
          </div>
        )}
      </div>
    );
  };

  const handleOrderUpdate = async (profileId) => {
    if (!editingOrderValue || isNaN(editingOrderValue)) {
      toast.error("Order must be a number.");
      return;
    }
    setOrderUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/upcoming-events/update-upcoming-event/${profileId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: Number(editingOrderValue) }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Order updated!");
        setEditingOrderId(null);
        setEditingOrderValue("");
        await fetchProfiles();
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch (error) {
      toast.error(error.message || "Error updating order");
    } finally {
      setOrderUpdating(false);
    }
  };

  useEffect(() => {
    registerQuillSizes();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50/50 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Upcoming Events</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming events and activities</p>
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={mainTitle}
                    onChange={handleMainTitleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    placeholder="Our Company Profile"
                    disabled={updateBannerLoading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={mainDescription}
                      onChange={handleMainDescriptionChange}
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Banner Image
                  </label>
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

        {/* Profiles Section */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-400 mr-3"></div>
                <h2 className="text-lg font-medium text-gray-800">Profile Items</h2>
                <span className="ml-3 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {totalProfiles} items
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
                {/* Filter Inputs */}
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
                setCurrentProfile(null);
                setModalOpen(true);
              }}
              className="flex items-center space-x-1.5 text-sm bg-blue-500/10 text-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <FaPlus className="text-xs" />
              <span>Add Profile</span>
            </button>
          </div>

          {/* Loading State */}
          {/* {isLoading ? (
            <div className=" ">
              <div className="text-center space-y-3">
                <FaSpinner className="animate-spin text-2xl text-blue-400 " />
                <p className="text-gray-500 text-sm">Loading profiles...</p>
              </div>
            </div>
          ) : ( */}
            {/* <> */}
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {profileData
                      .filter(profile =>
                        (!titleFilter || profile.title?.toLowerCase().includes(titleFilter.toLowerCase()))
                      )
                      .map((profile, index) => (
                        <tr key={profile._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(page - 1) * 6 + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderMediaPreview(profile.media)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-800 max-w-xs truncate">
                              {profile.title}
                            </div>
                            <div
                              className="text-xs text-gray-500 mt-1 line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: profile?.description,
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.date ? new Date(profile.date).toLocaleDateString() : ''}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.tag}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingOrderId === profile._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={editingOrderValue}
                                  onChange={(e) => setEditingOrderValue(e.target.value)}
                                  onBlur={() => handleOrderUpdate(profile._id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleOrderUpdate(profile._id);
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
                                  setEditingOrderId(profile._id);
                                  setEditingOrderValue(profile.order);
                                }}
                                className="flex items-center space-x-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <FaSortNumericDown className="text-gray-400" />
                                <span>{profile.order}</span>
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentProfile(profile);
                                  setModalOpen(true);
                                }}
                                className="text-gray-500 hover:text-blue-500 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteId(profile._id);
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
              {profileData?.length === 0 && (
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
                    No profile items yet
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Create your first profile item to showcase your company
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                      <FaPlus className="-ml-1 mr-2" />
                      Add Profile Item
                    </button>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {profileData?.length > 0 && (
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
                          Showing <span className="font-medium">{(page - 1) * 6 + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(page * 6, totalProfiles)}
                          </span>{" "}
                          of <span className="font-medium">{totalProfiles}</span> items
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
            {/* </> */}
          {/* )} */}
        </div>

        {/* Modals */}
        <UpcommingEventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          setMediaPreviews={setMediaPreviews}
          mediaPreviews={mediaPreviews}
          newMedia={newMedia}
          setNewMedia={setNewMedia}
          profileData={currentProfile}
          setProfileData={setCurrentProfile}
          refreshData={fetchProfiles}
          onSubmit={handleSubmit}
        />
        <CompanyProfileDeleteModal
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

export default UpcommingEvents;