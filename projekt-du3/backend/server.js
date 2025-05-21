/*import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

if (req.method === "OPTIONS") {
  return new Response(null, {
    headers: corsHeaders
  });
}

const RANDOM_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL   = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const templatePath       = "./client/index.html";

//  Hämtar random måltid
async function getRandomMealDetails() {
  const res       = await fetch(RANDOM_MEAL_URL);
  const data      = await res.json();
  const id        = data.meals[0].idMeal;
  const detailRes = await fetch(`${LOOKUP_MEAL_URL}${id}`);
  const detail   = await detailRes.json();
  return detail.meals[0];
}

// Hämtar random drink
async function getRandomDrink() {
  const res   = await fetch(RANDOM_DRINK_URL);
  const data  = await res.json();
  return data.drinks[0];
}

serve(async (req) => {
  const { pathname } = new URL(req.url);

  // Meal API
  if (pathname === "/meal") {
    const meal = await getRandomMealDetails();
    return new Response(JSON.stringify(meal), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  //  Drink API
  if (pathname === "/drink") {
    const drink = await getRandomDrink();
    return new Response(JSON.stringify(drink), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Index HTML
  if (pathname === "/") {
    const html = await Deno.readTextFile(templatePath);
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 📜 mealsfetch.js (klient‑JS för meal)
  if (pathname === "/mealsfetch.js") {
    const js = await Deno.readTextFile("./client/mealsfetch.js");
    return new Response(js, {
      headers: { ...corsHeaders, "Content-Type": "application/javascript" },
    });
  }

  // drinks.js (klient‑JS för drink)
  if (pathname === "/drinks.js") {
    const js = await Deno.readTextFile("./client/drinks.js");
    return new Response(js, {
      headers: {...corsHeaders, "Content-Type": "application/javascript" },
    });
  }
 
  //  style.css 
  if (pathname === "/style.css") {
    const css = await Deno.readTextFile("./client/style.css");
    return new Response(css, {
      headers: { "Content-Type": "text/css" },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}, { port: 8080 }); 
*/
/*import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RANDOM_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL   = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const templatePath       = "./frontend/index.html";
const drinkRatingsPath   = "drink_list_with_ratings.json";
const mealRatingsPath    = "meal_list_with_ratings.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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

async function readJsonFile(path) {
  try {
    const text = await Deno.readTextFile(path);
    return JSON.parse(text);
  } catch (err) {
    console.error(`Failed to read ${path}:`, err.message);
    return [];
  }
}

async function getMealRatings() {
  return readJsonFile(mealRatingsPath);
}

async function getDrinkRatings() {
  return readJsonFile(drinkRatingsPath);
}

async function getTopMeals() {
  const meals = await getMealRatings();
  const sorted = meals.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });
  return sorted.slice(0, 10);
}

async function getTopDrinks() {
  const drinks = await getDrinkRatings();
  const sorted = drinks.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });
  return sorted.slice(0, 10);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const { pathname } = url;

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
    const topMeals = await getTopMeals();
    return new Response(JSON.stringify(topMeals), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/top-drinks") {
    const topDrinks = await getTopDrinks();
    return new Response(JSON.stringify(topDrinks), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/meal-ratings") {
    const ratings = await getMealRatings();
    return new Response(JSON.stringify(ratings), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/drink-ratings") {
    const ratings = await getDrinkRatings();
    return new Response(JSON.stringify(ratings), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // NYA endpoints
  if (pathname === "/meal-reviews") {
    const reviews = await getMealRatings(); // Samma fil som ratings, men du kan filtrera ut kommentarer om du vill
    return new Response(JSON.stringify(reviews), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/drink-reviews") {
    const reviews = await getDrinkRatings(); // Samma sak här
    return new Response(JSON.stringify(reviews), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (pathname === "/" || pathname === "/index.html") {
    const html = await Deno.readTextFile(templatePath);
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const clientFiles = {
    "/mealsfetch.js": "./frontend/mealsfetch.js",
    "/drinks.js": "./frontend/drinks.js",
    "/top-ratings.js": "./frontend/top-ratings.js",
  };

  if (pathname in clientFiles) {
    const js = await Deno.readTextFile(clientFiles[pathname]);
    return new Response(js, {
      headers: { ...corsHeaders, "Content-Type": "application/javascript" },
    });
  }

  if (pathname === "/style.css") {
    const css = await Deno.readTextFile("./frontend/style.css");
    return new Response(css, {
      headers: { ...corsHeaders, "Content-Type": "text/css" },
    });
  }

  return new Response("404 Not Found", { status: 404, headers: corsHeaders });
}, { port: 8080 });
*/

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RANDOM_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL   = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const templatePath       = "../frontend/index.html";
const mealReviewsPath    = "meal_reviews.json";
const drinkReviewsPath   = "drink_reviews.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

async function getRandomMealDetails() {
  const res       = await fetch(RANDOM_MEAL_URL);
  const data      = await res.json();
  const id        = data.meals[0].idMeal;
  const detailRes = await fetch(`${LOOKUP_MEAL_URL}${id}`);
  const detail    = await detailRes.json();
  return detail.meals[0];
}

async function getRandomDrink() {
  const res   = await fetch(RANDOM_DRINK_URL);
  const data  = await res.json();
  return data.drinks[0];
}

async function getMealReviews() {
  try {
    const text = await Deno.readTextFile(mealReviewsPath);
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to read meal reviews:', err.message);
    return [];
  }
}

async function getDrinkReviews() {
  try {
    const text = await Deno.readTextFile(drinkReviewsPath);
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to read drink reviews:', err.message);
    return [];
  }
}

// Top 10 meals based on rating & votes
async function getTopMeals() {
  const meals = await getMealReviews();
  const sorted = meals.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });
  return sorted.slice(0, 10);
}

// Top 10 drinks based on rating & votes
async function getTopDrinks() {
  const drinks = await getDrinkReviews();
  const sorted = drinks.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });
  return sorted.slice(0, 10);
}

serve(async (req) => {
  const url = new URL(req.url);
  const { pathname } = url;

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Meal API
  if (pathname === "/meal") {
    const meal = await getRandomMealDetails();
    return new Response(JSON.stringify(meal), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Drink API
  if (pathname === "/drink") {
    const drink = await getRandomDrink();
    return new Response(JSON.stringify(drink), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Top 10 meals API
  if (pathname === "/top-meals") {
    const topMeals = await getTopMeals();
    return new Response(JSON.stringify(topMeals), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Top 10 drinks API
  if (pathname === "/top-drinks") {
    const topDrinks = await getTopDrinks();
    return new Response(JSON.stringify(topDrinks), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // All meal reviews (ratings + reviews)
  if (pathname === "/meal-reviews") {
    const reviews = await getMealReviews();
    return new Response(JSON.stringify(reviews), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // All drink reviews (ratings + reviews)
  if (pathname === "/drink-reviews") {
    const reviews = await getDrinkReviews();
    return new Response(JSON.stringify(reviews), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Serve frontend files (HTML, JS, CSS)
  if (pathname === "/" || pathname === "/index.html") {
    const html = await Deno.readTextFile(templatePath);
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });
  }

  if (pathname === "/mealsfetch.js") {
    const js = await Deno.readTextFile("../frontend/mealsfetch.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript", ...corsHeaders },
    });
  }

  if (pathname === "/drinks.js") {
    const js = await Deno.readTextFile("../frontend/drinks.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript", ...corsHeaders },
    });
  }

  if (pathname === "/top-ratings.js") {
    const js = await Deno.readTextFile("../frontend/top-ratings.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript", ...corsHeaders },
    });
  }

  if (pathname === "/style.css") {
    const css = await Deno.readTextFile("../frontend/style.css");
    return new Response(css, {
      headers: { "Content-Type": "text/css", ...corsHeaders },
    });
  }

  return new Response("404 Not Found", {
    status: 404,
    headers: corsHeaders,
  });
}, { port: 8080 });
