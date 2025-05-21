// This file fetches and displays the top rated meals and drinks
document.addEventListener('DOMContentLoaded', function() {
  // Add a container for the top ratings if not already in your HTML
  if (!document.getElementById('top-ratings-container')) {
    const topRatingsContainer = document.createElement('div');
    topRatingsContainer.id = 'top-ratings-container';
    topRatingsContainer.className = 'ratings-section';
    
    const topRatingsTitle = document.createElement('h2');
    topRatingsTitle.textContent = 'Top Rated Items';
    topRatingsContainer.appendChild(topRatingsTitle);
    
    const topMealsDiv = document.createElement('div');
    topMealsDiv.id = 'top-meals';
    topMealsDiv.className = 'top-items';
    topMealsDiv.innerHTML = '<h3>Top 10 Meals</h3><div class="items-list"></div>';
    
    const topDrinksDiv = document.createElement('div');
    topDrinksDiv.id = 'top-drinks';
    topDrinksDiv.className = 'top-items';
    topDrinksDiv.innerHTML = '<h3>Top 10 Drinks</h3><div class="items-list"></div>';
    
    topRatingsContainer.appendChild(topMealsDiv);
    topRatingsContainer.appendChild(topDrinksDiv);
    
    // Add the container to the main content area
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(topRatingsContainer);
  }
  
  // Fetch top meals
  fetchTopMeals();
  
  // Fetch top drinks
  fetchTopDrinks();
});

// Fetch top 10 meals
async function fetchTopMeals() {
  try {
    const response = await fetch('/top-meals');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const topMeals = await response.json();
    displayTopItems('top-meals', topMeals);
  } catch (error) {
    console.error('Error fetching top meals:', error);
    document.querySelector('#top-meals .items-list').innerHTML = 
      '<p class="error">Failed to load top meals. Please try again later.</p>';
  }
}

// Fetch top 10 drinks
async function fetchTopDrinks() {
  try {
    const response = await fetch('/top-drinks');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const topDrinks = await response.json();
    displayTopItems('top-drinks', topDrinks);
  } catch (error) {
    console.error('Error fetching top drinks:', error);
    document.querySelector('#top-drinks .items-list').innerHTML = 
      '<p class="error">Failed to load top drinks. Please try again later.</p>';
  }
}

// Display the top rated items
function displayTopItems(containerId, items) {
  const container = document.querySelector(`#${containerId} .items-list`);
  
  if (items.length === 0) {
    container.innerHTML = '<p>No rated items available.</p>';
    return;
  }
  
  const itemsList = document.createElement('ol');
  
  items.forEach(item => {
    const listItem = document.createElement('li');
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = item.name;
    
    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'item-rating';
    // Create stars based on rating
    const stars = '★'.repeat(Math.floor(item.rating)) + 
                  (item.rating % 1 >= 0.5 ? '½' : '') +
                  '☆'.repeat(5 - Math.ceil(item.rating));
    ratingSpan.textContent = `${stars} (${item.rating})`;
    
    const votesSpan = document.createElement('span');
    votesSpan.className = 'item-votes';
    votesSpan.textContent = `${item.votes} votes`;
    
    listItem.appendChild(nameSpan);
    listItem.appendChild(ratingSpan);
    listItem.appendChild(votesSpan);
    
    itemsList.appendChild(listItem);
  });
  
  container.innerHTML = '';
  container.appendChild(itemsList);
}
