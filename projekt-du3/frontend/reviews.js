export async function fetchAllReviews() {
  try {
    const res = await fetch("/reviews");

    if (!res.ok) {
      throw new Error(`HTTP-fel: ${res.status}`);
    }

    const reviews = await res.json(); // ✅ INGEN JSON.parse() här

    // 🖨️ Visa recensionerna i konsolen
    console.log("Alla recensioner:");
    reviews.forEach((review) => {
      console.log(`${review.type.toUpperCase()} – ${review.name}: ${review.review}`);
    });

    // 💡 Här kan du också lägga in koden för att visa recensionerna i HTML

  } catch (err) {
    console.error("Fel vid hämtning:", err.message);
  }
}
