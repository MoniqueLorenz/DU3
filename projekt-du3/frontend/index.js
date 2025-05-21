 // Global variables to store current meal and drink IDs
 let currentMealId = null;
 let currentDrinkId = null;
 let mealUserRating = 0;
 let drinkUserRating = 0;
 
 // Tab functionality
 document.querySelectorAll('.tab').forEach(tab => {
   tab.addEventListener('click', () => {
     document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
     document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
     
     tab.classList.add('active');
     document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
     
     // Load top rated content when that tab is selected
     if (tab.dataset.tab === 'top-rated') {
       loadTopRatedContent();
     }
   });
 });
 
 // Load top rated content
 async function loadTopRatedContent() {
   try {
     // Load top meals
     const mealsResponse = await fetch('/top-meals');
     if (mealsResponse.ok) {
       const topMeals = await mealsResponse.json();
       const mealsList = document.getElementById('top-meals');
       mealsList.innerHTML = '';
       
       topMeals.forEach(meal => {
         const li = document.createElement('li');
         li.innerHTML = `${meal.name} <span class="stars">${'★'.repeat(Math.round(meal.rating))}</span> <span class="votes">(${meal.rating} / 5 - ${meal.votes} votes)</span>`;
         mealsList.appendChild(li);
       });
     }
     
     // Load top drinks
     const drinksResponse = await fetch('/top-drinks');
     if (drinksResponse.ok) {
       const topDrinks = await drinksResponse.json();
       const drinksList = document.getElementById('top-drinks');
       drinksList.innerHTML = '';
       
       topDrinks.forEach(drink => {
         const li = document.createElement('li');
         li.innerHTML = `${drink.name} <span class="stars">${'★'.repeat(Math.round(drink.rating))}</span> <span class="votes">(${drink.rating} / 5 - ${drink.votes} votes)</span>`;
         drinksList.appendChild(li);
       });
     }
   } catch (err) {
     console.error("Error loading top rated content:", err);
   }
 }
 
 // Enhance existing meal fetch functionality
 const originalFetchMealBtn = document.getElementById("fetchMealBtn").onclick;
 document.getElementById("fetchMealBtn").onclick = async () => {
   try {
     const res = await fetch("/meal");
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
     const meal = await res.json();
     
     // Store current meal ID
     currentMealId = meal.idMeal;
     
     // Display meal info
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
     
     // Fetch and display rating
     fetchMealRating(currentMealId);
     
     // Reset user rating
     mealUserRating = 0;
     updateMealStarDisplay();
     document.getElementById('submit-meal-rating').disabled = true;
   } catch (err) {
     console.error("Kunde inte ladda måltid:", err);
   }
 };
 
 // Enhance existing drink fetch functionality
 const originalNightBtn = document.getElementById("nightBtn").onclick;
 document.getElementById("nightBtn").onclick = async () => {
   try {
     const res = await fetch("/drink");
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
     const drink = await res.json();
     
     // Store current drink ID
     currentDrinkId = drink.idDrink;
     
     // Hämta ingredienser och mått
     const ingredients = [];
     for (let i = 1; i <= 15; i++) {
       const ingredient = drink[`strIngredient${i}`];
       const measure = drink[`strMeasure${i}`];
       if (ingredient) {
         ingredients.push(`${measure || ""} ${ingredient}`.trim());
       }
     }
     
     const container = document.getElementById("drink");
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
     
     // Fetch and display rating
     fetchDrinkRating(currentDrinkId);
     
     // Reset user rating
     drinkUserRating = 0;
     updateDrinkStarDisplay();
     document.getElementById('submit-drink-rating').disabled = true;
   } catch (err) {
     console.error("Kunde inte ladda drink:", err);
   }
 };
 
 // Fetch meal rating
 async function fetchMealRating(mealId) {
   try {
     const res = await fetch(`/ratings?itemId=${mealId}&type=meal`);
     if (res.ok) {
       const ratingData = await res.json();
       displayMealRating(ratingData);
     }
   } catch (err) {
     console.error("Error fetching meal rating:", err);
     document.getElementById('meal-rating-display').innerHTML = 
       `<div class="stars">No ratings yet</div>`;
   }
 }
 
 // Fetch drink rating
 async function fetchDrinkRating(drinkId) {
   try {
     const res = await fetch(`/ratings?itemId=${drinkId}&type=drink`);
     if (res.ok) {
       const ratingData = await res.json();
       displayDrinkRating(ratingData);
     }
   } catch (err) {
     console.error("Error fetching drink rating:", err);
     document.getElementById('drink-rating-display').innerHTML = 
       `<div class="stars">No ratings yet</div>`;
   }
 }
 
 // Display meal rating
 function displayMealRating(ratingData) {
   if (ratingData && ratingData.rating) {
     const stars = '★'.repeat(Math.round(ratingData.rating));
     const emptyStars = '☆'.repeat(5 - Math.round(ratingData.rating));
     
     document.getElementById('meal-rating-display').innerHTML = `
       <div class="stars">${stars}${emptyStars}</div>
       <div class="votes">${ratingData.rating.toFixed(1)} / 5 (${ratingData.votes} votes)</div>
     `;
   } else {
     document.getElementById('meal-rating-display').innerHTML = 
       `<div class="stars">No ratings yet</div>`;
   }
 }
 
 // Display drink rating
 function displayDrinkRating(ratingData) {
   if (ratingData && ratingData.rating) {
     const stars = '★'.repeat(Math.round(ratingData.rating));
     const emptyStars = '☆'.repeat(5 - Math.round(ratingData.rating));
     
     document.getElementById('drink-rating-display').innerHTML = `
       <div class="stars">${stars}${emptyStars}</div>
       <div class="votes">${ratingData.rating.toFixed(1)} / 5 (${ratingData.votes} votes)</div>
     `;
   } else {
     document.getElementById('drink-rating-display').innerHTML = 
       `<div class="stars">No ratings yet</div>`;
   }
 }
 
 // Set up star rating UI for meals
 document.querySelectorAll('#meal-stars span').forEach(star => {
   star.style.color = '#ddd';
   
   star.addEventListener('mouseover', () => {
     const rating = parseInt(star.dataset.rating);
     highlightMealStars(rating);
   });
   
   star.addEventListener('mouseout', () => {
     updateMealStarDisplay();
   });
   
   star.addEventListener('click', () => {
     mealUserRating = parseInt(star.dataset.rating);
     updateMealStarDisplay();
     document.getElementById('submit-meal-rating').disabled = false;
   });
 });
 
 // Set up star rating UI for drinks
 document.querySelectorAll('#drink-stars span').forEach(star => {
   star.style.color = '#ddd';
   
   star.addEventListener('mouseover', () => {
     const rating = parseInt(star.dataset.rating);
     highlightDrinkStars(rating);
   });
   
   star.addEventListener('mouseout', () => {
     updateDrinkStarDisplay();
   });
   
   star.addEventListener('click', () => {
     drinkUserRating = parseInt(star.dataset.rating);
     updateDrinkStarDisplay();
     document.getElementById('submit-drink-rating').disabled = false;
   });
 });
 
 // Highlight meal stars on hover
 function highlightMealStars(count) {
   document.querySelectorAll('#meal-stars span').forEach(star => {
     const rating = parseInt(star.dataset.rating);
     star.style.color = rating <= count ? '#FFD700' : '#ddd';
   });
 }
 
 // Highlight drink stars on hover
 function highlightDrinkStars(count) {
   document.querySelectorAll('#drink-stars span').forEach(star => {
     const rating = parseInt(star.dataset.rating);
     star.style.color = rating <= count ? '#FFD700' : '#ddd';
   });
 }
 
 // Update meal star display
 function updateMealStarDisplay() {
   document.querySelectorAll('#meal-stars span').forEach(star => {
     const rating = parseInt(star.dataset.rating);
     star.style.color = rating <= mealUserRating ? '#FFD700' : '#ddd';
   });
 }
 
 // Update drink star display
 function updateDrinkStarDisplay() {
   document.querySelectorAll('#drink-stars span').forEach(star => {
     const rating = parseInt(star.dataset.rating);
     star.style.color = rating <= drinkUserRating ? '#FFD700' : '#ddd';
   });
 }
 
 // Submit meal rating
 document.getElementById('submit-meal-rating').addEventListener('click', async () => {
   if (!currentMealId || mealUserRating === 0) return;
   
   try {
     const res = await fetch('/ratings', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         itemId: currentMealId,
         type: 'meal',
         rating: mealUserRating
       })
     });
     
     if (res.ok) {
       const updatedRating = await res.json();
       displayMealRating(updatedRating);
       document.getElementById('submit-meal-rating').disabled = true;
       alert('Rating submitted successfully!');
     } else {
       alert('Failed to submit rating. Please try again.');
     }
   } catch (err) {
     console.error('Error submitting meal rating:', err);
     alert('Error submitting rating. Please try again.');
   }
 });
 
 // Submit drink rating
 document.getElementById('submit-drink-rating').addEventListener('click', async () => {
   if (!currentDrinkId || drinkUserRating === 0) return;
   
   try {
     const res = await fetch('/ratings', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         itemId: currentDrinkId,
         type: 'drink',
         rating: drinkUserRating
       })
     });
     
     if (res.ok) {
       const updatedRating = await res.json();
       displayDrinkRating(updatedRating);
       document.getElementById('submit-drink-rating').disabled = true;
       alert('Rating submitted successfully!');
     } else {
       alert('Failed to submit rating. Please try again.');
     }
   } catch (err) {
     console.error('Error submitting drink rating:', err);
     alert('Error submitting rating. Please try again.');
   }
 });