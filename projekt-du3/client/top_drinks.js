const file = 'drink_list_with_ratings.json';

try {
  const text = await Deno.readTextFile(file);
  const drinks = JSON.parse(text);

  const sorted = drinks.sort((a, b) => {
    if (b.rating === a.rating) return b.votes - a.votes;
    return b.rating - a.rating;
  });

  const top = sorted.slice(0, 10);
  console.log(" Top 10 drinks by rating:\n");
  top.forEach((drink, index) => {
    console.log(`${index + 1}. ${drink.name} (Rating: ${drink.rating}, Votes: ${drink.votes})`);
  });

} catch (err) {
  console.error('Failed to read or parse file:', err.message);
}
