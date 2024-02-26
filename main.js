import prompt from "prompt-sync";
import { calculateProfitFromShippedOrders, viewAllSales, viewAllSuppliers, addNewSupplier, shipOrders, createOrderForOffers, createOrderForProducts, newCategory, newProduct, viewProductsByCategory, viewProductsBySupplier, viewOffersInPriceRange, viewOffersByCategory, viewOffersByStock } from './market.js';

async function runQuerys() {
  try {
    const p = prompt();

    while (true) {
      console.log(
        " 1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier \n 5. View all offers within a price range \n 6. View all offers that contain a product from a specific category \n 7. View the number of offers based on the number of its products in stock \n 8. Create order for products \n 9. Create order for offers \n 10. Ship orders \n 11. Add a new supplier \n 12. View suppliers \n 13. View all sales \n 14. View sum of all profit \n 15. Exit Application"
      );
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
          await viewProductsBySupplier();
          break;
        case "5":
          await viewOffersInPriceRange();
          break;
        case "6":
          await viewOffersByCategory();
          break;
        case "7":
          await viewOffersByStock();
          break;
        case "8":
          await createOrderForProducts();
          break;
        case "9":
          await createOrderForOffers();
          break;
        case "10":
          await shipOrders();
          break;
        case "11":
          await addNewSupplier();
          break;
        case "12":
          await viewAllSuppliers();
          break;
        case "13":
          await viewAllSales();
          break;
        case "14":
          await calculateProfitFromShippedOrders();
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
