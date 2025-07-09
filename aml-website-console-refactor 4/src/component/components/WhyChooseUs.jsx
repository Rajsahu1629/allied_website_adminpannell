import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  fetchGetRequest,
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api/apiRequest";

const WhyChooseUs = () => {
  const [chooseUsData, setChooseUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMainSectionExpanded, setIsMainSectionExpanded] = useState(true);
  const [isCardsExpanded, setIsCardsExpanded] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("sequence");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Form states
  const [mainForm, setMainForm] = useState({
    mainTitle: "",
    mainDescription: "",
    media: [],
  });

  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    sequence: 1,
  });

  // Fetch ChooseUs data
  const fetchChooseUsData = async () => {
    try {
      setLoading(true);
      const result = await fetchGetRequest(
        `/api/chooseus?search=${encodeURIComponent(
          searchTerm
        )}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${
          pagination.currentPage
        }&limit=${pagination.itemsPerPage}`
      );
      if (result.success) {
        setChooseUsData(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
        setMainForm({
          mainTitle: result.data.mainTitle || "",
          mainDescription: result.data.mainDescription || "",
          media: result.data.media || [],
        });
        setError(null);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create/Update main ChooseUs section
const handleMainSectionSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", mainForm.title); // Adjust based on your actual keys
    formData.append("description", mainForm.description);

    mainForm.media.forEach(file => {
      formData.append("media", file); // backend must expect 'media' as array or multiple files
    });

    const result = await sendPostRequest("/api/chooseus", formData);

    if (result.success) {
      await fetchChooseUsData();
      setError(null);
    } else {
      setError(result.error || "Failed to save main section");
    }
  } catch (err) {
    setError("Network error: " + err.message);
  } finally {
    setLoading(false);
  }
};


  // Add new card
  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", cardForm.title);
      formData.append("description", cardForm.description);
      formData.append("sequence", cardForm.sequence.toString());

      const result = await sendPatchRequest(`/api/chooseus/cards`, {
        formData,
      });

      if (result.success) {
        await fetchChooseUsData();
        setShowAddCard(false);
        setCardForm({ title: "", description: "", sequence: 1 });
        setError(null);
      } else {
        setError(result.error || "Failed to add card");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update card
  const handleUpdateCard = async (cardId, e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", cardForm.title);
      formData.append("description", cardForm.description);
      formData.append("sequence", cardForm.sequence.toString());

      const result = await sendPatchRequest(`/api/chooseus/cards/${cardId}`, {
        formData,
      });

      if (result.success) {
        await fetchChooseUsData();
        setEditingCard(null);
        setCardForm({ title: "", description: "", sequence: 1 });
        setError(null);
      } else {
        setError(result.error || "Failed to update card");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete card
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      setLoading(true);
      const result = await sendDeleteRequest(`/api/chooseus/cards/${cardId}`);

      if (result.success) {
        await fetchChooseUsData();
        setError(null);
      } else {
        setError(result.error || "Failed to delete card");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete entire ChooseUs section
  const handleDeleteEntireSection = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the entire ChooseUs section? This action cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      const result = await sendDeleteRequest(`/api/chooseus`);
      if (result.success) {
        setChooseUsData(null);
        setMainForm({
          mainTitle: "",
          mainDescription: "",
          media: [],
        });
        setError(null);
      } else {
        setError(result.error || "Failed to delete section");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  // Enforce media limit of 10
  // if (mediaPreviews.length + newMedia.length + files.length > 10) {
  //   toast.error("You can only upload up to 10 media items");
  //   return;
  // }

  // Append files to mainForm.media
  setMainForm(prev => ({
    ...prev,
    media: [...prev.media, ...files],
  }));
};
  
  // Remove media file
  const removeMediaFile = (index) => {
    setMainForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  // Start editing card
  const startEditingCard = (card) => {
    setEditingCard(card._id);
    setCardForm({
      title: card.title,
      description: card.description,
      sequence: card.sequence,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCard(null);
    setShowAddCard(false);
    setCardForm({ title: "", description: "", sequence: 1 });
  };

  // Handle search and sort changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchChooseUsData();
  }, [searchTerm, sortBy, sortOrder, pagination.currentPage]);

  if (loading && !chooseUsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading ChooseUs data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Why Choose Us Section
        </h1>
        <p className="text-gray-600">
          Manage the main section content and cards
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div
          className="p-6 border-b border-gray-200 cursor-pointer"
          onClick={() => setIsMainSectionExpanded(!isMainSectionExpanded)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Main Section Content
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEntireSection();
                }}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                title="Delete Entire Section"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {isMainSectionExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {isMainSectionExpanded && (
          <div className="p-6">
            <form onSubmit={handleMainSectionSubmit} className="space-y-6">
              {/* Main Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={mainForm.mainTitle}
                  onChange={(e) =>
                    setMainForm((prev) => ({
                      ...prev,
                      mainTitle: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter main title"
                />
              </div>

              {/* Main Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Description
                </label>
                <textarea
                  value={mainForm.mainDescription}
                  onChange={(e) =>
                    setMainForm((prev) => ({
                      ...prev,
                      mainDescription: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter main description"
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload media files
                    </span>
                  </label>

                  {/* Media Preview */}
                  {mainForm.media.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mainForm.media.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-24 rounded-lg overflow-hidden">
                            {file instanceof File ? (
                              file.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={URL.createObjectURL(file)}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : file.type === "image" ? (
                              <img
                                src={file.frontendUrl}
                                alt={file.alt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={file.frontendUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMediaFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {file instanceof File ? file.name : file.alt}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Main Section
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          className="p-6 border-b border-gray-200 cursor-pointer"
          onClick={() => setIsCardsExpanded(!isCardsExpanded)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Cards Management
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddCard(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </button>
              {isCardsExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {isCardsExpanded && (
          <div className="p-6">
            {/* Search and Sort */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <button
                  onClick={() => handleSortChange("sequence")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === "sequence"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Sequence{" "}
                  {sortBy === "sequence" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSortChange("title")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === "title"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Title{" "}
                  {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>

            {/* Add Card Form */}
            {showAddCard && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Card
                </h3>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={cardForm.title}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sequence
                      </label>
                      <input
                        type="number"
                        value={cardForm.sequence}
                        onChange={(e) =>
                          setCardForm((prev) => ({
                            ...prev,
                            sequence: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={cardForm.description}
                      onChange={(e) =>
                        setCardForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Add Card
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Cards List */}
            <div className="space-y-4">
              {chooseUsData?.cards?.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No cards yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add your first card to get started.
                  </p>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center mx-auto"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Card
                  </button>
                </div>
              ) : (
                chooseUsData?.cards?.map((card) => (
                  <div
                    key={card._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingCard === card._id ? (
                      // Edit Form
                      <form
                        onSubmit={(e) => handleUpdateCard(card._id, e)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={cardForm.title}
                              onChange={(e) =>
                                setCardForm((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sequence
                            </label>
                            <input
                              type="number"
                              value={cardForm.sequence}
                              onChange={(e) =>
                                setCardForm((prev) => ({
                                  ...prev,
                                  sequence: parseInt(e.target.value) || 1,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={cardForm.description}
                            onChange={(e) =>
                              setCardForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Card
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {card.title}
                            </h3>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              #{card.sequence}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {card.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => startEditingCard(card)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                            title="Edit Card"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                            title="Delete Card"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} cards
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        pagination.currentPage === index + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      loading
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && chooseUsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyChooseUs;
