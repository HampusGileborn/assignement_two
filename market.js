import prompt from "prompt-sync";
import {Category, Product} from "./database.js"

const p = prompt();

//case 1
export async function newCategory() {
    console.log("Add data for new category: ");

    const name = p("Enter Category name: ")
    const description = p("Enter description: ")
    
    try {
        const addedCategory = new Category({
            name,
            description,
        });
        await addedCategory.save();
        console.log("-".repeat(100));
        console.log(`Category "${name}" was added!`);
    } catch (error) {
        console.error(error);
    }
}

//case 2
export async function newProduct() {
    console.log("Add data for new product: ");

    const name = p("Enter name of product")
    const category = p("Enter catagory")
    const price = p("Enter price")
    const cost = p("Enter cost")
    const stock = p("Enter stock")

    try {
        const addedProduct = new Product({
            name,
            category,
            price,
            cost,
            stock,
        });
        await addedProduct.save();
        console.log("-".repeat(30));
        console.log(`Product "${name}" was added!`);
    } catch (error) {
        console.error(error);
    }
}

//case 3
export async function viewProductsByCategory() {
    const categories = await Category.find();
    const catagoriesList = categories.map((c, i) => (i + 1) + ". " + c.name).join("\n");
    console.log(catagoriesList);

    const choice = p("Choose category:");
    console.log(categories[choice-1].name)
    
}