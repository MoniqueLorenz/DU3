//User
class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    async register(){
        const response = await fetch("/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: this.username, password: this.password })
        });
        
        return await response.json();
    }
}


//Item (Meal/Drink)
class Item {
    constructor(id, name, type) {
      this.id = id;           // idMeal eller idDrink
      this.name = name;       // Namn på maträtten/drycken
      this.type = type;       // 'meal' eller 'drink'
      this.reviews = [];      // Lista med recensioner
    }
  
    addReview({ reviewer, rating, text }) {
      const review = {
        reviewer: reviewer || 'Anonymous',
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        text: text || `Rated ${rating} out of 5 stars`
      };
      this.reviews.push(review);
    }
  
    getAverageRating() {
      if (this.reviews.length === 0) return 0;
      const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      return total / this.reviews.length;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        type: this.type,
        averageRating: this.getAverageRating().toFixed(1),
        reviews: this.reviews
      };
    }
  }
  

