import prompt from "prompt-sync";
import { newCategory, newProduct, viewProductsByCategory } from './market.js';

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

      console.log("-".repeat(100));
      let input = p("Make choice by entering a number: ");
      switch (input) {
        case "1":
          await newCategory();

          break;
        case "2":
          await newProduct();

          break;
        case "3":
          await viewProductsByCategory();
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
