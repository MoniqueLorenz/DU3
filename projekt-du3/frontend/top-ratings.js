
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
    console.log(topDrinks);
    displayTopItems('top-drinks', topDrinks);
  } catch (error) {
    console.error('Error fetching top drinks:', error);
    document.querySelector('#top-drinks .items-list').innerHTML = 
      '<p class="error">Failed to load top drinks. Please try again later.</p>';
  }
}

// Display the top rated items

function displayTopItems(containerId, items) {
  //  const container = document.querySelector(`#${containerId} .items-list`);
  const container = document.getElementById(containerId);
  alert(container);
  
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

    nameSpan.addEventListener('click', () => {
      const mealId = listItem.dataset.id;
      alert("clicked on item");
    });
    
    listItem.appendChild(nameSpan);
    listItem.appendChild(ratingSpan);
    listItem.appendChild(votesSpan);
    
    itemsList.appendChild(listItem);
  });
  
  
  container.innerHTML = '';
  container.appendChild(itemsList);
}
  
