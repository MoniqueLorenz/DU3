import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RANDOM_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL   = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const templatePath       = "../frontend/index.html";
const drinkRatingsPath   = "drink_reviews.json";
const mealRatingsPath    = "meal_reviews.json";
const allReviewsPath     = "all_reviews.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// API-funktioner
async function getRandomMealDetails() {
  const res = await fetch(RANDOM_MEAL_URL);
  const data = await res.json();
  const id = data.meals[0].idMeal;
  const detailRes = await fetch(`${LOOKUP_MEAL_URL}${id}`);
  const detail = await detailRes.json();
  return detail.meals[0];
}

async function getRandomDrink() {
  const res = await fetch(RANDOM_DRINK_URL);
  const data = await res.json();
  return data.drinks[0];
}

async function getMealRatings() {
  try {
    const text = await Deno.readTextFile(mealRatingsPath);
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function getDrinkRatings() {
  try {
    const text = await Deno.readTextFile(drinkRatingsPath);
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function getAllReviews() {
  try {
    const text = await Deno.readTextFile(allReviewsPath);
    return JSON.parse(text);
  } catch {
    // If all_reviews.json doesn't exist, combine from meal and drink reviews
    const mealReviews = await getMealRatings();
    const drinkReviews = await getDrinkRatings();
    
    const combined = [
      ...mealReviews.map(review => ({
        ...review,
        type: 'meal'
      })),
      ...drinkReviews.map(review => ({
        ...review,
        type: 'drink'
      }))
    ];
    
    // Save combined reviews for future use
    await Deno.writeTextFile(allReviewsPath, JSON.stringify(combined, null, 2));
    return combined;
  }
}

async function saveReview(review, isMeal = true) {
  const path = isMeal ? mealRatingsPath : drinkRatingsPath;
  let reviews = [];

  try {
    const text = await Deno.readTextFile(path);
    reviews = JSON.parse(text);
  } catch {
    reviews = [];
  }

  // Check if review for this item already exists
  const existingIndex = reviews.findIndex(r => 
    (isMeal ? r.idMeal : r.idDrink) === (isMeal ? review.idMeal : review.idDrink)
  );

  if (existingIndex >= 0) {
    // Update existing review
    reviews[existingIndex] = review;
  } else {
    // Add new review
    reviews.push(review);
  }

  await Deno.writeTextFile(path, JSON.stringify(reviews, null, 2));
  
  // Update combined reviews file
  await getAllReviews();
}

// Server
serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle POST requests for adding reviews
  if (req.method === "POST" && pathname === "/add-review") {
    try {
      const body = await req.json();

      if (
        !body.type || 
        !(body.idMeal || body.idDrink) || 
        !body.name || 
        typeof body.rating !== "number" || 
        typeof body.votes !== "number" || 
        !body.review || 
        !body.review.reviewer || 
        !body.review.date || 
        !body.review.text
      ) {
        return new Response(JSON.stringify({ error: "Invalid review format" }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const isMeal = body.type === "meal";
      await saveReview(body, isMeal);

      return new Response(JSON.stringify({ success: true }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  // API endpoints
  if (pathname === "/meal") {
    const meal = await getRandomMealDetails();
    return new Response(JSON.stringify(meal), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/drink") {
    const drink = await getRandomDrink();
    return new Response(JSON.stringify(drink), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/top-meals") {
    const meals = await getMealRatings();
    const topMeals = meals.sort((a, b) =>
      b.rating === a.rating ? b.votes - a.votes : b.rating - a.rating
    ).slice(0, 10);
    return new Response(JSON.stringify(topMeals), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/top-drinks") {
    const drinks = await getDrinkRatings();
    const topDrinks = drinks.sort((a, b) =>
      b.rating === a.rating ? b.votes - a.votes : b.rating - a.rating
    ).slice(0, 10);
    return new Response(JSON.stringify(topDrinks), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/meal-reviews") {
    const ratings = await getMealRatings();
    return new Response(JSON.stringify(ratings), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/drink-reviews") {
    const ratings = await getDrinkRatings();
    return new Response(JSON.stringify(ratings), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // New endpoint for all reviews (used by user.js)
  if (pathname === "/reviews") {
    const allReviews = await getAllReviews();
    return new Response(JSON.stringify(allReviews), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Serve HTML
  if (pathname === "/" || pathname === "/index.html") {
    try {
      const html = await Deno.readTextFile(templatePath);
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (err) {
      console.error("Error reading index.html:", err);
      return new Response("index.html not found", { status: 404 });
    }
  }

  // Serve JavaScript files
  const jsFiles = [
    "mealsfetch.js",
    "drinks.js",
    "top-ratings.js",
    "reviews.js",
    "top_meals.js",
    "top_drinks.js",
    "index.js",
    "combine.js",
    "user.js"
  ];

  for (const file of jsFiles) {
    if (pathname === `/${file}`) {
      try {
        const js = await Deno.readFile(`../frontend/${file}`);
        return new Response(js, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/javascript",
          },
        });
        
      } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return new Response(`${file} not found`, { status: 404 });
      }
    }
  }

  // Serve CSS
  if (pathname === "/style.css") {
    try {
      const css = await Deno.readTextFile("../frontend/style.css");
      return new Response(css, {
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    } catch (err) {
      console.error("Error reading style.css:", err);
      return new Response("style.css not found", { status: 404 });
    }
  }

  return new Response("404 Not Found", {
    status: 404,
    headers: corsHeaders,
  });
}, { port: 8080 });

console.log("Server running on http://localhost:8080");