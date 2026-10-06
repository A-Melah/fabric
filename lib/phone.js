// Last 10 digits: 0801..., +234801..., 234801... all become the same key.
export function phoneKey(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : "";
}
