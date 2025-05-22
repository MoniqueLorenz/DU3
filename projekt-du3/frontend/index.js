// Main index.js file for Food & Drink Explorer

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    setupTabs();
    
    // Rating system setup
    setupRatingSystem();
    
    // Load reviews if items are displayed
    setupReviewsDisplay();
    
    // Load top-rated items
    fetchTopRatedItems();
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
        document.getElementById(tabContentId).classList.add('active');
      });
    });
  }
  
  // Set up the rating system
  function setupRatingSystem() {
    // Meal rating stars
    const mealStars = document.querySelectorAll('#meal-stars span');
    let selectedMealRating = 0;
    
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
    let selectedDrinkRating = 0;
    
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
      if (selectedMealRating > 0) {
        submitMealReview(selectedMealRating);
      }
    });
    
    document.getElementById('submit-drink-rating').addEventListener('click', () => {
      if (selectedDrinkRating > 0) {
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
  
  // Function to submit a meal review
  function submitMealReview(rating) {
    const mealElement = document.getElementById('meal');
    const mealName = mealElement.querySelector('h2')?.textContent;
    
    if (!mealName) {
      alert('Please select a meal first!');
      return;
    }
    
    // Get review text
    const reviewText = prompt('Add a comment for your review (optional):');
    
    // Create review object
    const review = {
      rating: rating,
      comment: reviewText || 'Great meal!',
      date: new Date().toISOString().split('T')[0],
      reviewer: 'User'
    };
    
    // Display the new review
    displayNewReview('meal', review);
    
    // Reset rating after submission
    document.getElementById('submit-meal-rating').disabled = true;
    highlightStars(document.querySelectorAll('#meal-stars span'), 0);
    
    // Show confirmation
    alert('Your review has been submitted. Thank you!');
  }
  
  // Function to submit a drink review
  function submitDrinkReview(rating) {
    const drinkElement = document.getElementById('drink');
    const drinkName = drinkElement.querySelector('h2')?.textContent;
    
    if (!drinkName) {
      alert('Please select a drink first!');
      return;
    }
    
    // Get review text
    const reviewText = prompt('Add a comment for your review (optional):');
    
    // Create review object
    const review = {
      rating: rating,
      comment: reviewText || 'Delicious drink!',
      date: new Date().toISOString().split('T')[0],
      reviewer: 'User'
    };
    
    // Display the new review
    displayNewReview('drink', review);
    
    // Reset rating after submission
    document.getElementById('submit-drink-rating').disabled = true;
    highlightStars(document.querySelectorAll('#drink-stars span'), 0);
    
    // Show confirmation
    alert('Your review has been submitted. Thank you!');
  }
  
  // Setup reviews display when a meal or drink is loaded
  function setupReviewsDisplay() {
    // When "Get Random Meal" button is clicked, try to fetch reviews after meal loads
    document.getElementById('fetchMealBtn').addEventListener('click', () => {
      setTimeout(() => {
        fetchAndDisplayReviews('meal');
      }, 1000); // Wait for the meal to load
    });
    
    // When "Get Random Drink" button is clicked, try to fetch reviews after drink loads
    document.getElementById('nightBtn').addEventListener('click', () => {
      setTimeout(() => {
        fetchAndDisplayReviews('drink');
      }, 1000); // Wait for the drink to load
    });
  }
  
  // Fetch and display reviews for a meal or drink
  async function fetchAndDisplayReviews(type) {
    const container = document.getElementById(type);
    const itemName = container.querySelector('h2')?.textContent;
    
    if (!itemName) return;
    
    try {
      // Create a reviews section if it doesn't exist
      let reviewsSection = container.querySelector('.reviews-section');
      if (!reviewsSection) {
        reviewsSection = document.createElement('div');
        reviewsSection.className = 'reviews-section';
        reviewsSection.innerHTML = `
          <h3>Reviews</h3>
          <div class="reviews-list"></div>
        `;
        container.appendChild(reviewsSection);
      }
      
      // For demo purposes, we'll show some sample reviews
      // In a real app, this would fetch from your server endpoint
      const reviewsList = reviewsSection.querySelector('.reviews-list');
      reviewsList.innerHTML = '<p>Loading reviews...</p>';
      
      // Generate some sample reviews (in a real app, you'd fetch these from your API)
      const sampleReviews = [
        {
          reviewer: "Sofia N.",
          date: "2023-12-15",
          rating: 4.5,
          comment: "Really enjoyed this! Would definitely have it again."
        },
        {
          reviewer: "Erik W.",
          date: "2024-03-22",
          rating: 5,
          comment: "Absolutely perfect! One of my favorites."
        },
        {
          reviewer: "Anna K.",
          date: "2024-01-08",
          rating: 3.5,
          comment: "Pretty good, but I've had better."
        }
      ];
      
      // Display the reviews
      displayReviews(reviewsList, sampleReviews);
      
    } catch (error) {
      console.error(`Error fetching ${type} reviews:`, error);
    }
  }
  
  // Display reviews in the reviews list
  function displayReviews(container, reviews) {
    if (!reviews || reviews.length === 0) {
      container.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create reviews list
    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review-item';
      
      // Convert rating to stars
      const fullStars = Math.floor(review.rating);
      const hasHalfStar = review.rating % 1 >= 0.5;
      const emptyStars = 5 - Math.ceil(review.rating);
      
      const starsHTML = 
        '★'.repeat(fullStars) + 
        (hasHalfStar ? '½' : '') + 
        '☆'.repeat(emptyStars);
      
      reviewElement.innerHTML = `
        <div class="review-header">
          <span class="reviewer-name">${review.reviewer}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-stars">${starsHTML}</div>
        <div class="review-comment">${review.comment}</div>
      `;
      
      container.appendChild(reviewElement);
    });
  }
  
  // Display a newly submitted review
  function displayNewReview(type, review) {
    const container = document.getElementById(type);
    
    // Find or create reviews section
    let reviewsSection = container.querySelector('.reviews-section');
    if (!reviewsSection) {
      reviewsSection = document.createElement('div');
      reviewsSection.className = 'reviews-section';
      reviewsSection.innerHTML = `
        <h3>Reviews</h3>
        <div class="reviews-list"></div>
      `;
      container.appendChild(reviewsSection);
    }
    
    const reviewsList = reviewsSection.querySelector('.reviews-list');
    
    // Create new review element
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item user-review';
    
    // Convert rating to stars
    const starsHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    reviewElement.innerHTML = `
      <div class="review-header">
        <span class="reviewer-name">${review.reviewer} (You)</span>
        <span class="review-date">${review.date}</span>
      </div>
      <div class="review-stars">${starsHTML}</div>
      <div class="review-comment">${review.comment}</div>
    `;
    
    // Add the new review at the top of the list
    if (reviewsList.firstChild) {
      reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
    } else {
      reviewsList.appendChild(reviewElement);
    }
  }
  
  // Fetch top rated items for the Top Rated tab
  function fetchTopRatedItems() {
    // Fetch top meals for the Top Rated tab
    fetch('/top-meals')
      .then(response => response.json())
      .then(data => {
        populateTopList('top-meals', data);
      })
      .catch(error => {
        console.error('Error fetching top meals:', error);
        document.getElementById('top-meals').innerHTML = '<li>Failed to load top meals</li>';
      });
    
    // Fetch top drinks for the Top Rated tab
    fetch('/top-drinks')
      .then(response => response.json())
      .then(data => {
        populateTopList('top-drinks', data);
      })
      .catch(error => {
        console.error('Error fetching top drinks:', error);
        document.getElementById('top-drinks').innerHTML = '<li>Failed to load top drinks</li>';
      });
  }
  
  // Populate top list in the Top Rated tab
  function populateTopList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    
    items.slice(0, 10).forEach((item, index) => {
      const fullStars = Math.floor(item.rating);
      const hasHalfStar = item.rating % 1 >= 0.5;
      const emptyStars = 5 - Math.ceil(item.rating);
      
      const starsHTML = 
        '★'.repeat(fullStars) + 
        (hasHalfStar ? '½' : '') + 
        '☆'.repeat(emptyStars);
      
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-rating">${starsHTML} (${item.rating})</span>
        <span class="item-votes">${item.votes} votes</span>
      `;
      list.appendChild(li);
    });
  }