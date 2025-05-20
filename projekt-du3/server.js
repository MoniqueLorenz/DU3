import { serve } from "https://deno.land/std@0.190.0/http/server.ts";


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
      headers: { "Content-Type": "application/json" },
    });
  }

  //  Drink API
  if (pathname === "/drink") {
    const drink = await getRandomDrink();
    return new Response(JSON.stringify(drink), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Index HTML
  if (pathname === "/") {
    const html = await Deno.readTextFile(templatePath);
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 📜 mealsfetch.js (klient‑JS för meal)
  if (pathname === "/mealsfetch.js") {
    const js = await Deno.readTextFile("./client/mealsfetch.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  // drinks.js (klient‑JS för drink)
  if (pathname === "/drinks.js") {
    const js = await Deno.readTextFile("./client/drinks.js");
    return new Response(js, {
      headers: { "Content-Type": "application/javascript" },
    });
  }
    /*ratings get metod och post
   if (url.pathname === "/ratings" && req.method === "GET") {
    const itemId = url.searchParams.get("itemId");
    const ratings = (await loadRatings()).filter(r => !itemId || r.itemId === itemId);
    return Response.json(ratings);
  }

  if (url.pathname === "/ratings" && req.method === "POST") {
    const data = await req.json();
    const newRating = await addRating(data);
    return new Response(JSON.stringify(newRating), { status: 201, headers: { "Content-Type": "application/json" } });
  } */
  //  style.css 
  if (pathname === "/style.css") {
    const css = await Deno.readTextFile("./client/style.css");
    return new Response(css, {
      headers: { "Content-Type": "text/css" },
    });
  }

  return new Response("404 Not Found", { status: 404 });
}, { port: 8080 });
