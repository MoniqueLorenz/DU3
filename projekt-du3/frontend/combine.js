// combine_reviews.js - Script to combine meal and drink reviews into one file

// This script combines reviews from meal_list_with_ratings.json and drink_list_with_ratings.json
// to create a comprehensive reviews file that can be accessed from the frontend

async function combineReviews() {
    try {
      console.log("Starting to combine reviews...");
      
      // Read meal reviews
      const mealText = await Deno.readTextFile("meal_list_with_ratings.json");
      const meals = JSON.parse(mealText);
      
      // Read drink reviews
      const drinkText = await Deno.readTextFile("drink_list_with_ratings.json");
      const drinks = JSON.parse(drinkText);
      
      // Format meals with reviews
      const mealReviews = meals
        .filter(meal => meal.review) // Only include meals that have reviews
        .map(meal => ({
          id: meal.id,
          name: meal.name,
          type: "meal",
          rating: meal.rating,
          votes: meal.votes,
          reviewer: meal.review.reviewer,
          date: meal.review.date,
          review: meal.review.text
        }));
      
      // Format drinks with reviews
      const drinkReviews = drinks
        .filter(drink => drink.review) // Only include drinks that have reviews
        .map(drink => ({
          id: drink.id,
          name: drink.name,
          type: "drink",
          rating: drink.rating,
          votes: drink.votes,
          reviewer: drink.review.reviewer,
          date: drink.review.date,
          review: drink.review.text
        }));
      
      // Combine all reviews
      const allReviews = [...mealReviews, ...drinkReviews];
      
      // Sort by most recent first
      allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Write to all_reviews.json
      await Deno.writeTextFile("all_reviews.json", JSON.stringify(allReviews, null, 2));
      
      console.log(`✅ Successfully combined ${mealReviews.length} meal reviews and ${drinkReviews.length} drink reviews!`);
      console.log(`✅ Total of ${allReviews.length} reviews saved to all_reviews.json`);
      
    } catch (err) {
      console.error("❌ Error combining reviews:", err.message);
    }
  }
  
  // Run the function
  combineReviews();