import prompt from "prompt-sync";

export async function newCategory(Category) {
    console.log("Add data for new category: ");
    const p = prompt();

    const name = p("Enter Category name: ")
    const description = p("Enter description: ")
    
    try {
        const addedCategory = new Category({
            name,
            description,
        });
        await addedCategory.save();
        console.log("----------------------------------------------");
        console.log(`Category "${name}" was added!`);
    } catch (error) {
        console.error(error);
    }
}