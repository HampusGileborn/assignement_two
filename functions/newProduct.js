import prompt from "prompt-sync";

export async function newProduct(Product) {
    console.log("Add data for new product: ");
    const p = prompt();

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
        console.log("----------------------------------------------");
        console.log(`Product "${name}" was added!`);
    } catch (error) {
        console.error(error);
    }
}