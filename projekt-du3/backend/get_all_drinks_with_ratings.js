const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';

const allDrinks = [];

for (const letter of alphabet) {
  const url = `${baseUrl}${letter}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    if (data.drinks) {
      for (const drink of data.drinks) {
        allDrinks.push({
          id: drink.idDrink,
          name: drink.strDrink,
          rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1.0–5.0
          votes: Math.floor(Math.random() * 491 + 10) // 10–500
        });
      }
    }
  } catch (err) {
    console.error(`Error fetching for letter '${letter}':`, err.message);
  }
}

const jsonText = JSON.stringify(allDrinks, null, 2);

try {
  await Deno.writeTextFile('drink_list_with_ratings.json', jsonText);
  console.log(`Saved ${allDrinks.length} drinks with ratings to drink_list_with_ratings.json`);
} catch (err) {
  console.error('Failed to write file:', err.message);
}
