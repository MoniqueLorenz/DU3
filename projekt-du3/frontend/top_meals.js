const file = 'meal_list_with_ratings.json';

try {
  const text = await Deno.readTextFile(file);
  const meals = JSON.parse(text);

  const sorted = meals.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });

  const top = sorted.slice(0, 10);
  console.log("🍽 Top 10 meals by rating:\n");
  top.forEach((meal, index) => {
    console.log(`${index + 1}. ${meal.name} (Rating: ${meal.rating}, Votes: ${meal.votes})`);
  });

} catch (err) {
  console.error('Failed to read or parse file:', err.message);
}
