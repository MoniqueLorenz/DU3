// Main index.js file for Food & Drink Explorer - Beginner Friendly Version

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

    //login popup viktig kod
    //setupLoginPopup();
    
});



// Tab system setup
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Loop through each tab
    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].classList.remove('active');
            }
            for (let k = 0; k < tabContents.length; k++) {
                tabContents[k].classList.remove('active');
            }
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabContentId = tab.dataset.tab + '-tab';
            const targetContent = document.getElementById(tabContentId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Load top rated items when tab is activated
                if (tab.dataset.tab === 'top-rated') {
                    loadTopRatedItems();
                }
            }
        });
    }
}

// Set up the rating system
function setupRatingSystem() {
    // Meal rating stars
    const mealStars = document.querySelectorAll('#meal-stars span');
    
    for (let i = 0; i < mealStars.length; i++) {
        const star = mealStars[i];
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(star.dataset.rating);
            highlightStars(mealStars, rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(mealStars, selectedMealRating);
        });
        
        star.addEventListener('click', function() {
            selectedMealRating = parseInt(star.dataset.rating);
            highlightStars(mealStars, selectedMealRating);
            document.getElementById('submit-meal-rating').disabled = false;
        });
    }
    
    // Drink rating stars
    const drinkStars = document.querySelectorAll('#drink-stars span');
    
    for (let i = 0; i < drinkStars.length; i++) {
        const star = drinkStars[i];
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(star.dataset.rating);
            highlightStars(drinkStars, rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(drinkStars, selectedDrinkRating);
        });
        
        star.addEventListener('click', function() {
            selectedDrinkRating = parseInt(star.dataset.rating);
            highlightStars(drinkStars, selectedDrinkRating);
            document.getElementById('submit-drink-rating').disabled = false;
        });
    }
    
    // Submit rating buttons
    document.getElementById('submit-meal-rating').addEventListener('click', function() {
        if (selectedMealRating > 0 && currentMeal) {
            submitMealReview(selectedMealRating);
        }
    });
    
    document.getElementById('submit-drink-rating').addEventListener('click', function() {
        if (selectedDrinkRating > 0 && currentDrink) {
            submitDrinkReview(selectedDrinkRating);
        }
    });
}

// Helper function to highlight stars
function highlightStars(stars, rating) {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.style.color = 'gold'; // Gold color for selected stars
        } else {
            star.style.color = 'grey'; // Gray color for unselected stars
        }
    }
}

// Setup item fetching with review integration
function setupItemFetching() {
    // Enhanced meal button functionality
    const fetchMealBtn = document.getElementById('fetchMealBtn');
    if (fetchMealBtn) {
        fetchMealBtn.addEventListener('click', function() {
            fetchRandomMeal();
        });
    }
    
    // Enhanced drink button functionality
    const nightBtn = document.getElementById('nightBtn');
    if (nightBtn) {
        nightBtn.addEventListener('click', function() {
            fetchRandomDrink();
        });
    }
}

// Fetch random meal and display with reviews
function fetchRandomMeal() {
    fetch("/meal")
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function(meal) {
            // Store current meal
            currentMeal = meal;
            
            // Get existing reviews for this meal
            fetchItemReviews('meal', meal.strMeal)
                .then(function(reviews) {
                    // Display meal with reviews
                    displayMeal(meal, reviews);
                    
                    // Reset rating
                    resetMealRating();
                });
        })
        .catch(function(error) {
            console.error("Could not load meal:", error);
            document.getElementById("meal").innerHTML = "<h2>Error loading meal. Please try again.</h2>";
        });
}

// Fetch random drink and display with reviews
function fetchRandomDrink() {
    fetch("/drink")
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function(drink) {
            // Store current drink
            currentDrink = drink;
            
            // Get existing reviews for this drink
            fetchItemReviews('drink', drink.strDrink)
                .then(function(reviews) {
                    // Display drink with reviews
                    displayDrink(drink, reviews);
                    
                    // Reset rating
                    resetDrinkRating();
                });
        })
        .catch(function(error) {
            console.error("Could not load drink:", error);
            document.getElementById("drink").innerHTML = "<h2>Error loading drink. Please try again.</h2>";
        });
}

// Display meal with reviews
function displayMeal(meal, reviews) {
    const container = document.getElementById("meal");
    
    let html = '<h2>' + meal.strMeal + '</h2>';
    html += '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '">';
    html += '<p><strong>Category:</strong> ' + meal.strCategory + '</p>';
    html += '<p><strong>Area:</strong> ' + meal.strArea + '</p>';
    html += '<h3>Instructions</h3>';
    html += '<p>' + meal.strInstructions + '</p>';
    
    if (meal.strSource) {
        html += '<p><a href="' + meal.strSource + '" target="_blank">Original Source</a></p>';
    }
    
    container.innerHTML = html;
    
    // Add reviews section
    displayReviews(container, reviews, 'meal');
}

// Display drink with reviews
function displayDrink(drink, reviews) {
    const container = document.getElementById("drink");
    
    let html = '<h2>' + drink.strDrink + '</h2>';
    html += '<img src="' + drink.strDrinkThumb + '" alt="' + drink.strDrink + '">';
    html += '<p><strong>Type:</strong> ' + drink.strAlcoholic + '</p>';
    html += '<p><strong>Glass:</strong> ' + drink.strGlass + '</p>';
    html += '<h3>Instructions</h3>';
    html += '<p>' + drink.strInstructions + '</p>';
    
    container.innerHTML = html;
    
    // Add reviews section
    displayReviews(container, reviews, 'drink');
}

// Fetch reviews for a specific item
function fetchItemReviews(type, itemName) {
    return fetch('/reviews')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error: ' + response.status);
            }
            return response.json();
        })
        .then(function(allReviews) {
            // Filter reviews for this item (case insensitive)
            const itemReviews = [];
            for (let i = 0; i < allReviews.length; i++) {
                const review = allReviews[i];
                if (review.type === type && review.name.toLowerCase() === itemName.toLowerCase()) {
                    itemReviews.push(review);
                }
            }
            return itemReviews;
        })
        .catch(function(error) {
            console.error('Error fetching ' + type + ' reviews:', error);
            return [];
        });
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
    
    // Calculate average rating
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
        totalRating += reviews[i].rating;
    }
    const avgRating = totalRating / reviews.length;
    
    // Display average rating
    const avgRatingElement = document.createElement('div');
    avgRatingElement.className = 'average-rating';
    
    const avgStarsHTML = generateStarsHTML(avgRating);
    
    let reviewText = 'review';
    if (reviews.length !== 1) {
        reviewText = 'reviews';
    }
    
    avgRatingElement.innerHTML = '<div class="avg-rating-label">Average Rating:</div>' +
        '<div class="avg-rating-stars">' + avgStarsHTML + '</div>' +
        '<div class="avg-rating-value">' + avgRating.toFixed(1) + '/5 (' + reviews.length + ' ' + reviewText + ')</div>';
    
    reviewsList.appendChild(avgRatingElement);
    
    // Add each review
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        
        const starsHTML = generateStarsHTML(review.rating);
        
        let reviewerName = 'Anonymous';
        if (review.reviewer) {
            reviewerName = review.reviewer;
        } else if (review.review && review.review.reviewer) {
            reviewerName = review.review.reviewer;
        }
        
        let reviewDate = 'No date';
        if (review.date) {
            reviewDate = review.date;
        } else if (review.review && review.review.date) {
            reviewDate = review.review.date;
        }
        
        let reviewText = 'No comment provided';
        if (review.review && review.review.text) {
            reviewText = review.review.text;
        } else if (review.review && typeof review.review === 'string') {
            reviewText = review.review;
        }
        
        reviewElement.innerHTML = '<div class="review-header">' +
            '<span class="reviewer-name">' + reviewerName + '</span>' +
            '<span class="review-date">' + reviewDate + '</span>' +
            '</div>' +
            '<div class="review-stars">' + starsHTML + '</div>' +
            '<div class="review-comment">' + reviewText + '</div>';
        
        reviewsList.appendChild(reviewElement);
    }
}

// Generate stars HTML for rating
function generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '☆';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }
    
    return starsHTML;
}

// Function to submit a meal review
function submitMealReview(rating) {
    if (!currentMeal) {
        alert('Please select a meal first!');
        return;
    }
    
    // Get review text
    const reviewText = document.getElementById("meal-review-text").value.trim();
    if (reviewText === null) {
        return; // User cancelled
    }
    
    let reviewComment = 'Rated ' + rating + ' out of 5 stars';
    if (reviewText) {
        reviewComment = reviewText;
    }
    
    // Create review object
    //fixa de med ---  date: new Date().toISOString().split('T')[0],
    const reviewData = {
        type: "meal",
        idMeal: currentMeal.idMeal,
        name: currentMeal.strMeal,
        rating: rating,
        votes: 1,
        review: {
            reviewer: 'You',
            date: new Date().toISOString().split('T')[0],
            text: reviewComment
        }
    };
    
    // Submit to server
    fetch('/add-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().then(function(error) {
                alert('Error submitting review: ' + error.error);
                throw new Error('Server error');
            });
        }
        return response.json();
    })
    .then(function(result) {
        // Add review to display immediately
        addReviewToDisplay('meal', reviewData);
        
        // Reset rating after submission
        resetMealRating();
        
        // Show confirmation
        alert('Your review has been submitted. Thank you!');
    })
    .catch(function(error) {
        console.error('Error submitting review:', error);
        alert('Network error. Please try again.');
    });
}

// Function to submit a drink review
function submitDrinkReview(rating) {
    if (!currentDrink) {
        alert('Please select a drink first!');
        return;
    }
    
    // Get review text
    const reviewText = document.getElementById("drink-review-text").value.trim();
    if (reviewText === null) {
        return; // User cancelled
    }
    
    let reviewComment = 'Rated ' + rating + ' out of 5 stars';
    if (reviewText) {
        reviewComment = reviewText;
    }
    
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
            text: reviewComment
        }
    };
    
    // Submit to server
    fetch('/add-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().then(function(error) {
                alert('Error submitting review: ' + error.error);
                throw new Error('Server error');
            });
        }
        return response.json();
    })
    .then(function(result) {
        // Add review to display immediately
        addReviewToDisplay('drink', reviewData);
        
        // Reset rating after submission
        resetDrinkRating();
        
        // Show confirmation
        alert('Your review has been submitted. Thank you!');
    })
    .catch(function(error) {
        console.error('Error submitting review:', error);
        alert('Network error. Please try again.');
    });
}

// Add a new review to the display immediately
function addReviewToDisplay(type, reviewData) {
    const container = document.getElementById(type);
    const reviewsSection = container.querySelector('.reviews-section');
    
    if (!reviewsSection) {
        return;
    }
    
    const reviewsList = reviewsSection.querySelector('.reviews-list');
    
    // Create new review element
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item user-review';
    
    const starsHTML = generateStarsHTML(reviewData.rating);
    
    reviewElement.innerHTML = '<div class="review-header">' +
        '<span class="reviewer-name">' + reviewData.review.reviewer + ' (New)</span>' +
        '<span class="review-date">' + reviewData.review.date + '</span>' +
        '</div>' +
        '<div class="review-stars">' + starsHTML + '</div>' +
        '<div class="review-comment">' + reviewData.review.text + '</div>';
    
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
        topRatedTab.addEventListener('click', function() {
            setTimeout(loadTopRatedItems, 100); // Small delay to ensure tab is active
        });
    }
}

// Load top rated items for the Top Rated tab
function loadTopRatedItems() {
    // Fetch top meals
    fetch('/top-meals')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to load meals');
            }
        })
        .then(function(topMeals) {
            populateTopList('top-meals', topMeals);
        })
        .catch(function(error) {
            document.getElementById('top-meals').innerHTML = '<li>Failed to load top meals</li>';
        });
    
    // Fetch top drinks
    fetch('/top-drinks')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to load drinks');
            }
        })
        .then(function(topDrinks) {
            populateTopList('top-drinks', topDrinks);
        })
        .catch(function(error) {
            document.getElementById('top-drinks').innerHTML = '<li>Failed to load top drinks</li>';
        });
}

// Populate top list in the Top Rated tab
function populateTopList(listId, items) {
    const list = document.getElementById(listId);
    if (!list) {
        return;
    }
    
    list.innerHTML = '';
    
    if (!items || items.length === 0) {
        list.innerHTML = '<li>No rated items available</li>';
        return;
    }
    
    // Show only first 10 items
    const maxItems = Math.min(items.length, 10);
    
    for (let i = 0; i < maxItems; i++) {
        const item = items[i];
        const starsHTML = generateStarsHTML(item.rating);
        
        const li = document.createElement('li');
        
        let voteText = 'vote';
        if (item.votes !== 1) {
            voteText = 'votes';
        }
        
        li.innerHTML = '<span class="item-name">' + item.name + '</span>' +
            '<span class="item-rating">' + starsHTML + ' (' + item.rating + ')</span>' +
            '<span class="item-votes">' + item.votes + ' ' + voteText + '</span>';
        

        li.addEventListener('click', () => {
        console.log("clicked on item");

        //implementera logik för att hämta data från item sedan ta ID och skicka den till ett API request
        //API URL FÖR att hämta information baseret  på id www.themealdb.com/api/json/v1/1/lookup.php?i=52772
        //Visa up det på hemsidan

        });
            
        list.appendChild(li);
    }
}

async function setupLoginPopup(){
    const modal = document.createElement("div");
    modal.classList.add("loginModal");

    const popup = document.createElement("div");
    popup.classList.add("loginPopup");

    popup.innerHTML = `
    <div id="auth_modal" class="modal">
        <div class="modal_content">
            <div id="login_form">
                <h2>Login</h2>
                <div class="form_group">
                    <label for="login_username">Username:</label>
                    <input type="text" id="login_username" placeholder="Enter username" required>
                </div>
                <div class="form_group">
                    <label for="login_password">Password:</label>
                    <input type="password" id="login_password" placeholder="Enter password" required>
                </div>
                <button id="login_submit">Login</button>
                <p>Don't have an account? <a href="#" id="switch_to_signup">Sign up</a></p>
            </div>
            <div id="signup_form" class="hidden">
                <h2>Sign Up</h2>
                <div class="form_group">
                    <label for="signup_username">Username:</label>
                    <input type="text" id="signup_username" placeholder="Choose a username" required>
                </div>
                <div class="form_group">
                    <label for="signup_password">Password:</label>
                    <input type="password" id="signup_password" placeholder="Choose a password" required>
                </div>
                <button id="signup_submit">Sign Up</button>
                <p>Already have an account? <a href="#" id="switch_to_login">Login</a></p>
            </div>
        </div>
    </div>
    `;

    const loginForm = popup.querySelector("#auth_modal").querySelector("#login_form");
    const signupForm = popup.querySelector("#auth_modal").querySelector("#signup_form");

    popup.querySelector("#auth_modal").querySelector("#switch_to_signup").addEventListener("click", function(){
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    })

    popup.querySelector("#auth_modal").querySelector("#switch_to_login").addEventListener("click", function(){
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
    })
    //I både signup och login - ta bort blanksteg
    loginForm.querySelector("#login_submit").addEventListener("click", async function(){
        const username = loginForm.querySelector("#login_username").value;
        const password = loginForm.querySelector("#login_password").value;

        const request = new Request("/get-user"); 
        let response = await fetch(request);         

        if (response.status === 200) {
            let content = await response.json();

            for(let user of content){
                if(user.username == username && user.password == password){
                    modal.remove();
                }
            }
        } 
    })

    async function registerUser() {
        const usernameInput = signupForm.querySelector("#signup_username").value.trim();
        const passwordInput = signupForm.querySelector("#signup_password").value.trim();
        // const messageText = signupForm.querySelector("#message_text");

        // if (!usernameInput || !passwordInput) {
        //     messageText.textContent = "Please fill in both fields!";
        //     return;
        // }

        const response = await fetch("http://localhost:8080/user", { // Ändra URL till er server
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const result = await response.json();

        // if (result.error) {
        //     messageText.textContent = result.error;
        // } else {
        //     messageText.textContent = "Account created!";
        // }
    }

    signupForm.querySelector("#signup_submit").addEventListener("click", () => {
        console.log("Button clicked"); // Kontrollera om klick händer
        registerUser();
    });

    modal.append(popup);
    document.querySelector("body").append(modal);
}


