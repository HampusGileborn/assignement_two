import mongoose from "mongoose";
import prompt from "prompt-sync";
import { newCategory } from './functions/newCategory.js';
import { newProduct } from "./functions/newProduct.js";


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
const Product = mongoose.model("Product", productSchema);
const Offer = mongoose.model("Offer", offerSchema);
const Supplier = mongoose.model("Supplier", supplierSchema);
const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);
const Category = mongoose.model('Category', categorySchema);


async function runQuerys() {
  try {
    const p = prompt();

    while (true) {
      console.log(
        " 1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier \n 5. View all offers within a price range \n 6. View all offers that contain a product from a specific category \n 7. View the number of offers based on the number of its products in stock \n 8. Create order for products \n 9. Create order for offers \n 10. Ship orders \n 11. Add a new supplier \n 12. View suppliers \n 13. View all sales \n 14. View sum of all profit \n 15. Exit Application"
      );

                            // 1. Add new category
                            //  2. Add new product
                            //  3. View products by category
                            //  4. View products by supplier
                            //  5. View all offers within a price range
                            //  6. View all offers that contain a product from a specific category
                            //  7. View the number of offers based on the number of its products in stock
                            //  8. Create order for products
                            //  9. Create order for offers
                            //  10. Ship orders
                            //  11. Add a new supplier
                            //  12. View suppliers
                            //  13. View all sales
                            //  14. View sum of all profits
                            //  15. Exit

      console.log("----------------------------------------------");
      let input = p("Make choice by entering a number: ");
      switch (input) {
        case "1":
          await newCategory(Category);

          break;
        case "2":
          await newProduct(Product);
          
          break;
        case "3":
          await console.log("");
          break;
        case "4":
          await console.log("");
          break;
        case "5":
          await console.log("");
          break;
        case "6":
          await console.log("");
          break;
        case "7":
          await console.log("");
          break;
        case "8":
          await console.log("");
          break;
        case "9":
          await console.log("");
          break;
        case "10":
          await console.log("");
          break;
        case "11":
          await console.log("");
          break;
        case "12":
          await console.log("");
          break;
        case "13":
          await console.log("");
          break;
        case "14":
          await console.log("");
          break;
        case "15":
          await console.log("Exiting Application...");
          process.exit();
        default:
            console.log("Invalid choice, try again by choosing a number between 1-15.")
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
runQuerys();
