// Main index.js file for Food & Drink Explorer

// Import functions from other modules
import { fetchTopMeals } from './top_meals.js';
import { fetchTopDrinks } from './top_drinks.js';

// Global variables to track current items and ratings
let currentMeal = null;
let currentDrink = null;
let selectedMealRating = 0;
let selectedDrinkRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Food & Drink Explorer loaded!');
    
    // Tab functionality
    setupTabs();
    
    // Rating system setup
    setupRatingSystem();
    
    // Load top-rated items when tab is accessed
    setupTopRatedTab();
    
    // Setup meal and drink fetching with review integration
    setupItemFetching();
});

// Tab system setup
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabContentId = `${tab.dataset.tab}-tab`;
            const targetContent = document.getElementById(tabContentId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Load top rated items when tab is activated
                if (tab.dataset.tab === 'top-rated') {
                    loadTopRatedItems();
                }
            }
        });
    });
}

// Set up the rating system
function setupRatingSystem() {
    // Meal rating stars
    const mealStars = document.querySelectorAll('#meal-stars span');
    
    mealStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(mealStars, rating);
        });
        
        star.addEventListener('mouseout', () => {
            highlightStars(mealStars, selectedMealRating);
        });
        
        star.addEventListener('click', () => {
            selectedMealRating = parseInt(star.dataset.rating);
            highlightStars(mealStars, selectedMealRating);
            document.getElementById('submit-meal-rating').disabled = false;
        });
    });
    
    // Drink rating stars
    const drinkStars = document.querySelectorAll('#drink-stars span');
    
    drinkStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(drinkStars, rating);
        });
        
        star.addEventListener('mouseout', () => {
            highlightStars(drinkStars, selectedDrinkRating);
        });
        
        star.addEventListener('click', () => {
            selectedDrinkRating = parseInt(star.dataset.rating);
            highlightStars(drinkStars, selectedDrinkRating);
            document.getElementById('submit-drink-rating').disabled = false;
        });
    });
    
    // Submit rating buttons
    document.getElementById('submit-meal-rating').addEventListener('click', () => {
        if (selectedMealRating > 0 && currentMeal) {
            submitMealReview(selectedMealRating);
        }
    });
    
    document.getElementById('submit-drink-rating').addEventListener('click', () => {
        if (selectedDrinkRating > 0 && currentDrink) {
            submitDrinkReview(selectedDrinkRating);
        }
    });
}

// Helper function to highlight stars
function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.style.color = '#FFD700'; // Gold color for selected stars
        } else {
            star.style.color = '#ccc'; // Gray color for unselected stars
        }
    });
}

// Setup item fetching with review integration
function setupItemFetching() {
    // Enhanced meal button functionality
    const fetchMealBtn = document.getElementById('fetchMealBtn');
    if (fetchMealBtn) {
        fetchMealBtn.addEventListener('click', async () => {
            try {
                await fetchRandomMeal();
            } catch (error) {
                console.error('Error fetching meal:', error);
            }
        });
    }
    
    // Enhanced drink button functionality
    const nightBtn = document.getElementById('nightBtn');
    if (nightBtn) {
        nightBtn.addEventListener('click', async () => {
            try {
                await fetchRandomDrink();
            } catch (error) {
                console.error('Error fetching drink:', error);
            }
        });
    }
}

// Fetch random meal and display with reviews
async function fetchRandomMeal() {
    try {
        const res = await fetch("/meal");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const meal = await res.json();
        
        // Store current meal
        currentMeal = meal;
        
        // Get existing reviews for this meal
        const reviews = await fetchItemReviews('meal', meal.strMeal);
        
        // Display meal with reviews
        displayMeal(meal, reviews);
        
        // Reset rating
        resetMealRating();
        
    } catch (err) {
        console.error("Could not load meal:", err);
        document.getElementById("meal").innerHTML = "<h2>Error loading meal. Please try again.</h2>";
    }
}

// Fetch random drink and display with reviews
async function fetchRandomDrink() {
    try {
        const res = await fetch("/drink");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const drink = await res.json();
        
        // Store current drink
        currentDrink = drink;
        
        // Get existing reviews for this drink
        const reviews = await fetchItemReviews('drink', drink.strDrink);
        
        // Display drink with reviews
        displayDrink(drink, reviews);
        
        // Reset rating
        resetDrinkRating();
        
    } catch (err) {
        console.error("Could not load drink:", err);
        document.getElementById("drink").innerHTML = "<h2>Error loading drink. Please try again.</h2>";
    }
}

// Display meal with reviews
function displayMeal(meal, reviews) {
    const container = document.getElementById("meal");
    
    let html = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    `;
    
    if (meal.strSource) {
        html += `<p><a href="${meal.strSource}" target="_blank">Original Source</a></p>`;
    }
    
    container.innerHTML = html;
    
    // Add reviews section
    displayReviews(container, reviews, 'meal');
}

// Display drink with reviews
function displayDrink(drink, reviews) {
    const container = document.getElementById("drink");
    
    let html = `
        <h2>${drink.strDrink}</h2>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <p><strong>Type:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <h3>Instructions</h3>
        <p>${drink.strInstructions}</p>
    `;
    
    container.innerHTML = html;
    
    // Add reviews section
    displayReviews(container, reviews, 'drink');
}

// Fetch reviews for a specific item
async function fetchItemReviews(type, itemName) {
    try {
        const response = await fetch('/reviews');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        const allReviews = await response.json();
        
        // Filter reviews for this item (case insensitive)
        const itemReviews = allReviews.filter(review => 
            review.type === type && 
            review.name.toLowerCase() === itemName.toLowerCase()
        );
        
        return itemReviews;
        
    } catch (err) {
        console.error(`Error fetching ${type} reviews:`, err);
        return [];
    }
}

// Display reviews in the UI
function displayReviews(container, reviews, type) {
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
    
    // Calculate and display average rating
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const avgRatingElement = document.createElement('div');
    avgRatingElement.className = 'average-rating';
    
    const avgStarsHTML = generateStarsHTML(avgRating);
    
    avgRatingElement.innerHTML = `
        <div class="avg-rating-label">Average Rating:</div>
        <div class="avg-rating-stars">${avgStarsHTML}</div>
        <div class="avg-rating-value">${avgRating.toFixed(1)}/5 (${reviews.length} review${reviews.length !== 1 ? 's' : ''})</div>
    `;
    
    reviewsList.appendChild(avgRatingElement);
    
    // Add each review
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        
        const starsHTML = generateStarsHTML(review.rating);
        
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.reviewer || review.review?.reviewer || 'Anonymous'}</span>
                <span class="review-date">${review.date || review.review?.date || 'No date'}</span>
            </div>
            <div class="review-stars">${starsHTML}</div>
            <div class="review-comment">${review.review?.text || review.review || 'No comment provided'}</div>
        `;
        
        reviewsList.appendChild(reviewElement);
    });
}

// Generate stars HTML for rating
function generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Function to submit a meal review
async function submitMealReview(rating) {
    if (!currentMeal) {
        alert('Please select a meal first!');
        return;
    }
    
    // Get review text
    const reviewText = prompt('Add a comment for your review (optional):');
    if (reviewText === null) return; // User cancelled
    
    // Create review object
    const reviewData = {
        type: "meal",
        idMeal: currentMeal.idMeal,
        name: currentMeal.strMeal,
        rating: rating,
        votes: 1,
        review: {
            reviewer: 'You',
            date: new Date().toISOString().split('T')[0],
            text: reviewText || `Rated ${rating} out of 5 stars`
        }
    };
    
    try {
        // Submit to server
        const response = await fetch('/add-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            alert('Error submitting review: ' + error.error);
            return;
        }
        
        // Add review to display immediately
        addReviewToDisplay('meal', reviewData);
        
        // Reset rating after submission
        resetMealRating();
        
        // Show confirmation
        alert('Your review has been submitted. Thank you!');
        
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Network error. Please try again.');
    }
}

// Function to submit a drink review
async function submitDrinkReview(rating) {
    if (!currentDrink) {
        alert('Please select a drink first!');
        return;
    }
    
    // Get review text
    const reviewText = prompt('Add a comment for your review (optional):');
    if (reviewText === null) return; // User cancelled
    
    // Create review object
    const reviewData = {
        type: "drink",
        idDrink: currentDrink.idDrink,
        name: currentDrink.strDrink,
        rating: rating,
        votes: 1,
        review: {
            reviewer: 'You',
            date: new Date().toISOString().split('T')[0],
            text: reviewText || `Rated ${rating} out of 5 stars`
        }
    };
    
    try {
        // Submit to server
        const response = await fetch('/add-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            alert('Error submitting review: ' + error.error);
            return;
        }
        
        // Add review to display immediately
        addReviewToDisplay('drink', reviewData);
        
        // Reset rating after submission
        resetDrinkRating();
        
        // Show confirmation
        alert('Your review has been submitted. Thank you!');
        
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Network error. Please try again.');
    }
}

// Add a new review to the display immediately
function addReviewToDisplay(type, reviewData) {
    const container = document.getElementById(type);
    const reviewsSection = container.querySelector('.reviews-section');
    
    if (!reviewsSection) return;
    
    const reviewsList = reviewsSection.querySelector('.reviews-list');
    
    // Create new review element
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item user-review';
    
    const starsHTML = generateStarsHTML(reviewData.rating);
    
    //lägg detta under allt senare
    reviewElement.innerHTML = `
        <div class="review-header">
            <span class="reviewer-name">${reviewData.review.reviewer} (New)</span>
            <span class="review-date">${reviewData.review.date}</span>
        </div>
        <div class="review-stars">${starsHTML}</div>
        <div class="review-comment">${reviewData.review.text}</div>
    `;
    
    // Add at the top of reviews (after average rating if it exists)
    const avgRating = reviewsList.querySelector('.average-rating');
    if (avgRating && avgRating.nextSibling) {
        reviewsList.insertBefore(reviewElement, avgRating.nextSibling);
    } else if (avgRating) {
        reviewsList.appendChild(reviewElement);
    } else {
        reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
    }
}

// Reset meal rating
function resetMealRating() {
    selectedMealRating = 0;
    document.getElementById('submit-meal-rating').disabled = true;
    highlightStars(document.querySelectorAll('#meal-stars span'), 0);
}

// Reset drink rating
function resetDrinkRating() {
    selectedDrinkRating = 0;
    document.getElementById('submit-drink-rating').disabled = true;
    highlightStars(document.querySelectorAll('#drink-stars span'), 0);
}

// Setup top rated tab functionality
function setupTopRatedTab() {
    const topRatedTab = document.querySelector('[data-tab="top-rated"]');
    if (topRatedTab) {
        topRatedTab.addEventListener('click', () => {
            setTimeout(loadTopRatedItems, 100); // Small delay to ensure tab is active
        });
    }
}

// Load top rated items for the Top Rated tab
async function loadTopRatedItems() {
    try {
        // Fetch top meals
        const mealsResponse = await fetch('/top-meals');
        if (mealsResponse.ok) {
            const topMeals = await mealsResponse.json();
            populateTopList('top-meals', topMeals);
        } else {
            document.getElementById('top-meals').innerHTML = '<li>Failed to load top meals</li>';
        }
        
        // Fetch top drinks
        const drinksResponse = await fetch('/top-drinks');
        if (drinksResponse.ok) {
            const topDrinks = await drinksResponse.json();
            populateTopList('top-drinks', topDrinks);
        } else {
            document.getElementById('top-drinks').innerHTML = '<li>Failed to load top drinks</li>';
        }
        
    } catch (error) {
        console.error('Error loading top rated items:', error);
        document.getElementById('top-meals').innerHTML = '<li>Error loading data</li>';
        document.getElementById('top-drinks').innerHTML = '<li>Error loading data</li>';
    }
}

// Populate top list in the Top Rated tab
function populateTopList(listId, items) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    list.innerHTML = '';
    
    if (!items || items.length === 0) {
        list.innerHTML = '<li>No rated items available</li>';
        return;
    }
    
    items.slice(0, 10).forEach((item, index) => {
        const starsHTML = generateStarsHTML(item.rating);
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-rating">${starsHTML} (${item.rating})</span>
            <span class="item-votes">${item.votes} vote${item.votes !== 1 ? 's' : ''}</span>
        `;
        list.appendChild(li);
    });
}