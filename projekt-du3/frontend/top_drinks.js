export async function fetchTopDrinks() {
  try {
    const res = await fetch("/top-drinks");
    const drinks = await res.json();

    for (let i = 0; i < drinks.length - 1; i++) {
      for (let j = i + 1; j < drinks.length; j++) {
        if (
          drinks[j].rating > drinks[i].rating ||
          (drinks[j].rating === drinks[i].rating && drinks[j].votes > drinks[i].votes)
        ) {
          const temp = drinks[i];
          drinks[i] = drinks[j];
          drinks[j] = temp;
        }
      }
    }

    const top = [];
    for (let i = 0; i < 10 && i < drinks.length; i++) {
      top.push(drinks[i]);
    }

    console.log("Top 10 drinks by rating:\n");

    for (let i = 0; i < top.length; i++) {
      const drink = top[i];
      console.log((i + 1) + ". " + drink.name + " (Rating: " + drink.rating + ", Votes: " + drink.votes + ")");
    }

  } catch (err) {
    console.error("Fel vid hämtning eller tolkning av drinkdata:", err.message);
  }
}
