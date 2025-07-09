import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Settings,
  Grid,
  List,
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
  const [viewMode, setViewMode] = useState("grid");
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

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

  // Continue with existing functions...
  const handleMainSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", mainForm.title);
      formData.append("description", mainForm.description);

      mainForm.media.forEach(file => {
        formData.append("media", file);
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

  const handleDeleteEntireSection = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the entire ChooseUs section? This action cannot be undone."
      )
    ) return;

    try {
      setLoading(true);
      const result = await sendDeleteRequest("/api/chooseus");

      if (result.success) {
        await fetchChooseUsData();
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const validTypes = ['image/', 'video/'];
      return validTypes.some(type => file.type.startsWith(type));
    });

    if (validFiles.length !== files.length) {
      setError("Some files were skipped. Only image and video files are allowed.");
    }

    setMainForm(prev => ({
      ...prev,
      media: [...prev.media, ...validFiles]
    }));
  };

  const removeMediaFile = (index) => {
    setMainForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const startEditingCard = (card) => {
    setEditingCard(card.id);
    setCardForm({
      title: card.title,
      description: card.description,
      sequence: card.sequence,
    });
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setCardForm({ title: "", description: "", sequence: 1 });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  useEffect(() => {
    fetchChooseUsData();
  }, [searchTerm, sortBy, sortOrder, pagination.currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-allied mb-2">
                Why Choose Us Section
              </h1>
              <p className="text-secondary-600 text-lg">
                Manage the main section content and feature cards
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary-200">
                <Star className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-secondary-600">
                  Content Management
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-white/80 text-secondary-600 hover:bg-primary-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-white/80 text-secondary-600 hover:bg-primary-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center shadow-soft"
            >
              <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
              <span className="text-error-700 flex-1">{error}</span>
              <motion.button
                onClick={() => setError(null)}
                className="text-error-500 hover:text-error-700 p-1 rounded-lg hover:bg-error-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Main Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated mb-8"
        >
          <motion.div
            className="p-6 border-b border-primary-200/60 cursor-pointer hover:bg-primary-50/50 transition-colors"
            onClick={() => setIsMainSectionExpanded(!isMainSectionExpanded)}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-800">
                    Main Section Content
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Configure the header and description
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEntireSection();
                  }}
                  className="text-error-600 hover:text-error-800 p-2 rounded-lg hover:bg-error-50 transition-colors"
                  title="Delete Entire Section"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                <motion.div
                  animate={{ rotate: isMainSectionExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-secondary-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isMainSectionExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6">
                  <form onSubmit={handleMainSectionSubmit} className="space-y-6">
                    {/* Main Title */}
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
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
                        className="input-modern w-full"
                        placeholder="Enter main title"
                      />
                    </motion.div>

                    {/* Main Description */}
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
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
                        className="input-modern w-full resize-none"
                        placeholder="Enter main description"
                      />
                    </motion.div>

                    {/* Enhanced Media Upload */}
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Media Files
                      </label>
                      <div className="border-2 border-dashed border-primary-300 rounded-xl p-6 bg-primary-50/30 hover:bg-primary-50/50 transition-colors">
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
                          <motion.div
                            className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Upload className="w-6 h-6 text-primary-600" />
                          </motion.div>
                          <span className="text-secondary-700 font-medium">
                            Click to upload media files
                          </span>
                          <span className="text-xs text-secondary-500 mt-1">
                            Supports images and videos
                          </span>
                        </label>

                        {/* Enhanced Media Preview */}
                        <AnimatePresence>
                          {mainForm.media.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                              {mainForm.media.map((file, index) => (
                                <motion.div
                                  key={index}
                                  className="relative group"
                                  whileHover={{ scale: 1.05 }}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="w-full h-24 rounded-lg overflow-hidden shadow-soft">
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
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <motion.button
                                    type="button"
                                    onClick={() => removeMediaFile(index)}
                                    className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X className="w-3 h-3" />
                                  </motion.button>
                                  <p className="text-xs text-secondary-500 mt-1 truncate">
                                    {file instanceof File ? file.name : file.alt}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Enhanced Submit Button */}
                    <motion.div
                      className="flex justify-end"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Main Section</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cards Section - Enhanced */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated"
        >
          <div className="p-6 border-b border-primary-200/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-800">
                    Feature Cards
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Manage individual feature cards
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowAddCard(true)}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Card</span>
              </motion.button>
            </div>

            {/* Search and Controls */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="input-modern pl-10 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-modern"
                >
                  <option value="sequence">Sort by Sequence</option>
                  <option value="title">Sort by Title</option>
                  <option value="created">Sort by Created</option>
                </select>
                <motion.button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="btn-secondary p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </motion.button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Add Card Form */}
            <AnimatePresence>
              {showAddCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="card bg-primary-50/50 border border-primary-200/60 p-6">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                      Add New Card
                    </h3>
                    <form onSubmit={handleAddCard} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                            className="input-modern w-full"
                            placeholder="Enter card title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                            className="input-modern w-full"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                          className="input-modern w-full resize-none"
                          placeholder="Enter card description"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Add Card</span>
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setShowAddCard(false)}
                          className="btn-secondary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cards Display */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}
            >
              {chooseUsData?.cards?.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  className="card hover-lift"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {card.sequence}
                        </span>
                      </div>
                      <h3 className="font-semibold text-secondary-800">
                        {card.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        onClick={() => startEditingCard(card)}
                        className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 rounded-lg text-error-600 hover:bg-error-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-secondary-500">
                      {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : "No date"}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-secondary-500">Featured</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {!loading && (!chooseUsData?.cards || chooseUsData.cards.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-medium text-secondary-800 mb-2">
                  No cards yet
                </h3>
                <p className="text-secondary-600 mb-4">
                  Start by adding your first feature card to showcase your benefits.
                </p>
                <motion.button
                  onClick={() => setShowAddCard(true)}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Your First Card
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
