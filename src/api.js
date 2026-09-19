const categoryArt = {
  Electronics: "laptop",
  Clothes: "shirt",
  "Sports Equipment": "basketball",
  Gaming: "gamepad",
  "School Items": "book",
  Accessories: "backpack",
  Other: "charger",
};
const colors = ["sage", "sand", "lavender", "peach"];
const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function normalizeItem(item) {
  const numericId = Number.parseInt(String(item.id), 10);
  return {
    ...item,
    id: String(item.id),
    brand: item.brand || "",
    location: item.location || "",
    notes: item.notes || "",
    acquired: item.acquired || "",
    art: item.art || categoryArt[item.category] || "charger",
    color:
      item.color ||
      colors[Number.isNaN(numericId) ? 0 : numericId % colors.length],
  };
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    const error = new Error(
      "Cannot reach the Gamit Check API. Check that the server is running, then try again.",
    );
    error.code = "NETWORK_ERROR";
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.error || "The request could not be completed.",
    );
    error.status = response.status;
    error.fields = data.fields || {};
    throw error;
  }
  return data;
}

export async function getItems() {
  const data = await request("/api/items");
  return data.items.map(normalizeItem);
}

export async function searchItems({
  search = "",
  category = "",
  sort = "created_desc",
  page = 1,
  pageSize = 8,
} = {}) {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search.trim()) params.set("search", search.trim());
  if (category) params.set("category", category);
  const data = await request(`/api/items?${params}`);
  return {
    ...data,
    items: data.items.map(normalizeItem),
  };
}

export async function createItem(item) {
  const data = await request("/api/items", {
    method: "POST",
    body: JSON.stringify(item),
  });
  return normalizeItem(data.item);
}

export async function updateItem(id, item) {
  const data = await request(`/api/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
  return normalizeItem(data.item);
}

export async function deleteItem(id) {
  await request(`/api/items/${id}`, { method: "DELETE" });
}
