export class User {
   constructor() {
       this.username = null;
       this.isLoggedIn = false;
   }

   login(username, password) {
       // Simple validation for demonstration purposes
       if (username === 'admin' && password === 'password') {
           this.username = username;
           this.isLoggedIn = true;
           return true;
       }
       return false;
   }

   logout() {
       this.username = null;
       this.isLoggedIn = false;
   }

   getUsername() {
       return this.username;
   }

   isAuthenticated() {
       return this.isLoggedIn;
   }
}
