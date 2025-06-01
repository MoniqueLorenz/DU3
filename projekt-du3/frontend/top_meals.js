export async function fetchTopMeals() {
  try {
    const res = await fetch("/top-meals");
    const meals = await res.json();

    for (let i = 0; i < meals.length - 1; i++) {
      for (let j = i + 1; j < meals.length; j++) {
        if (
          meals[j].rating > meals[i].rating ||
          (meals[j].rating === meals[i].rating && meals[j].votes > meals[i].votes)
        ) {
          const temp = meals[i];
          meals[i] = meals[j];
          meals[j] = temp;
        }
      }
    }

    const top = [];
    for (let i = 0; i < 10 && i < meals.length; i++) {
      top.push(meals[i]);
    }

    console.log("Top 10 meals by rating:\n");

    for (let i = 0; i < top.length; i++) {
      const meal = top[i];
      console.log((i + 1) + ". " + meal.name + " (Rating: " + meal.rating + ", Votes: " + meal.votes + ")");
    }

  } catch (err) {
    console.error("Fel vid hämtning eller tolkning av måltidsdata:", err.message);
  }
}
