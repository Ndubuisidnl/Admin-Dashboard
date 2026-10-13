"use client";

import React, { useState, useTransition } from "react";
import { MenuItem, MenuCategory } from "@/lib/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Clock,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import {
  createMenuItemAction,
  updateMenuItemAction,
  toggleMenuItemAvailabilityAction,
  deleteMenuItemAction,
} from "@/lib/actions/menu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";

const categories: { label: string; value: MenuCategory | "all" }[] = [
  { label: "All Items", value: "all" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Burgers", value: "burgers" },
  { label: "Sandwiches", value: "sandwiches" },
  { label: "Main Dishes", value: "main-dishes" },
  { label: "Pasta", value: "pasta" },
  { label: "Rice", value: "rice" },
  { label: "Chicken", value: "chicken" },
  { label: "Snacks", value: "snacks" },
  { label: "Coffee", value: "coffee" },
  { label: "Drinks", value: "drinks" },
  { label: "Desserts", value: "desserts" },
];

interface MenuManagerClientProps {
  initialItems: MenuItem[];
}

export function MenuManagerClient({ initialItems }: MenuManagerClientProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.image_url);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    startTransition(async () => {
      const res = await toggleMenuItemAvailabilityAction(item.id, item.available);
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
        );
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    startTransition(async () => {
      const res = await deleteMenuItemAction(itemToDelete.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        setItemToDelete(null);
      }
    });
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image_file");
    let uploadedPath: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
      if (!allowedTypes.includes(imageFile.type)) {
        setFormError("Choose a JPG, PNG, WebP, or AVIF image.");
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setFormError("Image files must be 5 MB or smaller.");
        return;
      }
    }

    startTransition(async () => {
      if (imageFile instanceof File && imageFile.size > 0) {
        const extensions: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/avif": "avif",
        };
        const supabase = createClient();
        uploadedPath = `menu-items/${crypto.randomUUID()}.${extensions[imageFile.type]}`;
        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(uploadedPath, imageFile, { contentType: imageFile.type, upsert: false });
        if (uploadError) {
          setFormError(`Image upload failed: ${uploadError.message}`);
          return;
        }
        formData.set("image_url", supabase.storage.from("menu-images").getPublicUrl(uploadedPath).data.publicUrl);
      } else {
        formData.set("image_url", editingItem?.image_url || "");
      }
      formData.delete("image_file");

      let res;
      if (editingItem) {
        res = await updateMenuItemAction(editingItem.id, formData);
      } else {
        res = await createMenuItemAction(formData);
      }

      if (res.error) {
        setFormError(res.error);
      } else {
        setIsModalOpen(false);
        // Refresh page data
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-wood">
            Menu Catalog Management
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Add, update prices, manage tags, and toggle item availability live.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-xl text-xs text-text-dark focus:outline-none focus:ring-2 focus:ring-warm-amber w-60"
            />
          </div>

          {/* Add New Item Button */}
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? "bg-dark-wood text-light-caramel shadow-xs"
                : "bg-warm-white text-text-muted hover:bg-cream-card hover:text-dark-wood border border-border-warm"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-warm-white rounded-2xl border border-dashed border-border-warm p-8">
          <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-serif font-bold text-dark-wood">
            No menu items found
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No dishes match "${searchQuery}". Try clearing your search.`
              : "No items added to this category yet. Click 'Add Menu Item' to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-warm-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs ${
                item.available
                  ? "border-border-warm hover:shadow-md"
                  : "border-gray-200 opacity-75 bg-gray-50/50"
              }`}
            >
              <div>
                {/* Image Placeholder Banner */}
                <div className="h-40 bg-cream-card border-b border-border-warm relative flex items-center justify-center overflow-hidden group">
                  {item.image_url ? <img src={item.image_url} alt={item.image_label || item.name} className="h-full w-full object-cover" /> : <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-warm-brown/40 mx-auto mb-1" />
                    <span className="text-[11px] font-medium text-text-muted italic block">
                      {item.image_label || item.name}
                    </span>
                  </div>}

                  {/* Featured Tag */}
                  {item.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-warm-amber text-dark-wood text-[10px] font-bold rounded-full shadow-xs flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}

                  {/* Category Pill */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-dark-wood/80 text-light-caramel text-[10px] font-semibold rounded-full capitalize">
                    {item.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-dark-wood leading-tight">
                      {item.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-base text-warm-amber">
                        ₦{Number(item.price).toLocaleString("en-NG")}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Prep Time & Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-text-muted">
                    {item.preparation_time && (
                      <span className="flex items-center space-x-1 font-medium bg-cream px-2 py-0.5 rounded border border-border-warm">
                        <Clock className="w-3 h-3 text-warm-brown" />
                        <span>{item.preparation_time} min</span>
                      </span>
                    )}
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-cream-card px-2 py-0.5 rounded text-warm-brown font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="px-5 py-3.5 bg-cream/60 border-t border-border-warm flex items-center justify-between">
                {/* Availability Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item)}
                  disabled={isPending}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    item.available
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {item.available ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Out of Stock</span>
                    </>
                  )}
                </button>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-text-muted hover:text-dark-wood hover:bg-cream-card rounded-lg transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Archive Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Menu Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-warm-white rounded-2xl shadow-2xl max-w-xl w-full border border-border-warm overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-espresso text-light-caramel border-b border-warm-amber/20 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingItem ? "Edit Menu Item" : "Create New Menu Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream-card/70 hover:text-white text-sm"
              >
                âœ•
              </button>
            </div>

            <form
              onSubmit={handleSubmitForm}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium">
                  {formError}
                </div>
              )}

              {/* Item Name */}
              <div>
                <label className="block font-semibold text-text-dark mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingItem?.name || ""}
                  placeholder="e.g. Wood House Signature Burger"
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>

              {/* Category & Category Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingItem?.category || "burgers"}
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs capitalize"
                  >
                    {categories
                      .filter((c) => c.value !== "all")
                      .map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Prep Time (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="preparation_time"
                    defaultValue={editingItem?.preparation_time || ""}
                    placeholder="Minutes"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
              </div>
              {/* Price */}
              <div>
                <label className="block font-semibold text-text-dark mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  step="1"
                  name="price"
                  required
                  defaultValue={editingItem?.price || ""}
                  placeholder="4500"
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-text-dark mb-1">
                  Item Description *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingItem?.description || ""}
                  placeholder="Detailed breakdown of ingredients, flavor profile, and side serving..."
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-text-dark mb-1">Menu Image</label>
                <input
                  type="file"
                  name="image_file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setImagePreview(file ? URL.createObjectURL(file) : editingItem?.image_url || null);
                  }}
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs file:mr-3 file:rounded-md file:border-0 file:bg-warm-amber file:px-3 file:py-1 file:font-semibold"
                />
                <p className="mt-1 text-[10px] text-text-muted">JPG, PNG, WebP, or AVIF. Maximum size: 5 MB.</p>
                {imagePreview && <img src={imagePreview} alt="Menu item preview" className="mt-3 h-28 w-40 rounded-lg border border-border-warm object-cover" />}
              </div>
              {/* Image Label & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Image Label / Description
                  </label>
                  <input
                    type="text"
                    name="image_label"
                    defaultValue={editingItem?.image_label || ""}
                    placeholder="e.g. Juicy beef patty with melted cheese"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingItem?.tags?.join(", ") || ""}
                    placeholder="Chef Choice, Spicy, Popular"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Checkboxes: Available & Featured */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    value="true"
                    defaultChecked={editingItem ? editingItem.available : true}
                    className="rounded text-warm-amber focus:ring-warm-amber"
                  />
                  <span className="font-semibold text-text-dark">
                    Available in Kitchen
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    value="true"
                    defaultChecked={editingItem?.featured || false}
                    className="rounded text-warm-amber focus:ring-warm-amber"
                  />
                  <span className="font-semibold text-text-dark">
                    Featured on Website
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-border-warm flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-cream hover:bg-cream-card rounded-lg text-xs font-semibold text-text-dark border border-border-warm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold rounded-lg text-xs shadow-xs flex items-center space-x-2"
                >
                  {isPending && <LoadingSpinner size="sm" className="border-dark-wood" />}
                  <span>{editingItem ? "Save Changes" : "Create Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Archive Menu Item"
        message={`Hide "${itemToDelete?.name}" from the customer menu? It can be restored in the database.`}
        confirmText="Archive Item"
        isDanger
        isLoading={isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
