// script.js
// Denna fil hanterar onclick och fetchar /meal

document.getElementById("fetchMealBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/meal");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const meal = await res.json();

    const container = document.getElementById("meal");
    container.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p><strong>Kategori:</strong> ${meal.strCategory}</p>
      <p><strong>Område:</strong> ${meal.strArea}</p>
      <h3>Instruktioner</h3>
      <p>${meal.strInstructions}</p>
      <p><a href="${meal.strSource || '#'}" target="_blank">Originalkälla</a></p>
    `;
  } catch (err) {
    console.error("Kunde inte ladda måltid:", err);
  }
});
