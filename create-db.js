import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/johan-hampus");
const db = mongoose.connection;

// Define schemas
const Schema = mongoose.Schema;

// Define schema for products
const productSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    supplier: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true }
});

// Define schema for offers
const offerSchema = new Schema({
    offer: { type: Number, required: true },
    products: [{ type: String, required: true }],
    price: { type: Number, required: true },
    active: { type: Boolean, default: true }
});

// Define schema for suppliers
const supplierSchema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true }
});

// Define schema for sales orders
const salesOrderSchema = new Schema({
    offer: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped'], default: 'pending' }
});

// Define Schema for categories
const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
});

// Define models
const Product = mongoose.model('Product', productSchema);
const Offer = mongoose.model('Offer', offerSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);
const Category = mongoose.model('Category', categorySchema);

// Define data
const productsData = [
    { name: "Laptop", category: "Electronics", supplier: "Test", price: 1000, cost: 800, stock: 50 },
    { name: "Smartphone", category: "Electronics", supplier: "Test", price: 800, cost: 600, stock: 40 },
    { name: "T-shirt", category: "Clothing", supplier: "Test", price: 20, cost: 10, stock: 100 },
    { name: "Refrigerator", category: "Home Appliances", supplier: "Test", price: 1200, cost: 1000, stock: 30 },
    { name: "Shampoo", category: "Beauty & Personal Care", supplier: "Test", price: 10, cost: 5, stock: 80 },
    { name: "Soccer Ball", category: "Sports & Outdoors", supplier: "Test", price: 30, cost: 20, stock: 60 }
];

const offersData = [
    { offer: 1, products: ["Laptop", "Smartphone"], price: 1800, active: true },
    { offer: 2, products: ["T-shirt", "Shampoo"], price: 30, active: true },
    { offer: 3, products: ["Refrigerator", "Smartphone", "Soccer Ball"], price: 1830, active: false }
];


const suppliersData = [
    { name: "Electronics Supplier Inc.", contact: "john@electronicsupplier.com" },
    { name: "Fashion Supplier Co.", contact: "jane@fashionsupplier.com" }
];

const salesOrdersData = [
    { offer: 1, quantity: 2, status: "pending" },
    { offer: 3, quantity: 1, status: "pending" }
];
const categoriesData = [
    { name: "Electronics", description: "" },
    { name: "Clothing", description: "" },
    { name: "Home Appliances", description: "" },
    { name: "Beauty & Personal Care", description: "" },
    { name: "Sports & Outdoors", description: "" }
]

// Function to insert data into MongoDB
async function insertData() {
    try {
        // Insert offers and create a map of offer names to IDs
        const offersMap = new Map();
        for (const offerData of offersData) {
            const insertedOffer = await Offer.create(offerData);
            offersMap.set(offerData.offer, insertedOffer._id);
        }

        // Update sales orders data to reference offer IDs
        const salesOrdersWithIDs = salesOrdersData.map(order => {
            const offerID = offersMap.get(order.offer);
            if (!offerID) {
                throw new Error(`Offer "${order.offer}" not found.`);
            }
            return { ...order, offer: offerID };
        });

        // Insert products
        await Product.insertMany(productsData);

        // Insert suppliers
        await Supplier.insertMany(suppliersData);

        // Insert sales orders
        await SalesOrder.insertMany(salesOrdersWithIDs);

        // Insert categories
        await Category.insertMany(categoriesData);

        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        // Close MongoDB connection
        await mongoose.disconnect();
    }
}

// Call the function to insert data
insertData();
