// user.js - Handles user reviews and ratings

// Current active items
let currentMeal = null;
let currentDrink = null;

// Store selected ratings
let selectedMealRating = 0;
let selectedDrinkRating = 0;

// DOM elements cache
const elements = {
  mealCard: document.getElementById('meal'),
  drinkCard: document.getElementById('drink'),
  mealRatingDisplay: document.getElementById('meal-rating-display'),
  drinkRatingDisplay: document.getElementById('drink-rating-display'),
  mealStars: document.querySelectorAll('#meal-stars span'),
  drinkStars: document.querySelectorAll('#drink-stars span'),
  submitMealRatingBtn: document.getElementById('submit-meal-rating'),
  submitDrinkRatingBtn: document.getElementById('submit-drink-rating')
};

// Initialize event listeners when document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set up meal star rating functionality
  setupStarRating('meal');
  
  // Set up drink star rating functionality
  setupStarRating('drink');
  
  // Set up submit buttons
  setupSubmitButtons();
  
  // Attach review loading to the fetch buttons
  attachReviewLoaders();
});

// Setup star rating selection functionality
function setupStarRating(type) {
  const stars = document.querySelectorAll(`#${type}-stars span`);
  
  stars.forEach(star => {
    // Mouseover effect
    star.addEventListener('mouseover', () => {
      const rating = parseInt(star.dataset.rating);
      highlightStars(type, rating);
    });
    
    // Mouseout - return to selected rating
    star.addEventListener('mouseout', () => {
      const selectedRating = type === 'meal' ? selectedMealRating : selectedDrinkRating;
      highlightStars(type, selectedRating);
    });
    
    // Click to select rating
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      
      if (type === 'meal') {
        selectedMealRating = rating;
        elements.submitMealRatingBtn.disabled = false;
      } else {
        selectedDrinkRating = rating;
        elements.submitDrinkRatingBtn.disabled = false;
      }
      
      highlightStars(type, rating);
    });
  });
}

// Highlight stars based on rating
function highlightStars(type, rating) {
  const stars = document.querySelectorAll(`#${type}-stars span`);
  
  stars.forEach(star => {
    const starRating = parseInt(star.dataset.rating);
    star.style.color = starRating <= rating ? '#FFD700' : '#ccc';
  });
}

// Setup submit buttons
function setupSubmitButtons() {
  // Submit meal rating
  elements.submitMealRatingBtn.addEventListener('click', () => {
    if (!currentMeal || selectedMealRating === 0) return;
    
    submitReview('meal', currentMeal, selectedMealRating);
  });
  
  // Submit drink rating
  elements.submitDrinkRatingBtn.addEventListener('click', () => {
    if (!currentDrink || selectedDrinkRating === 0) return;
    
    submitReview('drink', currentDrink, selectedDrinkRating);
  });
}

// Submit a review for meal or drink
function submitReview(type, item, rating) {
  // Ask for review text
  const reviewText = prompt(`Add your review for ${item.name}:`, '');
  if (reviewText === null) return; // User cancelled
  
  // Create review object
  const review = {
    id: item.idMeal || item.idDrink,
    name: item.name || item.strMeal || item.strDrink,
    type: type,
    rating: rating,
    reviewer: 'You',
    date: new Date().toISOString().split('T')[0],
    review: reviewText || `Rated ${rating} out of 5 stars`
  };
  
  // In a real application, we would send this to the server
  console.log('Submitting review:', review);
  
  // For now, just display it locally
  addReviewToDisplay(type, review);
  
  // Reset rating after submission
  if (type === 'meal') {
    selectedMealRating = 0;
    elements.submitMealRatingBtn.disabled = true;
  } else {
    selectedDrinkRating = 0;
    elements.submitDrinkRatingBtn.disabled = true;
  }
  
  // Reset stars display
  highlightStars(type, 0);
  
  // Show success message
  alert('Your review has been submitted. Thank you!');
}

// Add a new review to the display
function addReviewToDisplay(type, review) {
  const container = document.getElementById(type);
  
  // Check if reviews section exists, create if not
  let reviewsSection = container.querySelector('.reviews-section');
  if (!reviewsSection) {
    reviewsSection = document.createElement('div');
    reviewsSection.className = 'reviews-section';
    reviewsSection.innerHTML = '<h3>Reviews</h3><div class="reviews-list"></div>';
    container.appendChild(reviewsSection);
  }
  
  const reviewsList = reviewsSection.querySelector('.reviews-list');
  
  // Create review element
  const reviewElement = document.createElement('div');
  reviewElement.className = 'review-item user-review';
  
  // Generate stars HTML
  const starsHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
  // Set review HTML
  reviewElement.innerHTML = `
    <div class="review-header">
      <span class="reviewer-name">${review.reviewer}</span>
      <span class="review-date">${review.date}</span>
    </div>
    <div class="review-stars">${starsHTML}</div>
    <div class="review-comment">${review.review}</div>
  `;
  
  // Add to the beginning of the list
  if (reviewsList.firstChild) {
    reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
  } else {
    reviewsList.appendChild(reviewElement);
  }
}

// Attach review loaders to the fetch buttons
function attachReviewLoaders() {
  // Add event listener after meal is fetched
  document.getElementById('fetchMealBtn').addEventListener('click', () => {
    // Wait a bit for the meal data to load
    setTimeout(async () => {
      try {
        const mealHeading = elements.mealCard.querySelector('h2');
        if (mealHeading && mealHeading.textContent !== 'Click the button to get a random meal') {
          // Store current meal
          currentMeal = {
            name: mealHeading.textContent,
            strMeal: mealHeading.textContent
          };
          
          // Try to fetch reviews
          await fetchMealReviews(currentMeal.name);
        }
      } catch (err) {
        console.error('Error loading meal reviews:', err);
      }
    }, 1000);
  });
  
  // Add event listener after drink is fetched
  document.getElementById('nightBtn').addEventListener('click', () => {
    // Wait a bit for the drink data to load
    setTimeout(async () => {
      try {
        const drinkHeading = elements.drinkCard.querySelector('h2');
        if (drinkHeading && drinkHeading.textContent !== 'Click the button to get a random drink') {
          // Store current drink
          currentDrink = {
            name: drinkHeading.textContent,
            strDrink: drinkHeading.textContent
          };
          
          // Try to fetch reviews
          await fetchDrinkReviews(currentDrink.name);
        }
      } catch (err) {
        console.error('Error loading drink reviews:', err);
      }
    }, 1000);
  });
}

// Fetch meal reviews from the all_reviews.json endpoint
async function fetchMealReviews(mealName) {
  try {
    // Fetch all reviews
    const response = await fetch('/reviews');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    const allReviews = await response.json();
    
    // Filter reviews for this meal (case insensitive)
    const mealReviews = allReviews.filter(review => 
      review.type === 'meal' && 
      review.name.toLowerCase() === mealName.toLowerCase()
    );
    
    // Display the reviews
    displayReviews('meal', mealReviews);
    
  } catch (err) {
    console.error('Error fetching meal reviews:', err);
    // Show a placeholder message
    displayReviews('meal', []);
  }
}

// Fetch drink reviews from the all_reviews.json endpoint
async function fetchDrinkReviews(drinkName) {
  try {
    // Fetch all reviews
    const response = await fetch('/reviews');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    const allReviews = await response.json();
    
    // Filter reviews for this drink (case insensitive)
    const drinkReviews = allReviews.filter(review => 
      review.type === 'drink' && 
      review.name.toLowerCase() === drinkName.toLowerCase()
    );
    
    // Display the reviews
    displayReviews('drink', drinkReviews);
    
  } catch (err) {
    console.error('Error fetching drink reviews:', err);
    // Show a placeholder message
    displayReviews('drink', []);
  }
}

// Display reviews in the UI
function displayReviews(type, reviews) {
  const container = document.getElementById(type);
  
  // Check if reviews section exists, create if not
  let reviewsSection = container.querySelector('.reviews-section');
  if (!reviewsSection) {
    reviewsSection = document.createElement('div');
    reviewsSection.className = 'reviews-section';
    reviewsSection.innerHTML = '<h3>Reviews</h3><div class="reviews-list"></div>';
    container.appendChild(reviewsSection);
  }
  
  const reviewsList = reviewsSection.querySelector('.reviews-list');
  
  // If no reviews, show message
  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    return;
  }
  
  // Clear existing reviews
  reviewsList.innerHTML = '';
  
  // Add each review
  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    
    // Generate stars HTML
    const starsHTML = '★'.repeat(Math.floor(review.rating)) + 
                      (review.rating % 1 >= 0.5 ? '½' : '') + 
                      '☆'.repeat(5 - Math.ceil(review.rating));
    
    // Set review HTML
    reviewElement.innerHTML = `
      <div class="review-header">
        <span class="reviewer-name">${review.reviewer}</span>
        <span class="review-date">${review.date}</span>
      </div>
      <div class="review-stars">${starsHTML}</div>
      <div class="review-comment">${review.review || 'No comment provided'}</div>
    `;
    
    // Add to the list
    reviewsList.appendChild(reviewElement);
  });
  
  // Calculate and display average rating
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const avgRatingElement = document.createElement('div');
  avgRatingElement.className = 'average-rating';
  
  // Generate stars HTML for average rating
  const avgStarsHTML = '★'.repeat(Math.floor(avgRating)) +
                      (avgRating % 1 >= 0.5 ? '½' : '') +
                      '☆'.repeat(5 - Math.ceil(avgRating));
  
  avgRatingElement.innerHTML = `
    <div class="avg-rating-label">Average Rating:</div>
    <div class="avg-rating-stars">${avgStarsHTML}</div>
    <div class="avg-rating-value">${avgRating.toFixed(1)}/5 (${reviews.length} review${reviews.length !== 1 ? 's' : ''})</div>
  `;
  
  // Insert at the beginning of the reviews section
  reviewsSection.insertBefore(avgRatingElement, reviewsSection.querySelector('h3').nextSibling);
}

// Calculate weighted average rating (newer reviews have more weight)
function calculateWeightedRating(reviews) {
  if (!reviews.length) return 0;
  
  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Calculate weighted sum (newer reviews have more weight)
  sortedReviews.forEach((review, index) => {
    // Weight decreases as index increases (older reviews)
    const weight = 1 / (index + 1);
    weightedSum += review.rating * weight;
    totalWeight += weight;
  });
  
  // Return weighted average
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateWeightedRating,
    formatDate
  };
}