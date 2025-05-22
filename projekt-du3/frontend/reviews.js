export async function fetchAndDisplayReviews() {
  try {
    const mealRes = await fetch("/meal-reviews");
    const drinkRes = await fetch("/drink-reviews");

    if (!mealRes.ok || !drinkRes.ok) {
      throw new Error("Misslyckades att hämta recensioner");
    }

    const mealReviews = await mealRes.json();
    const drinkReviews = await drinkRes.json();

    displayReviews("meal-reviews", mealReviews, "Måltidsrecensioner");
    displayReviews("drink-reviews", drinkReviews, "Dryckrecensioner");
  } catch (err) {
    console.error("Fel vid hämtning av recensioner:", err);
    const errorContainer = document.getElementById("error");
    if (errorContainer) {
      errorContainer.textContent = "Kunde inte ladda recensioner.";
    }
  }
}

function displayReviews(containerId, reviews, title) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!reviews || reviews.length === 0) {
    container.textContent = `Inga ${title.toLowerCase()} hittades.`;
    return;
  }

  const ul = document.createElement("ul");

  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${review.name}</strong> – Betyg: ${review.rating} (${review.votes} röster)<br>
      <em>${review.review.reviewer} (${review.review.date})</em><br>
      <p>${review.review.text}</p>
    `;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}

// Funktion för att POSTa en ny recension
async function postReview(reviewData) {
  try {
    const res = await fetch("/add-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Fel vid skickande av recension: " + data.error);
      return false;
    }

    alert("Recension skickad!");
    return true;
  } catch (error) {
    alert("Nätverksfel: " + error.message);
    return false;
  }
}

// Koppla ett formulär (lägg till i HTML ett formulär med id="reviewForm")
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reviewForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewer = form.querySelector("#reviewer").value.trim();
    const rating = parseFloat(form.querySelector("#rating").value);
    const text = form.querySelector("#reviewText").value.trim();

    // Här ska du dynamiskt hämta id och namn från den aktuella måltiden eller drycken
    // Jag sätter hårdkodat exempel för måltid:
    const idMeal = "52772"; // byt ut mot dynamiskt värde vid behov
    const name = "Chicken Handi";

    if (!reviewer || !text || isNaN(rating)) {
      alert("Fyll i alla fält korrekt.");
      return;
    }

    const reviewData = {
      type: "meal",
      idMeal,
      name,
      rating,
      votes: 1, // kan sättas dynamiskt
      review: {
        reviewer,
        date: new Date().toISOString().split("T")[0],
        text,
      },
    };

    const success = await postReview(reviewData);
    if (success) {
      form.reset();
      fetchAndDisplayReviews(); // uppdatera visade recensioner efter lyckad post
    }
  });
});

// Kör när modulen laddas
fetchAndDisplayReviews();

