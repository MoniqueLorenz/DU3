document.getElementById("nightBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/drink");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const drink = await res.json();

    const container = document.getElementById("drink");

    // Hämta ingredienser och mått
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure || ""} ${ingredient}`.trim());
      }
    }

    container.innerHTML = `
      <h2>${drink.strDrink}</h2>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <p><strong>Kategori:</strong> ${drink.strCategory}</p>
      <p><strong>Alkoholhalt:</strong> ${drink.strAlcoholic}</p>
      <h3>Ingredienser</h3>
      <ul>
        ${ingredients.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <h3>Instruktioner</h3>
      <p>${drink.strInstructions}</p>
    `;
  } catch (err) {
    console.error("Kunde inte ladda drink:", err);
  }
});
