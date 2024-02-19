import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/johan-hampus");

const Schema = mongoose.Schema;

// Define schema for products
const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  stock: { type: Number, required: true },
});

// Define schema for offers
const offerSchema = new Schema({
  products: [{ type: String, required: true }],
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

// Define schema for suppliers
const supplierSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
});

// Define schema for sales orders
const salesOrderSchema = new Schema({
  offer: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

// Define Schema for categories
const categorySchema = new Schema({
    name: { type: String, requried: true },
    description: { type: String }
});

// Define models
export const Product = mongoose.model("Product", productSchema);
export const Offer = mongoose.model("Offer", offerSchema);
export const Supplier = mongoose.model("Supplier", supplierSchema);
export const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);
export const Category = mongoose.model('Category', categorySchema);