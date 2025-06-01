/*
document.getElementById("fetchMealBtn").addEventListener("click", async () => {
  try {
    // Hämta slumpmässig måltid från Deno-servern
    const res = await fetch("/meal");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const meal = await res.json();

    // Hämta alla måltidsrecensioner via API
    const ratingsRes = await fetch("/meal-reviews"); // ändra till rätt endpoint om den är annorlunda
    if (!ratingsRes.ok) throw new Error(`HTTP ${ratingsRes.status} vid hämtning av recensioner`);
    const allRatings = await ratingsRes.json();

    // Hitta recension med matchande idMeal
    const review = allRatings.find(r => r.idMeal === meal.idMeal);

    const container = document.getElementById("meal");
    container.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p><strong>Kategori:</strong> ${meal.strCategory}</p>
      <p><strong>Område:</strong> ${meal.strArea}</p>
      <h3>Instruktioner</h3>
      <p>${meal.strInstructions}</p>
      <p><a href="${meal.strSource || '#'}" target="_blank">Originalkälla</a></p>
      ${review ? `
        <h3>Recension</h3>
        <p><strong>Betyg:</strong> ${review.rating} (${review.votes} röster)</p>
        <p><em>${review.review.reviewer} (${review.review.date})</em></p>
        <p>${review.review.text}</p>
      ` : '<p><em>Ingen recension hittades.</em></p>'}
    `;
  } catch (err) {
    console.error("Kunde inte ladda måltid:", err);
  }
});
*/
/*document.getElementById("fetchMealBtn").addEventListener("click", async () => {
  try {
    // Hämta slumpmässig måltid från Deno-servern
    const res = await fetch("/meal");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const meal = await res.json();

    // Hämta alla måltidsrecensioner via API
    const ratingsRes = await fetch("/meal-reviews");
    if (!ratingsRes.ok) throw new Error(`HTTP ${ratingsRes.status} vid hämtning av recensioner`);
    const allRatings = await ratingsRes.json();

    // Hitta recension med matchande idMeal
    const review = allRatings.find(r => r.idMeal === meal.idMeal);

    const container = document.getElementById("meal");
    container.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p><strong>Kategori:</strong> ${meal.strCategory}</p>
      <p><strong>Område:</strong> ${meal.strArea}</p>
      <h3>Instruktioner</h3>
      <p>${meal.strInstructions}</p>
      <p><a href="${meal.strSource || '#'}" target="_blank">Originalkälla</a></p>
      ${review ? `
        <h3>Recensioner</h3>
        <p><strong>Betyg:</strong> ${review.rating} (${review.votes} röster)</p>
        ${review.review.map(r => `
          <p><em>${r.reviewer} (${r.date})</em></p>
          <p>${r.text}</p>
        `).join("")}
      ` : '<p><em>Ingen recension hittades.</em></p>'}
    `;
  } catch (err) {
    console.error("Kunde inte ladda måltid:", err);
  }
});*/
document.getElementById("fetchMealBtn").addEventListener("click", async () => {
  try {
    // Hämta slumpmässig måltid från Deno-servern
    const res = await fetch("/meal");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const meal = await res.json();

    // Hämta alla måltidsrecensioner via API
    const ratingsRes = await fetch("/meal-reviews");
    if (!ratingsRes.ok) throw new Error(`HTTP ${ratingsRes.status} vid hämtning av recensioner`);
    const allRatings = await ratingsRes.json();

    // Hitta recension med matchande idMeal
    const review = allRatings.find(r => r.idMeal === meal.idMeal);

    const container = document.getElementById("meal");
    container.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p><strong>Kategori:</strong> ${meal.strCategory}</p>
      <p><strong>Område:</strong> ${meal.strArea}</p>
      <h3>Instruktioner</h3>
      <p>${meal.strInstructions}</p>
      <p><a href="${meal.strSource || '#'}" target="_blank">Originalkälla</a></p>
      ${review ? `
        <h3>Recensioner</h3>
        <p><strong>Betyg:</strong> ${review.rating} (${review.votes} röster)</p>
        ${Array.isArray(review.review) ? review.review.map(r => `
          <div class="review">
            <p><strong>${r.reviewer}</strong> (${r.date})</p>
            <p>${r.text}</p>
          </div>
        `).join('') : '<p><em>Recensioner kunde inte läsas.</em></p>'}
      ` : '<p><em>Ingen recension hittades.</em></p>'}
    `;
  } catch (err) {
    console.error("Kunde inte ladda måltid:", err);
  }
});
