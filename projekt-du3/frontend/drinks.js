/*document.getElementById("nightBtn").addEventListener("click", async () => {
  try {
    // Hämta slumpmässig drink från Deno-servern
    const res = await fetch("/drink");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const drink = await res.json();

    // Hämta alla drinkrecensioner via API
    const ratingsRes = await fetch("/drink-reviews"); // ändra om din endpoint heter annorlunda
    if (!ratingsRes.ok) throw new Error(`HTTP ${ratingsRes.status} vid hämtning av recensioner`);
    const allRatings = await ratingsRes.json();

    // Hitta recension med matchande idDrink
    const review = allRatings.find(r => r.idDrink === drink.idDrink);

    /*const container = document.getElementById("drink");
    container.innerHTML = `
      <h2>${drink.strDrink}</h2>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <p><strong>Typ:</strong> ${drink.strAlcoholic}</p>
      <p><strong>Glas:</strong> ${drink.strGlass}</p>
      <h3>Instruktioner</h3>
      <p>${drink.strInstructions}</p>
      ${review ? `
        <h3>Recension</h3>
        <p><strong>Betyg:</strong> ${review.rating} (${review.votes} röster)</p>
        <p><em>${review.review.reviewer} (${review.review.date})</em></p>
        <p>${review.review.text}</p>
      ` : '<p><em>Ingen recension hittades.</em></p>'}
    `;
  } catch (err) {
    console.error("Kunde inte ladda drink:", err);
  }
}); */

document.getElementById("nightBtn").addEventListener("click", async () => {
  try {
    // Hämta slumpmässig dryck från Deno-servern
    const res = await fetch("/drink");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const drink = await res.json();

    // Hämta alla dryckrecensioner via API
    const ratingsRes = await fetch("/drink-reviews");
    if (!ratingsRes.ok) throw new Error(`HTTP ${ratingsRes.status} vid hämtning av recensioner`);
    const allRatings = await ratingsRes.json();

    // Hitta recension med matchande idDrink
    const review = allRatings.find(r => r.idDrink === drink.idDrink);

    const container = document.getElementById("drink");
    container.innerHTML = `
      <h2>${drink.strDrink}</h2>
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <p><strong>Kategori:</strong> ${drink.strCategory}</p>
      <p><strong>Alkoholhalt:</strong> ${drink.strAlcoholic}</p>
      <p><strong>Glas:</strong> ${drink.strGlass}</p>
      <h3>Instruktioner</h3>
      <p>${drink.strInstructions}</p>
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
    console.error("Kunde inte ladda dryck:", err);
  }
});
