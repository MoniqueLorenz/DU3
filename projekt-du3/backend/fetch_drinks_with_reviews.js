const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';

const allDrinks = [];

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
      "Bästa drinken jag någonsin smakat!",
      "Otroligt fräsch och välbalanserad.",
      "En riktig höjdare – skulle beställa den varje gång!",
      "Fantastisk smak och bra balans.",
      "Den här drinken är magisk!"
    ],
    good: [
      "Mycket god, perfekt för sommarkvällar.",
      "Frisk och trevlig – rekommenderas!",
      "Inte dum alls, riktigt uppfriskande.",
      "Bra blandning, skulle ta den igen.",
      "Väldigt trevlig drink."
    ],
    ok: [
      "Helt okej – varken toppen eller botten.",
      "Lite svag i smaken, men ändå god.",
      "Neutral känsla – saknade något extra.",
      "Kanske inte min favorit, men funkar.",
      "Lite för söt för min smak."
    ],
    bad: [
      "Inte riktigt vad jag hoppades på.",
      "Smakerna passade inte riktigt ihop.",
      "Lite konstig eftersmak.",
      "För stark och obalanserad.",
      "Kunde varit bättre."
    ],
    terrible: [
      "Nej tack – den här gick inte ner.",
      "Usch, vad var det här?",
      "Smakade bara sprit och inget mer.",
      "Tyvärr riktigt dålig blandning.",
      "Skulle inte rekommendera."
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

    if (data.drinks) {
      for (const drink of data.drinks) {
        const rating = parseFloat((Math.random() * 4 + 1).toFixed(1));
        const votes = Math.floor(Math.random() * 491 + 10);
        const review = generateReviewObject(rating);

        allDrinks.push({
          id: drink.idDrink,
          name: drink.strDrink,
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
  await Deno.writeTextFile("drink_list_with_ratings.json", JSON.stringify(allDrinks, null, 2));
  console.log(`✅ Saved ${allDrinks.length} drinks with reviews to drink_list_with_ratings.json`);
} catch (err) {
  console.error("❌ Failed to write file:", err.message);
}
