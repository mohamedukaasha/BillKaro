import type { Invoice, Expense, InventoryItem, Customer } from "@/types";

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@example.com", gstin: "27AAPFU0939F1ZV", address: "12, MG Road, Pune", state: "Maharashtra" },
  { id: "c2", name: "Priya Sharma", phone: "9876543211", email: "priya@example.com", address: "45, Park Street, Kolkata", state: "West Bengal" },
  { id: "c3", name: "Amit Patel", phone: "9876543212", email: "amit@example.com", gstin: "24AADCB2230M1ZP", address: "8, CG Road, Ahmedabad", state: "Gujarat" },
  { id: "c4", name: "Sunita Verma", phone: "9876543213", email: "sunita@example.com", address: "23, Civil Lines, Jaipur", state: "Rajasthan" },
  { id: "c5", name: "Mohammed Irfan", phone: "9876543214", email: "irfan@example.com", gstin: "29ABCDE1234F1Z5", address: "78, Brigade Road, Bangalore", state: "Karnataka" },
  { id: "c6", name: "Lakshmi Nair", phone: "9876543215", email: "lakshmi@example.com", address: "34, Marine Drive, Kochi", state: "Kerala" },
  { id: "c7", name: "Deepak Gupta", phone: "9876543216", email: "deepak@example.com", gstin: "09AABCU9603R1ZM", address: "56, Hazratganj, Lucknow", state: "Uttar Pradesh" },
  { id: "c8", name: "Ananya Das", phone: "9876543217", email: "ananya@example.com", address: "12, Salt Lake, Kolkata", state: "West Bengal" },
];

export const mockInventory: InventoryItem[] = [
  { id: "i1", name: "Samsung Galaxy A15", sku: "EL-SAM-A15", category: "Electronics", hsnCode: "8517", unit: "Pcs", purchasePrice: 11000, sellingPrice: 13499, gstRate: 18, stock: 24, lowStockThreshold: 5, createdAt: "2025-01-10" },
  { id: "i2", name: "Realme Buds Air 5", sku: "EL-RM-BA5", category: "Electronics", hsnCode: "8518", unit: "Pcs", purchasePrice: 2200, sellingPrice: 2999, gstRate: 18, stock: 45, lowStockThreshold: 10, createdAt: "2025-01-12" },
  { id: "i3", name: "Boat Rockerz 450", sku: "EL-BOAT-R450", category: "Electronics", hsnCode: "8518", unit: "Pcs", purchasePrice: 1100, sellingPrice: 1499, gstRate: 18, stock: 32, lowStockThreshold: 8, createdAt: "2025-01-15" },
  { id: "i4", name: "Cotton Kurta Set", sku: "CL-KRT-001", category: "Clothing", hsnCode: "6204", unit: "Set", purchasePrice: 650, sellingPrice: 1199, gstRate: 5, stock: 60, lowStockThreshold: 15, createdAt: "2025-02-01" },
  { id: "i5", name: "Men's Denim Jeans", sku: "CL-DNM-001", category: "Clothing", hsnCode: "6203", unit: "Pcs", purchasePrice: 500, sellingPrice: 899, gstRate: 12, stock: 80, lowStockThreshold: 20, createdAt: "2025-02-03" },
  { id: "i6", name: "Tata Salt 1kg", sku: "GR-SALT-1K", category: "Grocery", hsnCode: "2501", unit: "Pcs", purchasePrice: 18, sellingPrice: 24, gstRate: 0, stock: 200, lowStockThreshold: 50, createdAt: "2025-02-10" },
  { id: "i7", name: "Ashirvaad Atta 5kg", sku: "GR-ATTA-5K", category: "Grocery", hsnCode: "1101", unit: "Bag", purchasePrice: 210, sellingPrice: 265, gstRate: 0, stock: 120, lowStockThreshold: 30, createdAt: "2025-02-12" },
  { id: "i8", name: "Classmate Notebook 200pg", sku: "ST-NB-200", category: "Stationery", hsnCode: "4820", unit: "Pcs", purchasePrice: 38, sellingPrice: 55, gstRate: 12, stock: 300, lowStockThreshold: 50, createdAt: "2025-02-15" },
  { id: "i9", name: "Parker Pen Blue", sku: "ST-PEN-PB", category: "Stationery", hsnCode: "9608", unit: "Pcs", purchasePrice: 150, sellingPrice: 220, gstRate: 18, stock: 75, lowStockThreshold: 15, createdAt: "2025-02-18" },
  { id: "i10", name: "Havells LED Bulb 9W", sku: "HW-LED-9W", category: "Hardware", hsnCode: "9405", unit: "Pcs", purchasePrice: 65, sellingPrice: 99, gstRate: 18, stock: 150, lowStockThreshold: 30, createdAt: "2025-03-01" },
  { id: "i11", name: "Anchor Switch Board 6-way", sku: "HW-SWB-6", category: "Hardware", hsnCode: "8536", unit: "Pcs", purchasePrice: 120, sellingPrice: 189, gstRate: 28, stock: 40, lowStockThreshold: 10, createdAt: "2025-03-05" },
  { id: "i12", name: "Lakme Foundation", sku: "CS-LKM-FD", category: "Cosmetics", hsnCode: "3304", unit: "Pcs", purchasePrice: 280, sellingPrice: 450, gstRate: 28, stock: 35, lowStockThreshold: 8, createdAt: "2025-03-10" },
  { id: "i13", name: "Himalaya Face Wash", sku: "CS-HIM-FW", category: "Cosmetics", hsnCode: "3304", unit: "Pcs", purchasePrice: 95, sellingPrice: 145, gstRate: 18, stock: 65, lowStockThreshold: 15, createdAt: "2025-03-12" },
  { id: "i14", name: "USB-C Cable 1m", sku: "AC-USB-C1", category: "Accessories", hsnCode: "8544", unit: "Pcs", purchasePrice: 45, sellingPrice: 99, gstRate: 18, stock: 200, lowStockThreshold: 40, createdAt: "2025-03-15" },
  { id: "i15", name: "Phone Tempered Glass", sku: "AC-TG-001", category: "Accessories", hsnCode: "7007", unit: "Pcs", purchasePrice: 20, sellingPrice: 79, gstRate: 18, stock: 350, lowStockThreshold: 60, createdAt: "2025-03-18" },
  { id: "i16", name: "Crocin Pain Relief", sku: "PH-CRO-PR", category: "Pharma", hsnCode: "3004", unit: "Pcs", purchasePrice: 22, sellingPrice: 30, gstRate: 12, stock: 180, lowStockThreshold: 40, createdAt: "2025-03-20" },
  { id: "i17", name: "Dabur Honey 500g", sku: "FB-DHN-500", category: "Food & Beverages", hsnCode: "0409", unit: "Pcs", purchasePrice: 180, sellingPrice: 235, gstRate: 0, stock: 55, lowStockThreshold: 12, createdAt: "2025-04-01" },
  { id: "i18", name: "Paper Cups 50pk", sku: "GN-CUP-50", category: "General", hsnCode: "4823", unit: "Pcs", purchasePrice: 35, sellingPrice: 60, gstRate: 12, stock: 90, lowStockThreshold: 20, createdAt: "2025-04-05" },
  { id: "i19", name: "Wireless Mouse Logitech", sku: "EL-LGT-WM", category: "Electronics", hsnCode: "8471", unit: "Pcs", purchasePrice: 500, sellingPrice: 749, gstRate: 18, stock: 28, lowStockThreshold: 8, createdAt: "2025-04-10" },
  { id: "i20", name: "Cotton Face Towel 6pk", sku: "GN-TWL-6P", category: "General", hsnCode: "6302", unit: "Set", purchasePrice: 120, sellingPrice: 199, gstRate: 5, stock: 70, lowStockThreshold: 15, createdAt: "2025-04-12" },
  { id: "i21", name: "Borosil Lunch Box", sku: "GN-BLB-001", category: "General", hsnCode: "7013", unit: "Pcs", purchasePrice: 350, sellingPrice: 549, gstRate: 18, stock: 3, lowStockThreshold: 5, createdAt: "2025-04-15" },
  { id: "i22", name: "Godrej Hair Colour", sku: "CS-GHC-001", category: "Cosmetics", hsnCode: "3305", unit: "Pcs", purchasePrice: 48, sellingPrice: 75, gstRate: 28, stock: 2, lowStockThreshold: 10, createdAt: "2025-04-18" },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv1", invoiceNumber: "INV-2507-1001", type: "gst", status: "paid",
    customer: mockCustomers[0],
    items: [
      { id: "li1", itemId: "i1", name: "Samsung Galaxy A15", hsnCode: "8517", quantity: 2, unit: "Pcs", rate: 13499, gstRate: 18, amount: 26998, cgst: 2429.82, sgst: 2429.82, igst: 0 },
      { id: "li2", itemId: "i14", name: "USB-C Cable 1m", hsnCode: "8544", quantity: 2, unit: "Pcs", rate: 99, gstRate: 18, amount: 198, cgst: 17.82, sgst: 17.82, igst: 0 },
    ],
    subtotal: 27196, totalCgst: 2447.64, totalSgst: 2447.64, totalIgst: 0, totalTax: 4895.28, grandTotal: 32091.28, discount: 0, notes: "", createdAt: "2025-07-01", dueDate: "2025-07-15", paidAt: "2025-07-05"
  },
  {
    id: "inv2", invoiceNumber: "INV-2507-1002", type: "gst", status: "sent",
    customer: mockCustomers[2],
    items: [
      { id: "li3", itemId: "i4", name: "Cotton Kurta Set", hsnCode: "6204", quantity: 10, unit: "Set", rate: 1199, gstRate: 5, amount: 11990, cgst: 299.75, sgst: 299.75, igst: 0 },
    ],
    subtotal: 11990, totalCgst: 299.75, totalSgst: 299.75, totalIgst: 0, totalTax: 599.50, grandTotal: 12589.50, discount: 0, notes: "Bulk order", createdAt: "2025-07-03", dueDate: "2025-07-18"
  },
  {
    id: "inv3", invoiceNumber: "INV-2507-1003", type: "non-gst", status: "paid",
    customer: mockCustomers[1],
    items: [
      { id: "li4", name: "Tata Salt 1kg", hsnCode: "2501", quantity: 50, unit: "Pcs", rate: 24, gstRate: 0, amount: 1200, cgst: 0, sgst: 0, igst: 0 },
      { id: "li5", name: "Ashirvaad Atta 5kg", hsnCode: "1101", quantity: 20, unit: "Bag", rate: 265, gstRate: 0, amount: 5300, cgst: 0, sgst: 0, igst: 0 },
    ],
    subtotal: 6500, totalCgst: 0, totalSgst: 0, totalIgst: 0, totalTax: 0, grandTotal: 6500, discount: 0, notes: "", createdAt: "2025-07-05", dueDate: "2025-07-20", paidAt: "2025-07-05"
  },
  {
    id: "inv4", invoiceNumber: "INV-2507-1004", type: "gst", status: "overdue",
    customer: mockCustomers[4],
    items: [
      { id: "li6", itemId: "i11", name: "Anchor Switch Board 6-way", hsnCode: "8536", quantity: 20, unit: "Pcs", rate: 189, gstRate: 28, amount: 3780, cgst: 529.2, sgst: 529.2, igst: 0 },
      { id: "li7", itemId: "i10", name: "Havells LED Bulb 9W", hsnCode: "9405", quantity: 50, unit: "Pcs", rate: 99, gstRate: 18, amount: 4950, cgst: 445.5, sgst: 445.5, igst: 0 },
    ],
    subtotal: 8730, totalCgst: 974.7, totalSgst: 974.7, totalIgst: 0, totalTax: 1949.4, grandTotal: 10679.4, discount: 0, notes: "Delivery pending", createdAt: "2025-06-10", dueDate: "2025-06-25"
  },
  {
    id: "inv5", invoiceNumber: "INV-2507-1005", type: "gst", status: "paid",
    customer: mockCustomers[6],
    items: [
      { id: "li8", itemId: "i12", name: "Lakme Foundation", hsnCode: "3304", quantity: 5, unit: "Pcs", rate: 450, gstRate: 28, amount: 2250, cgst: 315, sgst: 315, igst: 0 },
      { id: "li9", itemId: "i13", name: "Himalaya Face Wash", hsnCode: "3304", quantity: 10, unit: "Pcs", rate: 145, gstRate: 18, amount: 1450, cgst: 130.5, sgst: 130.5, igst: 0 },
    ],
    subtotal: 3700, totalCgst: 445.5, totalSgst: 445.5, totalIgst: 0, totalTax: 891, grandTotal: 4591, discount: 0, notes: "", createdAt: "2025-07-08", dueDate: "2025-07-22", paidAt: "2025-07-10"
  },
  {
    id: "inv6", invoiceNumber: "INV-2507-1006", type: "non-gst", status: "draft",
    customer: mockCustomers[3],
    items: [
      { id: "li10", name: "Custom Embroidery Work", hsnCode: "5810", quantity: 3, unit: "Pcs", rate: 2500, gstRate: 0, amount: 7500, cgst: 0, sgst: 0, igst: 0 },
    ],
    subtotal: 7500, totalCgst: 0, totalSgst: 0, totalIgst: 0, totalTax: 0, grandTotal: 7500, discount: 0, notes: "Draft for review", createdAt: "2025-07-12", dueDate: "2025-07-27"
  },
  {
    id: "inv7", invoiceNumber: "INV-2506-0987", type: "gst", status: "paid",
    customer: mockCustomers[5],
    items: [
      { id: "li11", itemId: "i8", name: "Classmate Notebook 200pg", hsnCode: "4820", quantity: 100, unit: "Pcs", rate: 55, gstRate: 12, amount: 5500, cgst: 330, sgst: 330, igst: 0 },
      { id: "li12", itemId: "i9", name: "Parker Pen Blue", hsnCode: "9608", quantity: 25, unit: "Pcs", rate: 220, gstRate: 18, amount: 5500, cgst: 495, sgst: 495, igst: 0 },
    ],
    subtotal: 11000, totalCgst: 825, totalSgst: 825, totalIgst: 0, totalTax: 1650, grandTotal: 12650, discount: 0, notes: "School supply order", createdAt: "2025-06-15", dueDate: "2025-06-30", paidAt: "2025-06-28"
  },
  {
    id: "inv8", invoiceNumber: "INV-2506-0988", type: "gst", status: "paid",
    customer: mockCustomers[7],
    items: [
      { id: "li13", itemId: "i2", name: "Realme Buds Air 5", hsnCode: "8518", quantity: 3, unit: "Pcs", rate: 2999, gstRate: 18, amount: 8997, cgst: 809.73, sgst: 809.73, igst: 0 },
    ],
    subtotal: 8997, totalCgst: 809.73, totalSgst: 809.73, totalIgst: 0, totalTax: 1619.46, grandTotal: 10616.46, discount: 0, notes: "", createdAt: "2025-06-20", dueDate: "2025-07-05", paidAt: "2025-06-25"
  },
];

export const mockExpenses: Expense[] = [
  { id: "e1", category: "Rent", description: "Shop rent for July", amount: 25000, date: "2025-07-01", vendor: "Ramesh Properties", paymentMethod: "Bank Transfer" },
  { id: "e2", category: "Electricity", description: "Electricity bill July", amount: 4200, date: "2025-07-05", vendor: "MSEDCL", paymentMethod: "UPI" },
  { id: "e3", category: "Salary", description: "Staff salary - Suresh", amount: 18000, date: "2025-07-01", vendor: "Suresh Kumar", paymentMethod: "Bank Transfer" },
  { id: "e4", category: "Salary", description: "Staff salary - Meena", amount: 15000, date: "2025-07-01", vendor: "Meena Devi", paymentMethod: "Bank Transfer" },
  { id: "e5", category: "Transport", description: "Delivery charges", amount: 3500, date: "2025-07-08", vendor: "Delhivery", paymentMethod: "UPI" },
  { id: "e6", category: "Packaging", description: "Bubble wrap & boxes", amount: 2100, date: "2025-07-10", vendor: "Packwell", paymentMethod: "Cash" },
  { id: "e7", category: "Marketing", description: "Google Ads July", amount: 5000, date: "2025-07-12", vendor: "Google", paymentMethod: "Credit Card" },
  { id: "e8", category: "Internet", description: "Jio Fiber monthly", amount: 999, date: "2025-07-01", vendor: "Jio", paymentMethod: "UPI" },
  { id: "e9", category: "Maintenance", description: "AC repair shop", amount: 1800, date: "2025-07-06", vendor: "Cool Services", paymentMethod: "Cash" },
  { id: "e10", category: "Office Supplies", description: "Printer ink & paper", amount: 1200, date: "2025-07-09", vendor: "Staples", paymentMethod: "UPI" },
  { id: "e11", category: "Telephone", description: "Mobile recharge staff", amount: 600, date: "2025-07-05", vendor: "Airtel", paymentMethod: "UPI" },
  { id: "e12", category: "Miscellaneous", description: "Tea & snacks", amount: 900, date: "2025-07-10", vendor: "Local vendor", paymentMethod: "Cash" },
  { id: "e13", category: "Rent", description: "Shop rent for June", amount: 25000, date: "2025-06-01", vendor: "Ramesh Properties", paymentMethod: "Bank Transfer" },
  { id: "e14", category: "Electricity", description: "Electricity bill June", amount: 3800, date: "2025-06-05", vendor: "MSEDCL", paymentMethod: "UPI" },
  { id: "e15", category: "Salary", description: "Staff salary - Suresh June", amount: 18000, date: "2025-06-01", vendor: "Suresh Kumar", paymentMethod: "Bank Transfer" },
  { id: "e16", category: "Salary", description: "Staff salary - Meena June", amount: 15000, date: "2025-06-01", vendor: "Meena Devi", paymentMethod: "Bank Transfer" },
  { id: "e17", category: "Transport", description: "Courier charges June", amount: 2800, date: "2025-06-12", vendor: "BlueDart", paymentMethod: "UPI" },
  { id: "e18", category: "Marketing", description: "Pamphlet printing", amount: 3000, date: "2025-06-15", vendor: "Quick Print", paymentMethod: "Cash" },
  { id: "e19", category: "Raw Material", description: "Packaging material", amount: 4500, date: "2025-06-18", vendor: "Packwell", paymentMethod: "Cash" },
  { id: "e20", category: "Insurance", description: "Shop insurance quarterly", amount: 6000, date: "2025-06-20", vendor: "HDFC Ergo", paymentMethod: "Bank Transfer" },
];

export const defaultBusinessProfile = {
  name: "Sharma Electronics & General Store",
  gstin: "27AAPFU0939F1ZV",
  address: "Shop No. 12, Market Area, Pune - 411001",
  phone: "9876543200",
  email: "info@sharmastore.com",
  state: "Maharashtra",
};
