const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

const allMeals = [];

const reviewers = [
  "Mats L.", "Anna K.", "Jonas P.", "Sofia N.", "Erik W.",
  "Lina T.", "Oscar D.", "Elin B.", "Daniel Z.", "Camilla E.",
  "Sebastian H.", "Nora M.", "Hugo J.", "Karin R.", "Lucas F."
];

function randomDateWithinLastTwoYears() {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const randomTimestamp = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  return new Date(randomTimestamp).toISOString().split("T")[0];
}

function generateReviewObject(rating) {
  const reviews = {
    great: [
      "Otroligt god! En ny favorit.",
      "Fantastisk smak – skulle äta detta varje vecka!",
      "Wow, det här var något extra!",
      "Perfekt till både vardag och fest.",
      "En riktig fullträff, rekommenderas varmt!"
    ],
    good: [
      "Väldigt god och värd att prova!",
      "Smakrikt och mättande.",
      "En fin överraskning – lagar gärna igen.",
      "Mycket trevlig rätt.",
      "Inte perfekt, men väldigt god."
    ],
    ok: [
      "Helt okej, men inget jag lagar igen.",
      "Smaken var okej men inte min stil.",
      "Neutral upplevelse, varken bra eller dålig.",
      "Lite tråkig i längden.",
      "Fungerar – men inget speciellt."
    ],
    bad: [
      "Inte riktigt min smak.",
      "Kände inte riktigt att det passade mig.",
      "Kanske bättre med några ändringar.",
      "Lite för konstig för min smak.",
      "Smakerna fungerade inte ihop tyvärr."
    ],
    terrible: [
      "Smaken föll mig inte alls i smaken.",
      "Detta var inte gott.",
      "Tyvärr inget jag vill prova igen.",
      "En besvikelse.",
      "Smakade konstigt – undviker i framtiden."
    ]
  };

  let selectedPool;
  if (rating >= 4.5) selectedPool = reviews.great;
  else if (rating >= 4.0) selectedPool = reviews.good;
  else if (rating >= 3.0) selectedPool = reviews.ok;
  else if (rating >= 2.0) selectedPool = reviews.bad;
  else selectedPool = reviews.terrible;

  return {
    reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
    date: randomDateWithinLastTwoYears(),
    text: selectedPool[Math.floor(Math.random() * selectedPool.length)]
  };
}

for (const letter of alphabet) {
  const url = `${baseUrl}${letter}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    if (data.meals) {
      for (const meal of data.meals) {
        const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));
        const votes = Math.floor(Math.random() * 491 + 10);
        const review = generateReviewObject(rating);

        allMeals.push({
          id: meal.idMeal,
          name: meal.strMeal,
          rating,
          votes,
          review
        });
      }
    }
  } catch (err) {
    console.error(`Error fetching letter '${letter}':`, err.message);
  }
}

try {
  await Deno.writeTextFile("meal_list_with_ratings.json", JSON.stringify(allMeals, null, 2));
  console.log(`✅ Saved ${allMeals.length} meals with reviews to meal_list_with_ratings.json`);
} catch (err) {
  console.error("❌ Failed to write file:", err.message);
}
