export const APP_NAME = "BillKaro";
export const APP_TAGLINE = "Simple GST Billing for Smart Businesses";
export const APP_VERSION = "1.0.0";

export const GST_RATES = [0, 5, 12, 18, 28] as const;

export const UNITS = [
  "Pcs",
  "Kg",
  "Ltr",
  "Mtr",
  "Box",
  "Dozen",
  "Pair",
  "Set",
  "Bag",
  "Bundle",
] as const;

export const EXPENSE_CATEGORIES = [
  "Rent",
  "Electricity",
  "Salary",
  "Transport",
  "Raw Material",
  "Packaging",
  "Marketing",
  "Office Supplies",
  "Maintenance",
  "Insurance",
  "Telephone",
  "Internet",
  "Miscellaneous",
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Credit Card",
  "Debit Card",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
] as const;

export const ITEM_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Grocery",
  "Stationery",
  "Hardware",
  "Cosmetics",
  "Pharma",
  "Food & Beverages",
  "Accessories",
  "General",
] as const;
