// Import necessary modules and models
import prompt from "prompt-sync";
import mongoose from 'mongoose';
import { Category, Product, Supplier, Offer, SalesOrder } from "./database.js";

// Create prompt instance
const p = prompt();

// Case 1: Add a new category
export async function newCategory() {
    try {
        console.log("Add data for a new category: ");
        const name = p("Enter Category name: ");
        const description = p("Enter description: ");
        
        const addedCategory = new Category({
            name,
            description,
        });
        await addedCategory.save();
        console.log("-".repeat(100));
        console.log(`Category "${name}" was added!`);
    } catch (error) {
        console.error("Error adding new category:", error);
    }
}

// Case 2: Add a new product
export async function newProduct() {
    try {
        console.log("Add data for a new product: ");
        const name = p("Enter name of product: ");
        
        // Display existing categories for the user to choose from
        const categories = await Category.find();
        console.log("Existing Categories:");
        categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category.name}`);
        });
        console.log(`${categories.length + 1}. Add a new category`); // Option to add a new category

        // Prompt the user to choose a category or add a new one
        let categoryChoice = parseInt(p("Choose existing category or add a new one (Enter number): "));
        let category;
        // If the user chooses an existing category
        if (categoryChoice >= 1 && categoryChoice <= categories.length) {
            category = categories[categoryChoice - 1];
        } else if (categoryChoice === categories.length + 1) {
            // If the user chooses to add a new category
            const categoryName = p("Enter name for the new category: ");
            const categoryDescription = p("Enter description for the new category: ");
            const newCategory = new Category({
                name: categoryName,
                description: categoryDescription
            });
            category = await newCategory.save();
            console.log(`New category "${categoryName}" added.`);
        } else {
            console.log("Invalid category choice.");
            return;
        }

        // Display existing suppliers for the user to choose from
        const suppliers = await Supplier.find();
        console.log("Existing Suppliers:");
        suppliers.forEach((supplier, index) => {
            console.log(`${index + 1}. ${supplier.name}`);
        });
        console.log(`${suppliers.length + 1}. Add a new supplier`); // Option to add a new supplier

        // Prompt the user to choose a supplier or add a new one
        let supplierChoice = parseInt(p("Choose existing supplier or add a new one (Enter number): "));
        let supplier;
        // If the user chooses an existing supplier
        if (supplierChoice >= 1 && supplierChoice <= suppliers.length) {
            supplier = suppliers[supplierChoice - 1];
        } else if (supplierChoice === suppliers.length + 1) {
            // If the user chooses to add a new supplier
            const supplierName = p("Enter name for the new supplier: ");
            const supplierContact = p("Enter contact for the new supplier: ");
            const newSupplier = new Supplier({
                name: supplierName,
                contact: supplierContact
            });
            supplier = await newSupplier.save();
            console.log(`New supplier "${supplierName}" added.`);
        } else {
            console.log("Invalid supplier choice.");
            return;
        }

        const price = parseFloat(p("Enter price: "));
        const cost = parseFloat(p("Enter cost: "));
        const stock = parseInt(p("Enter stock: "));

        const addedProduct = new Product({
            name,
            category: category.name,
            supplier: supplier.name,
            price,
            cost,
            stock,
        });
        await addedProduct.save();
        console.log("-".repeat(30));
        console.log(`Product "${name}" was added under category "${category.name}" with supplier "${supplier.name}"`);
    } catch (error) {
        console.error("Error adding new product:", error);
    }
}
// Case 3: View products by category
export async function viewProductsByCategory() {
    try {
        const categories = await Category.find();
        console.log("Categories:");
        categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category.name}`);
        });

        const choice = parseInt(p("Choose category: "));
        const selectedCategory = categories[choice - 1];

        const products = await Product.find({ category: selectedCategory.name });
        console.log(`Products in category "${selectedCategory.name}":`);
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - Price: $${product.price}, Stock: ${product.stock}`);
        });
    } catch (error) {
        console.error("Error viewing products by category:", error);
    }
}

// Case 4: View products by supplier
export async function viewProductsBySupplier() {
    try {
        const suppliers = await Supplier.find();
        console.log("Suppliers:");
        suppliers.forEach((supplier, index) => {
            console.log(`${index + 1}. ${supplier.name}`);
        });

        const choice = parseInt(p("Choose supplier: "));
        const selectedSupplier = suppliers[choice - 1];

        const products = await Product.find({ supplier: selectedSupplier.name });
        console.log(`Products supplied by "${selectedSupplier.name}":`);
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - Price: $${product.price}, Stock: ${product.stock}`);
        });
    } catch (error) {
        console.error("Error viewing products by supplier:", error);
    }
}

// Case 5: View offers in price range
export async function viewOffersInPriceRange() {
    try {
        const minPrice = parseFloat(p("Enter minimum price: "));
        const maxPrice = parseFloat(p("Enter maximum price: "));

        const offers = await Offer.find({ price: { $gte: minPrice, $lte: maxPrice } });

        console.log(`Offers within price range $${minPrice} - $${maxPrice}:`);
        offers.forEach((offer, index) => {
            console.log(`${index + 1}. Offer ID: ${offer.offerID} - Price: $${offer.price}`);
        });
    } catch (error) {
        console.error("Error viewing offers in price range:", error);
    }
}

// Case 6: View offers by category
export async function viewOffersByCategory() {
    try {
        const categories = await Category.find();
        console.log("Categories:");
        categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category.name}`);
        });

        const choice = parseInt(p("Choose category: "));
        const selectedCategory = categories[choice - 1];

        const offers = await Offer.aggregate([
            // Match active offers
            { $match: { active: true } },
            // Lookup products based on the category
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "name", // Assuming the product name is used for the lookup
                    as: "products"
                }
            },
            // Log the intermediate result
            { $addFields: { intermediateResult: "$$ROOT" } },
            // Unwind the products array
            { $unwind: "$products" },
            // Log the intermediate result
            { $addFields: { intermediateResult2: "$$ROOT" } },
            // Match products in the selected category
            { $match: { "products.category": selectedCategory.name } },
            // Group offers by their unique identifier and accumulate necessary fields
            {
                $group: {
                    _id: "$_id",
                    price: { $first: "$price" },
                    products: { $push: "$products.name" } // Accumulate product names
                }
            }
        ]);

        console.log(`Offers containing products from category "${selectedCategory.name}":`, offers);
        offers.forEach((offer, index) => {
            console.log(`${index + 1}. Offer ID: ${offer._id} - Products: ${offer.products.join(", ")} - Price: $${offer.price}`);
        });
    } catch (error) {
        console.error("Error viewing offers by category:", error);
    }
}




// Case 7: View offers by stock
export async function viewOffersByStock() {
    try {
        const offers = await Offer.find();

        let allProductsInStock = 0;
        let someProductsInStock = 0;
        let noProductsInStock = 0;

        for (const offer of offers) {
            const products = await Product.find({ _id: { $in: offer.products } });
            const inStockProducts = products.filter(product => product.stock > 0);

            if (inStockProducts.length === products.length) {
                allProductsInStock++;
            } else if (inStockProducts.length > 0) {
                someProductsInStock++;
            } else {
                noProductsInStock++;
            }
        }

        console.log("Summary of offers based on product stock:");
        console.log(`- Offers with all products in stock: ${allProductsInStock}`);
        console.log(`- Offers with some products in stock: ${someProductsInStock}`);
        console.log(`- Offers with no products in stock: ${noProductsInStock}`);
    } catch (error) {
        console.error("Error viewing offers by stock:", error);
    }
}

// Case 8: Create order for products
export async function createOrderForProducts() {
    try {
        const products = await Product.find();
        console.log("Available Products:");
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - Price: $${product.price}, Stock: ${product.stock}`);
        });

        const selectedProductIndexes = p("Enter the indexes of the products to include in the order (comma-separated): ")
            .split(",")
            .map(index => parseInt(index.trim()) - 1);

        if (selectedProductIndexes.some(index => isNaN(index) || index < 0 || index >= products.length)) {
            console.log("Invalid product index.");
            return;
        }

        const selectedProducts = selectedProductIndexes.map(index => products[index]);

        const productQuantities = [];
        for (const product of selectedProducts) {
            const quantity = parseInt(p(`Enter the quantity of ${product.name} to order: `));
            if (isNaN(quantity) || quantity <= 0) {
                console.log(`Invalid quantity for ${product.name}.`);
                return;
            }
            if (quantity > product.stock) {
                console.log(`Insufficient stock for ${product.name}. Available stock: ${product.stock}`);
                return;
            }
            productQuantities.push({ product, quantity });
        }

        const totalPrice = productQuantities.reduce((total, { product, quantity }) => total + (product.price * quantity), 0);

        const offerProducts = productQuantities.map(({ product }) => product._id);
        const newOffer = new Offer({
            products: offerProducts,
            price: totalPrice,
            active: true
        });
        await newOffer.save();

        const newOrder = new SalesOrder({
            offer: newOffer._id,
            quantity: 1,
            status: "pending"
        });
        await newOrder.save();

        for (const { product, quantity } of productQuantities) {
            product.stock -= quantity;
            await product.save();
        }

        console.log(`Order created successfully for selected products.`);
    } catch (error) {
        console.error("Error creating order for products:", error);
    }
}

// Case 9: Create order for offers
export async function createOrderForOffers() {
    try {
        const offers = await Offer.find({ active: true });
        console.log("Available Offers:");
        offers.forEach((offer, index) => {
            console.log(`${index + 1}. Offer ID: ${offer.offerID} - Price: $${offer.price}`);
        });

        const selectedIndex = parseInt(p("Enter the index of the offer to include in the order: ")) - 1;

        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= offers.length) {
            console.log("Invalid offer index.");
            return;
        }

        const selectedOffer = offers[selectedIndex];

        const quantity = parseInt(p(`Enter the quantity of Offer ${selectedOffer.offerID} to order: `));
        if (isNaN(quantity) || quantity <= 0) {
            console.log(`Invalid quantity for Offer ${selectedOffer.offerID}.`);
            return;
        }

        const newOrder = new SalesOrder({
            offer: selectedOffer._id,
            quantity,
            status: "pending"
        });
        await newOrder.save();

        console.log(`Order created successfully for Offer ${selectedOffer.offerID}.`);
    } catch (error) {
        console.error("Error creating order for offers:", error);
    }
}

// Case 10: Ship orders
export async function shipOrders() {
    try {
        // Find all pending sales orders
        const pendingOrders = await SalesOrder.find({ status: "pending" }).populate({
            path: 'offer',
            populate: { path: 'products' }
        });

        for (const order of pendingOrders) {
            // Update order status to 'shipped'
            order.status = "shipped";
            await order.save();

            // For each product in the order's offer, decrement stock based on order quantity
            for (const productId of order.offer.products) {
                const product = await Product.findById(productId);
                if (product.stock >= order.quantity) {
                    product.stock -= order.quantity;
                    await product.save();
                } else {
                    // Handle case where there isn't enough stock
                    console.error(`Not enough stock for product ${product.name}. Unable to ship order.`);
                    // Optionally revert the order status if you want strict inventory control
                    order.status = "pending";
                    await order.save();
                    return; // Stop processing this order
                }
            }

            console.log(`Order ${order._id} shipped successfully.`);
        }

        console.log("All pending orders processed.");
    } catch (error) {
        console.error("Error shipping orders:", error);
    }
}
// Case 11: Add a new supplier
export async function addNewSupplier() {
    try {
        console.log("Add data for a new supplier: ");
        const name = p("Enter name of supplier: ");
        const contact = p("Enter contact information of supplier: ");

        const newSupplier = new Supplier({
            name,
            contact,
        });
        await newSupplier.save();
        console.log("-".repeat(100));
        console.log(`Supplier "${name}" was added!`);
    } catch (error) {
        console.error("Error adding new supplier:", error);
    }
}