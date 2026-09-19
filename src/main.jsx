import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Gamepad2,
  Grid2X2,
  Headphones,
  Heart,
  Home,
  ImagePlus,
  Info,
  LayoutDashboard,
  LayoutGrid,
  List,
  MapPin,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  Shapes,
  Shirt,
  SlidersHorizontal,
  Tag,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import {
  createItem,
  deleteItem as deleteItemRequest,
  getItems,
  removeItemImage,
  searchItems,
  uploadItemImage,
  updateItem,
} from "./api";
import { categories, conditions, formatDate } from "./inventory";
import ProductArt from "./ProductArt";
import "./styles.css";

const categoryIcons = {
  Electronics: Headphones,
  Clothes: Shirt,
  "Sports Equipment": Trophy,
  Gaming: Gamepad2,
  "School Items": BookOpen,
  Accessories: Shapes,
  Other: Box,
};
const categoryNames = {
  "Sports Equipment": "Sports",
  "School Items": "School items",
};

function Icon({ name, ...props }) {
  const Component = categoryIcons[name] || Box;
  return <Component {...props} />;
}
function Badge({ condition }) {
  return (
    <span className={`condition condition-${condition.toLowerCase()}`}>
      <span />
      {condition}
    </span>
  );
}
function AddButton({ className = "" }) {
  return (
    <a className={`button button-primary ${className}`} href="#/add">
      <Plus size={17} strokeWidth={2} />
      Add Item
    </a>
  );
}
function getRoute() {
  return window.location.hash.slice(1) || "/";
}
function navigate(path) {
  window.location.hash = path;
}

function Logo() {
  return (
    <a className="brand" href="#/" aria-label="Gamit Check dashboard">
      <span className="brand-mark">
        <Package size={26} strokeWidth={1.7} />
        <span className="brand-check">
          <Check size={10} strokeWidth={3} />
        </span>
      </span>
      <span>
        Gamit<span className="brand-light"> Check</span>
        <small>Personal inventory</small>
      </span>
    </a>
  );
}

function Sidebar({ active, open, close, itemCount }) {
  return (
    <>
      <button
        className={`sidebar-backdrop ${open ? "visible" : ""}`}
        onClick={close}
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
      />
      <aside
        className={`sidebar ${open ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <Logo />
          <button
            className="icon-button close-menu"
            onClick={close}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="nav-label">YOUR WORKSPACE</div>
        <nav onClick={close}>
          <a
            className={`nav-link ${active === "dashboard" ? "active" : ""}`}
            href="#/"
            aria-current={active === "dashboard" ? "page" : undefined}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>
          <a
            className={`nav-link ${active === "items" ? "active" : ""}`}
            href="#/items"
            aria-current={active === "items" ? "page" : undefined}
          >
            <Package size={19} />
            <span>My Items</span>
            <span className="nav-count">{itemCount}</span>
          </a>
          <a
            className={`nav-link ${active === "add" ? "active" : ""}`}
            href="#/add"
            aria-current={active === "add" ? "page" : undefined}
          >
            <Plus size={19} />
            <span>Add Item</span>
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-footer">
            <span>Gamit Check</span>
            <span>Application</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="empty-state">
      <span>
        <Package size={28} strokeWidth={1.5} />
      </span>
      <h2>No items yet</h2>
      <p>Add an item to start building your inventory.</p>
      <a className="button button-primary" href="#/add">
        <Plus size={16} />
        Add your first item
      </a>
    </div>
  );
}

function ItemArtwork({ item, decorative = true }) {
  return item.imageUrl ? (
    <img
      className="item-photo"
      src={item.imageUrl}
      alt={decorative ? "" : `Photo of ${item.name}`}
    />
  ) : (
    <ProductArt type={item.art} />
  );
}

function ItemCard({ item, actions = false, onDelete }) {
  return (
    <article className="item-card">
      <a
        className={`item-art art-${item.color}`}
        href={`#/items/${item.id}`}
        aria-label={`View ${item.name}`}
      >
        <ItemArtwork item={item} />
        <span className="art-open">
          <ArrowUpRight size={16} />
        </span>
      </a>
      <div className="item-card-content">
        <div className="item-card-category">{item.category}</div>
        <a className="item-card-name" href={`#/items/${item.id}`}>
          {item.name}
        </a>
        <div className="item-card-meta">
          <span>
            <MapPin size={13} />
            {item.location.split(" · ")[0]}
          </span>
          <Badge condition={item.condition} />
        </div>
        {actions && (
          <>
            <dl className="card-extra">
              <div>
                <dt>Brand</dt>
                <dd>{item.brand}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{item.location}</dd>
              </div>
            </dl>
            <div className="card-actions">
              <a href={`#/items/${item.id}`}>
                <ArrowUpRight size={14} />
                View
              </a>
              <a href={`#/items/${item.id}/edit`}>
                <Pencil size={13} />
                Edit
              </a>
              <button onClick={() => onDelete(item)}>
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function Dashboard({ items }) {
  const activeCategories = categories.filter((category) =>
    items.some((item) => item.category === category),
  );
  const recentlyAdded = items.filter(
    (item) =>
      (Date.now() - new Date(`${item.added}T12:00:00`).getTime()) / 86400000 <
      7,
  );
  const metrics = [
    {
      label: "Total items",
      value: items.length,
      note: "All inventory records",
      Icon: Package,
      color: "green",
      foot: "Items",
    },
    {
      label: "Categories",
      value: activeCategories.length,
      note: "Categories currently in use",
      Icon: LayoutGrid,
      color: "tan",
      foot: "In use",
    },
    {
      label: "Recently added",
      value: recentlyAdded.length,
      note: items.length ? "Added during the last 7 days" : "No recent items",
      Icon: Clock3,
      color: "purple",
      foot: "Added in the last 7 days",
    },
  ];
  return (
    <>
      <PageHeading
        title="Dashboard"
        description="Overview of your personal inventory."
        action={<AddButton />}
      />
      <section className="stats-grid" aria-label="Inventory overview">
        {metrics.map((metric) => (
          <article className="stat-card" key={metric.label}>
            <div className="stat-top">
              <span>{metric.label}</span>
              <span className={`stat-icon ${metric.color}`}>
                <metric.Icon size={19} strokeWidth={1.6} />
              </span>
            </div>
            <div className="stat-value">
              {metric.value}
              <span>{metric.foot}</span>
            </div>
            <div className="stat-footer">
              <span className={`stat-dot ${metric.color}`} />
              {metric.note}
            </div>
          </article>
        ))}
      </section>
      <section className="recent-section" aria-labelledby="recent-title">
        <div className="section-heading">
          <div>
            <div className="section-title-row">
              <h2 id="recent-title">
                {items.length ? "Recently added" : "Get started"}
              </h2>
              {items.length > 0 && (
                <span className="small-count">
                  Latest {Math.min(4, items.length)}
                </span>
              )}
            </div>
            <p>
              {items.length
                ? "The latest items added to your inventory."
                : "Your inventory is currently empty."}
            </p>
          </div>
          <a className="text-link" href="#/items">
            View all items
            <ArrowRight size={16} />
          </a>
        </div>
        {items.length === 0 ? (
          <div className="dashboard-empty">
            <EmptyInventory />
          </div>
        ) : (
          <div className="recent-grid">
            {items.slice(0, 4).map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
          </div>
        )}
      </section>
      {activeCategories.length > 0 && (
        <section
          className="categories-section"
          aria-labelledby="categories-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="categories-title">Browse by category</h2>
              <p>View items grouped by category.</p>
            </div>
            <span className="section-kicker">
              {activeCategories.length} CATEGORIES
            </span>
          </div>
          <div className="category-grid">
            {activeCategories.map((category) => (
              <a
                className="category-tile"
                key={category}
                href={`#/items?category=${encodeURIComponent(category)}`}
              >
                <span className="category-icon">
                  <Icon name={category} size={23} strokeWidth={1.5} />
                </span>
                <strong>{categoryNames[category] || category}</strong>
                <span>
                  {items.filter((item) => item.category === category).length}{" "}
                  items
                </span>
                <ChevronRight className="category-arrow" size={15} />
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function MyItems({ route, onDelete, items }) {
  const selectedCategory =
    new URLSearchParams(route.split("?")[1]).get("category") || "";
  const [query, setQuery] = useState("");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_desc");
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    total: 0,
    pages: 0,
  });
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState("");
  const [retry, setRetry] = useState(0);
  const pageSize = 8;
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, query, sort]);
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setResultsLoading(true);
      setResultsError("");
      try {
        const data = await searchItems({
          search: query,
          category: selectedCategory,
          sort,
          page,
          pageSize,
        });
        if (!active) return;
        if (data.pagination.pages > 0 && page > data.pagination.pages) {
          setPage(data.pagination.pages);
          return;
        }
        setResults(data.items);
        setPagination(data.pagination);
      } catch (error) {
        if (active) setResultsError(error.message);
      } finally {
        if (active) setResultsLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, query, sort, page, items, retry]);
  const currentPage = pagination.page;
  const pages = pagination.pages;
  const total = pagination.total;
  const visible = results;
  return (
    <>
      <PageHeading
        title="My Items"
        description="Search, filter, and manage your inventory."
        action={<AddButton />}
      />
      <section className="inventory-panel" aria-label="Your items">
        <div className="inventory-toolbar">
          <div className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search your items…"
              aria-label="Search items"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="filter-select">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(event) =>
                navigate(
                  `/items${event.target.value ? `?category=${encodeURIComponent(event.target.value)}` : ""}`,
                )
              }
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="filter-select">
            <ArrowDown size={15} />
            <select
              aria-label="Sort items"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="created_desc">Newest first</option>
              <option value="created_asc">Oldest first</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="view-toggle" aria-label="Item display">
            <button
              className={view === "list" ? "selected" : ""}
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={18} />
            </button>
            <button
              className={view === "grid" ? "selected" : ""}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <Grid2X2 size={17} />
            </button>
          </div>
        </div>
        <div className="inventory-results">
          <span>
            <strong>{total}</strong> {total === 1 ? "item" : "items"}
            {selectedCategory ? (
              <>
                {" "}
                in <strong>{selectedCategory}</strong>
              </>
            ) : (
              " in your inventory"
            )}
          </span>
          <span>Results come from the inventory server</span>
        </div>
        {resultsError ? (
          <div className="empty-state" role="alert">
            <span>
              <Info size={28} strokeWidth={1.5} />
            </span>
            <h2>Could not load these items</h2>
            <p>{resultsError}</p>
            <button
              className="button button-secondary"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try Again
            </button>
          </div>
        ) : resultsLoading ? (
          <div className="loading-state" role="status">
            <span className="loading-spinner" />
            <p>Searching inventory…</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyInventory />
        ) : total === 0 ? (
          <div className="empty-state">
            <span>
              <Search size={28} strokeWidth={1.5} />
            </span>
            <h2>No items found</h2>
            <p>Try another name, brand, or location.</p>
            <button
              className="button button-secondary"
              onClick={() => {
                setQuery("");
                navigate("/items");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {view === "list" && (
              <div className="desktop-table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        ITEM NAME
                        <ArrowDown size={11} />
                      </th>
                      <th>CATEGORY</th>
                      <th>BRAND</th>
                      <th>CONDITION</th>
                      <th>LOCATION</th>
                      <th className="actions-heading">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <a className="table-name" href={`#/items/${item.id}`}>
                            <span className={`table-art art-${item.color}`}>
                              <ItemArtwork item={item} />
                            </span>
                            <strong>{item.name}</strong>
                          </a>
                        </td>
                        <td>
                          <span className="table-category">
                            {item.category}
                          </span>
                        </td>
                        <td>{item.brand}</td>
                        <td>
                          <Badge condition={item.condition} />
                        </td>
                        <td>
                          <span className="table-location">
                            <MapPin size={13} />
                            {item.location.split(" · ")[0]}
                            <small>{item.location.split(" · ")[1]}</small>
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <a
                              className="icon-button"
                              href={`#/items/${item.id}`}
                              title={`View ${item.name}`}
                              aria-label={`View ${item.name}`}
                            >
                              <ArrowUpRight size={16} />
                            </a>
                            <a
                              className="icon-button"
                              href={`#/items/${item.id}/edit`}
                              title={`Edit ${item.name}`}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil size={15} />
                            </a>
                            <button
                              className="icon-button danger-icon"
                              onClick={() => onDelete(item)}
                              title={`Delete ${item.name}`}
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div
              className={`inventory-card-grid ${view === "list" ? "mobile-cards" : ""}`}
            >
              {visible.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  actions
                  onDelete={onDelete}
                />
              ))}
            </div>
            <div className="pagination">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, total)} of {total} items
              </span>
              <div>
                <button
                  className="pagination-arrow"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? "current" : ""}
                    aria-label={`Page ${index + 1}`}
                    aria-current={
                      currentPage === index + 1 ? "page" : undefined
                    }
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="pagination-arrow"
                  aria-label="Next page"
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function ItemForm({ item, showToast, onCreated, onUpdated }) {
  const isEdit = !!item;
  const backPath = isEdit ? `/items/${item.id}` : "/items";
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  function fieldErrorProps(name) {
    return {
      "aria-invalid": Boolean(fieldErrors[name]),
      "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
      onChange: () =>
        setFieldErrors((current) => {
          if (!current[name]) return current;
          const next = { ...current };
          delete next[name];
          return next;
        }),
    };
  }

  function FieldError({ name }) {
    return fieldErrors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {fieldErrors[name]}
      </span>
    ) : null;
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setFieldErrors({});
    const values = Object.fromEntries(new FormData(event.currentTarget));
    delete values.image;
    try {
      let saved;
      if (isEdit) {
        saved = await updateItem(item.id, values);
      } else {
        saved = await createItem(values);
      }

      try {
        if (photoFile) saved = await uploadItemImage(saved.id, photoFile);
        else if (isEdit && removePhoto) saved = await removeItemImage(saved.id);
      } catch (photoError) {
        if (isEdit) onUpdated(saved);
        else onCreated(saved);
        showToast(
          `${saved.name} was saved, but the photo failed: ${photoError.message}`,
        );
        navigate(`/items/${saved.id}`);
        return;
      }

      if (isEdit) onUpdated(saved);
      else onCreated(saved);
      showToast(
        isEdit
          ? `${saved.name} was updated.`
          : `${saved.name} was added to your inventory.`,
      );
      navigate(`/items/${saved.id}`);
    } catch (error) {
      setSubmitError(error.message);
      setFieldErrors(error.fields || {});
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <a className="back-link" href={`#${backPath}`}>
        <ArrowLeft size={15} />
        {isEdit ? "Back to item details" : "Back to My Items"}
      </a>
      <PageHeading
        title={isEdit ? "Edit Item" : "Add a new item"}
        description={
          isEdit
            ? "Update the information for this item."
            : "Enter the information for the item you want to track."
        }
      />
      <div className="form-layout">
        <form className="item-form" onSubmit={submit} key={item?.id || "add"}>
          <div className="form-header">
            <span className="form-heading-icon">
              <Package size={20} />
            </span>
            <div>
              <h2>Item information</h2>
              <p>Required fields are marked with an asterisk.</p>
            </div>
            <span className="required-note">
              <span>*</span> Required
            </span>
          </div>
          <div className="form-body">
            <div className="field">
              <label htmlFor="item-name">
                Item name <span>*</span>
              </label>
              <input
                id="item-name"
                name="name"
                placeholder="e.g. Wireless Headphones"
                defaultValue={item?.name || ""}
                required
                maxLength={100}
                {...fieldErrorProps("name")}
              />
              <FieldError name="name" />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="category">
                  Category <span>*</span>
                </label>
                <div className="select-wrap">
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue={item?.category || ""}
                    {...fieldErrorProps("category")}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <FieldError name="category" />
              </div>
              <div className="field">
                <label htmlFor="brand">
                  Brand <span className="optional">Optional</span>
                </label>
                <input
                  id="brand"
                  name="brand"
                  placeholder="e.g. Sony"
                  defaultValue={item?.brand || ""}
                  maxLength={100}
                  {...fieldErrorProps("brand")}
                />
                <FieldError name="brand" />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="condition">
                  Condition <span>*</span>
                </label>
                <div className="select-wrap">
                  <select
                    id="condition"
                    name="condition"
                    required
                    defaultValue={item?.condition || ""}
                    {...fieldErrorProps("condition")}
                  >
                    <option value="" disabled>
                      What condition is it in?
                    </option>
                    {conditions.map((condition) => (
                      <option key={condition}>{condition}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <FieldError name="condition" />
              </div>
              <div className="field">
                <label htmlFor="location">
                  Location <span className="optional">Optional</span>
                </label>
                <div className="input-with-icon">
                  <MapPin size={16} />
                  <input
                    id="location"
                    name="location"
                    placeholder="e.g. Bedroom · Desk"
                    defaultValue={item?.location || ""}
                    maxLength={150}
                    {...fieldErrorProps("location")}
                  />
                </div>
                <FieldError name="location" />
              </div>
            </div>
            <div className="field date-field">
              <label htmlFor="acquired">
                Date acquired <span className="optional">Optional</span>
              </label>
              <input
                id="acquired"
                name="acquired"
                type="date"
                defaultValue={item?.acquired || ""}
                {...fieldErrorProps("acquired")}
              />
              <FieldError name="acquired" />
            </div>
            <div className="form-divider" />
            <div className="field photo-field">
              <label htmlFor="image">
                Item photo <span className="optional">Optional</span>
              </label>
              <div className="photo-control">
                <div className="photo-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Selected item preview" />
                  ) : item?.imageUrl && !removePhoto ? (
                    <img
                      src={item.imageUrl}
                      alt={`Current photo of ${item.name}`}
                    />
                  ) : (
                    <ImagePlus size={24} aria-hidden="true" />
                  )}
                </div>
                <div className="photo-actions">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-describedby="image-help image-error"
                    aria-invalid={Boolean(fieldErrors.image)}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setFieldErrors((current) => {
                        const next = { ...current };
                        delete next.image;
                        return next;
                      });
                      if (!file) {
                        setPhotoFile(null);
                        return;
                      }
                      if (
                        !["image/jpeg", "image/png", "image/webp"].includes(
                          file.type,
                        )
                      ) {
                        setPhotoFile(null);
                        setFieldErrors((current) => ({
                          ...current,
                          image: "Choose a JPEG, PNG, or WebP image.",
                        }));
                        event.target.value = "";
                        return;
                      }
                      if (file.size > 3 * 1024 * 1024) {
                        setPhotoFile(null);
                        setFieldErrors((current) => ({
                          ...current,
                          image: "Choose an image smaller than 3 MB.",
                        }));
                        event.target.value = "";
                        return;
                      }
                      setPhotoFile(file);
                      setRemovePhoto(false);
                    }}
                  />
                  <span className="field-help" id="image-help">
                    JPEG, PNG, or WebP. Maximum 3 MB.
                  </span>
                  <FieldError name="image" />
                  {isEdit && item.hasImage && (
                    <button
                      type="button"
                      className="text-link photo-remove"
                      onClick={() => {
                        setPhotoFile(null);
                        setRemovePhoto((current) => !current);
                      }}
                    >
                      {removePhoto
                        ? "Keep current photo"
                        : "Remove current photo"}
                    </button>
                  )}
                  {removePhoto && (
                    <span className="field-help">
                      The current photo will be removed when you save.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="form-divider" />
            <div className="field">
              <label htmlFor="notes">
                Notes <span className="optional">Optional</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Add relevant details about this item"
                defaultValue={item?.notes || ""}
                maxLength={2000}
                {...fieldErrorProps("notes")}
              />
              <FieldError name="notes" />
              <span className="field-help">Maximum 2,000 characters.</span>
            </div>
          </div>
          {submitError && (
            <div className="form-error" role="alert">
              <Info size={16} />
              {submitError}
            </div>
          )}
          <div className="form-actions">
            <a className="button button-secondary" href={`#${backPath}`}>
              Cancel
            </a>
            <button
              className="button button-primary"
              type="submit"
              disabled={submitting}
            >
              {isEdit ? <Check size={16} /> : <Plus size={16} />}
              {submitting
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save Changes"
                  : "Add Item"}
            </button>
          </div>
        </form>
        <aside className="form-aside">
          {isEdit ? (
            <div className="form-preview">
              <div className={`form-preview-art art-${item.color}`}>
                <ItemArtwork item={item} decorative={false} />
              </div>
              <div>
                <span className="eyebrow">YOU’RE UPDATING</span>
                <h3>{item.name}</h3>
                <span>{item.category}</span>
              </div>
            </div>
          ) : (
            <div className="form-aside-art">
              <svg
                width="185"
                height="145"
                viewBox="0 0 185 145"
                fill="none"
                aria-hidden="true"
              >
                <ellipse cx="94" cy="124" rx="69" ry="9" fill="#dde5d7" />
                <path d="m40 67 53-27 53 27v49l-53 26-53-26Z" fill="#c2d1b3" />
                <path
                  d="m40 67 53 25 53-25M93 92v50"
                  stroke="#7f9870"
                  strokeWidth="1.5"
                />
                <path
                  d="m40 67-16-18 50-26 19 17-19 25m72 2 17-18-50-26-20 17 22 28"
                  fill="#e2e9d9"
                  stroke="#a0b18d"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="m112 63 7-32 20 4-7 34" fill="#809676" />
                <rect
                  x="63"
                  y="34"
                  width="29"
                  height="40"
                  rx="4"
                  transform="rotate(-12 63 34)"
                  fill="#9fad90"
                />
                <circle cx="124" cy="99" r="18" fill="#fafcf7" />
                <path
                  d="m116 99 6 6 11-13"
                  stroke="#55744d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M44 21v10m-5-5h10m103-3v8m-4-4h8"
                  stroke="#a8b99a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <div className="help-card">
            <h3>Tips</h3>
            <p>Use a specific item name so it is easy to find in search.</p>
            <div className="help-divider" />
            <p>
              Include both a room and storage area for the location, such as{" "}
              <strong>Bedroom · Desk drawer</strong>.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function ItemDetails({ item, onDelete }) {
  return (
    <>
      <a className="back-link" href="#/items">
        <ArrowLeft size={15} />
        Back to My Items
      </a>
      <PageHeading
        title={item.name}
        description="View the stored information for this item."
        action={
          <a className="button button-primary" href={`#/items/${item.id}/edit`}>
            <Pencil size={16} />
            Edit Item
          </a>
        }
      />
      <div className="detail-layout">
        <div className="detail-visual">
          <div className={`detail-art art-${item.color}`}>
            <ItemArtwork item={item} decorative={false} />
            <span className="detail-art-label">
              <Icon name={item.category} size={14} />
              {item.category}
            </span>
          </div>
          <div className="detail-visual-caption">
            <span>
              <Package size={15} />
              Part of your personal inventory
            </span>
            <Heart size={15} />
          </div>
        </div>
        <section className="detail-info">
          <div className="detail-info-heading">
            <h2>Item information</h2>
            <Badge condition={item.condition} />
          </div>
          <dl className="detail-fields">
            <div>
              <dt>
                <Tag size={16} />
                Category
              </dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>
                <Box size={16} />
                Brand
              </dt>
              <dd>{item.brand || "Not specified"}</dd>
            </div>
            <div>
              <dt>
                <CircleCheck size={16} />
                Condition
              </dt>
              <dd>{item.condition}</dd>
            </div>
            <div>
              <dt>
                <MapPin size={16} />
                Location
              </dt>
              <dd>{item.location || "Not specified"}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={16} />
                Date acquired
              </dt>
              <dd>
                {item.acquired ? formatDate(item.acquired) : "Not specified"}
              </dd>
            </div>
          </dl>
          <div className="detail-notes">
            <h3>
              <BookOpen size={16} />A note to remember
            </h3>
            <p>{item.notes || "No notes yet."}</p>
          </div>
          <div className="detail-added">
            Added to your inventory on {formatDate(item.added)}
          </div>
        </section>
      </div>
      <div className="detail-bottom">
        <a className="text-link muted-link" href="#/items">
          <ArrowLeft size={15} />
          Back to My Items
        </a>
        <button
          className="button button-danger-subtle"
          onClick={() => onDelete(item)}
        >
          <Trash2 size={15} />
          Delete Item
        </button>
      </div>
    </>
  );
}

function FlowDiagram({ items }) {
  const firstItem = items[0];
  const ItemNode = firstItem ? "a" : "div";
  return (
    <>
      <a className="back-link" href="#/">
        <ArrowLeft size={15} />
        Back to Dashboard
      </a>
      <PageHeading
        eyebrow="WIREFRAME REFERENCE"
        title="A simple path to your things."
        description="Reference for the main application screens and navigation."
      />
      <section className="flow-panel">
        <div className="flow-primary">
          <a className="flow-node" href="#/">
            <span className="flow-number">01</span>
            <LayoutDashboard />
            <h2>Dashboard</h2>
            <p>Your inventory at a glance</p>
          </a>
          <ArrowRight className="flow-arrow" />
          <a className="flow-node" href="#/items">
            <span className="flow-number">02</span>
            <Package />
            <h2>My Items</h2>
            <p>Search, filter, and browse</p>
          </a>
          <ArrowRight className="flow-arrow" />
          <ItemNode
            className={`flow-node ${firstItem ? "" : "flow-node-unavailable"}`}
            href={firstItem ? `#/items/${firstItem.id}` : undefined}
          >
            <span className="flow-number">03</span>
            <Box />
            <h2>Item Details</h2>
            <p>
              {firstItem
                ? "View item information"
                : "Available when you have an item"}
            </p>
          </ItemNode>
          <ArrowRight className="flow-arrow" />
          <ItemNode
            className={`flow-node ${firstItem ? "" : "flow-node-unavailable"}`}
            href={firstItem ? `#/items/${firstItem.id}/edit` : undefined}
          >
            <span className="flow-number">04</span>
            <Pencil />
            <h2>Edit Item</h2>
            <p>
              {firstItem
                ? "Update item information"
                : "Available when you have an item"}
            </p>
          </ItemNode>
        </div>
        <div className="flow-secondary">
          <div className="flow-branch-label">
            <span>Dashboard or My Items</span>
            <ArrowDown size={19} />
          </div>
          <a className="flow-node add-flow-node" href="#/add">
            <span className="flow-number">05</span>
            <Plus />
            <h2>Add Item</h2>
            <p>Give a new item a place</p>
          </a>
        </div>
      </section>
      <div className="flow-notes">
        <div>
          <h3>Quick actions</h3>
          <p>
            My Items also connects directly to Edit Item. Delete is available
            from My Items and Item Details, with a confirmation dialog.
          </p>
        </div>
        <div>
          <h3>Finding your way back</h3>
          <p>
            Item Details returns to My Items. Cancel returns from Add Item to My
            Items, and from Edit Item to Item Details. The main navigation is
            always available.
          </p>
        </div>
        <div>
          <h3>Changes are saved</h3>
          <p>
            Add, edit, and delete actions are stored in PostgreSQL. On smaller
            screens, the sidebar becomes a menu and the item table becomes
            cards.
          </p>
        </div>
      </div>
    </>
  );
}

function DeleteDialog({ item, close, confirm }) {
  const dialog = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  useEffect(() => {
    const previousFocus = document.activeElement;
    dialog.current.showModal();
    return () => {
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="delete-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
    >
      <div className="dialog-content">
        <button
          className="icon-button dialog-close"
          aria-label="Close delete dialog"
          onClick={close}
        >
          <X size={20} />
        </button>
        <div className="delete-illustration">
          <Trash2 size={26} strokeWidth={1.5} />
        </div>
        <h2 id="delete-title">Remove this item?</h2>
        <p id="delete-description">
          <strong>{item.name}</strong> would be removed from your inventory.
        </p>
        <div className="dialog-preview-note">
          <Info size={15} />
          This action permanently removes the item from your inventory.
        </div>
        {deleteError && (
          <div className="dialog-error" role="alert">
            <Info size={15} />
            {deleteError}
          </div>
        )}
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            autoFocus
            onClick={close}
            disabled={deleting}
          >
            Keep Item
          </button>
          <button
            className="button button-danger"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              setDeleteError("");
              try {
                await confirm();
              } catch (error) {
                setDeleteError(error.message);
                setDeleting(false);
              }
            }}
          >
            <Trash2 size={15} />
            {deleting ? "Deleting…" : "Delete Item"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const main = useRef(null);
  useEffect(() => {
    let active = true;
    setItemsLoading(true);
    setItemsError("");
    getItems()
      .then((records) => {
        if (active) setItems(records);
      })
      .catch((error) => {
        if (active) setItemsError(error.message);
      })
      .finally(() => {
        if (active) setItemsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);
  useEffect(() => {
    function handleRoute() {
      setRoute(getRoute());
      setMenuOpen(false);
      setDeleteItem(null);
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", handleRoute);
    return () => {
      window.removeEventListener("hashchange", handleRoute);
      clearTimeout(toastTimer.current);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);
  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 6500);
  }
  function handleCreated(item) {
    setItems((current) => [item, ...current]);
    setItemsError("");
  }
  function handleUpdated(item) {
    setItems((current) =>
      current.map((record) => (record.id === item.id ? item : record)),
    );
    setItemsError("");
  }
  const path = route.split("?")[0];
  const pathParts = path.split("/").filter(Boolean);
  const selectedItem =
    pathParts[0] === "items" && pathParts[1]
      ? items.find((item) => item.id === pathParts[1])
      : null;
  const isEdit = selectedItem && pathParts[2] === "edit";
  async function handleDelete(item) {
    await deleteItemRequest(item.id);
    setItems((current) => current.filter((record) => record.id !== item.id));
    setDeleteItem(null);
    showToast(`${item.name} was deleted.`);
    if (pathParts[0] === "items" && pathParts[1] === item.id) {
      navigate("/items");
    }
  }
  const active =
    path === "/"
      ? "dashboard"
      : path === "/add"
        ? "add"
        : pathParts[0] === "items"
          ? "items"
          : "";
  const screen =
    path === "/"
      ? "Dashboard"
      : path === "/add"
        ? "Add Item"
        : path === "/flow"
          ? "Navigation flow"
          : isEdit
            ? "Edit Item"
            : selectedItem
              ? "Item Details"
              : "My Items";
  useEffect(() => {
    document.title = `${screen} · Gamit Check`;
  }, [screen]);
  let content;
  if (path === "/") content = <Dashboard items={items} />;
  else if (path === "/add")
    content = <ItemForm showToast={showToast} onCreated={handleCreated} />;
  else if (path === "/flow") content = <FlowDiagram items={items} />;
  else if (path === "/items")
    content = <MyItems route={route} onDelete={setDeleteItem} items={items} />;
  else if (
    selectedItem &&
    (pathParts.length === 2 || (pathParts.length === 3 && isEdit))
  )
    content = isEdit ? (
      <ItemForm
        item={selectedItem}
        showToast={showToast}
        onUpdated={handleUpdated}
      />
    ) : (
      <ItemDetails item={selectedItem} onDelete={setDeleteItem} />
    );
  else if (itemsLoading)
    content = (
      <div className="loading-state" role="status">
        <span className="loading-spinner" />
        <p>Loading item…</p>
      </div>
    );
  else
    content = (
      <div className="empty-state">
        <Package size={32} />
        <h1>This item isn’t here.</h1>
        <p>Head back to your inventory to find your things.</p>
        <a href="#/items" className="button button-primary">
          Back to My Items
        </a>
      </div>
    );
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Sidebar
        active={active}
        open={menuOpen}
        close={() => setMenuOpen(false)}
        itemCount={items.length}
      />
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={22} />
          </button>
          <div className="mobile-brand">
            <Logo />
          </div>
          <div className="breadcrumb">
            <a href="#/" aria-label="Home">
              <Home size={15} strokeWidth={1.7} />
            </a>
            <ChevronRight size={13} />
            {selectedItem && (
              <>
                <a href="#/items">My Items</a>
                <ChevronRight size={13} />
              </>
            )}
            <span>{screen}</span>
          </div>
          <div className="topbar-tag">
            <span />
            <span>
              {itemsLoading
                ? "Connecting…"
                : itemsError
                  ? "API unavailable"
                  : "API connected"}
            </span>
          </div>
        </header>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className={`main-content ${path === "/flow" ? "flow-content" : ""}`}
        >
          {itemsError && (
            <div className="api-alert" role="alert">
              <Info size={17} />
              <div>
                <strong>Could not load inventory</strong>
                <span>
                  {itemsError} Check that the API and PostgreSQL are running.
                </span>
              </div>
              <button
                className="button button-secondary api-retry"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                disabled={itemsLoading}
              >
                {itemsLoading ? "Retrying…" : "Try Again"}
              </button>
            </div>
          )}
          {content}
        </main>
        <footer className="workspace-footer">
          <span>
            <span className="status-dot" />
            Gamit Check inventory
          </span>
          <a href="#/flow">
            View screen flow
            <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>
      {deleteItem && (
        <DeleteDialog
          item={deleteItem}
          close={() => setDeleteItem(null)}
          confirm={() => handleDelete(deleteItem)}
        />
      )}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <Info size={20} />
            <p>{toast}</p>
            <button
              className="icon-button"
              aria-label="Dismiss message"
              onClick={() => setToast("")}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
