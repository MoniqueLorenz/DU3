async function fetchReviews(endpoint, containerId) {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // rensa först

    if (data.length === 0) {
      container.textContent = "Inga recensioner ännu.";
      return;
    }

    data.forEach(item => {
      // Visa bara de som har en kommentar eller recension
      if (item.comment && item.comment.trim() !== "") {
        const div = document.createElement("div");
        div.className = "review";

        div.innerHTML = `
          <strong>${item.name || "Okänd"}</strong>
          <p>Betyg: ${item.rating} ⭐</p>
          <p>${item.comment}</p>
          <hr/>
        `;
        container.appendChild(div);
      }
    });

  } catch (err) {
    console.error("Fel vid hämtning:", err);
    document.getElementById(containerId).textContent = "Kunde inte hämta recensioner.";
  }
}

fetchReviews("/meal-reviews", "meal-reviews");
fetchReviews("/drink-reviews", "drink-reviews");
