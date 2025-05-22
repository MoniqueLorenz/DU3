export async function fetchTopDrinks() {
  try {
    const res = await fetch("/top-drinks");
    const drinks = await res.json();

    const sorted = drinks.sort((a, b) => {
      if (b.rating === a.rating) return b.votes - a.votes;
      return b.rating - a.rating;
    });

    const top = sorted.slice(0, 10);
    console.log("Top 10 drinks by rating:\n");
    top.forEach((drink, index) => {
      console.log(`${index + 1}. ${drink.name} (Rating: ${drink.rating}, Votes: ${drink.votes})`);
    });

  } catch (err) {
    console.error("Fel vid hämtning eller tolkning av drinkdata:", err.message);
  }
}
