const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

const allMeals = [];

for (const letter of alphabet) {
  const url = `${baseUrl}${letter}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    if (data.meals) {
      for (const meal of data.meals) {
        allMeals.push({
          id: meal.idMeal,
          name: meal.strMeal,
          rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1.0–5.0
          votes: Math.floor(Math.random() * 491 + 10) // 10–500
        });
      }
    }
  } catch (err) {
    console.error(`Error fetching for letter '${letter}':`, err.message);
  }
}

const jsonText = JSON.stringify(allMeals, null, 2);

try {
  await Deno.writeTextFile('meal_list_with_ratings.json', jsonText);
  console.log(`Saved ${allMeals.length} meals with ratings to meal_list_with_ratings.json`);
} catch (err) {
  console.error('Failed to write file:', err.message);
}
