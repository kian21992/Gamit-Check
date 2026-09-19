export const categories = [
  "Electronics",
  "Clothes",
  "Sports Equipment",
  "Gaming",
  "School Items",
  "Accessories",
  "Other",
];
export const conditions = ["New", "Good", "Fair", "Damaged"];

export function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
