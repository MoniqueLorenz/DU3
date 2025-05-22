import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RANDOM_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_MEAL_URL    = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const RANDOM_DRINK_URL   = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const templatePath       = "../frontend/index.html";
const drinkRatingsPath   = "drink_reviews.json";
const mealRatingsPath    = "meal_reviews.json";

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

async function saveReview(review, isMeal = true) {
  const path = isMeal ? "meal_reviews.json" : "drink_reviews.json";
  let reviews = [];

  try {
    const text = await Deno.readTextFile(path);
    reviews = JSON.parse(text);
  } catch {
    reviews = [];
  }

  reviews.push(review);

  await Deno.writeTextFile(path, JSON.stringify(reviews, null, 2));
}

// Server
serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
        return new Response(JSON.stringify({ error: "Invalid review format" }), { status: 400, headers: corsHeaders });
      }

      const isMeal = body.type === "meal";
      await saveReview(body, isMeal);

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }

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

  if (pathname === "/" || pathname === "/index.html") {
    try {
      const html = await Deno.readTextFile(templatePath);
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    } catch {
      return new Response("index.html hittades inte", { status: 404 });
    }
  }

  const jsFiles = [
    "mealsfetch.js",
    "drinks.js",
    "top-ratings.js",
    "reviews.js",
    "top_meals.js",
    "top_drinks.js",
    "index.js",
  ];

  for (const file of jsFiles) {
    if (pathname === `/${file}`) {
      try {
        const js = await Deno.readTextFile(`../frontend/${file}`);
        return new Response(js, {
          headers: { ...corsHeaders, "Content-Type": "text/javascript; charset=utf-8" },
        });
      } catch {
        return new Response(`${file} hittades inte`, { status: 404 });
      }
    }
  }

  if (pathname === "/style.css") {
    try {
      const css = await Deno.readTextFile("../frontend/style.css");
      return new Response(css, {
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    } catch {
      return new Response("style.css hittades inte", { status: 404 });
    }
  }

  return new Response("404 Not Found", {
    status: 404,
    headers: corsHeaders,
  });
}, { port: 8080 });