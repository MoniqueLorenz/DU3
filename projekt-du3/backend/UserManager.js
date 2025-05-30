//klass som hanterar
    //Sparar användarnamn och lösenord
    //Skriver allt till users.json
    //Läser från filen när du vill kolla eller registrera användare

    export class UserManager {
        constructor(filePath = "users.json") {
          this.filePath = filePath;
        }
      
        // Läs in alla användare från filen
        async loadUsers() {
          try {
            const data = await Deno.readTextFile(this.filePath);
            return JSON.parse(data);
          } catch (err) {
            // Om filen inte finns, returnera tom lista
            if (err instanceof Deno.errors.NotFound) {
              return [];
            }
            throw err;
          }
        }
      
        // Spara användare till filen
        async saveUsers(users) {
          const text = JSON.stringify(users, null, 2);
          await Deno.writeTextFile(this.filePath, text);
        }
      
        // Registrera ny användare
        async register(username, password) {
          const users = await this.loadUsers();
      
          // Kontrollera om användarnamnet finns redan
          const existing = users.find(user => user.username === username);
          if (existing) {
            return { success: false, error: "Användarnamn finns redan." };
          }
      
          // Lägg till användaren
          users.push({ username: username, password: password });
          await this.saveUsers(users);
      
          return { success: true };
        }
      
        // Logga in
        async login(username, password) {
          const users = await this.loadUsers();
      
          // Kontrollera om användarnamn och lösenord matchar
          const user = users.find(user => user.username === username && user.password === password);
          return user ? true : false;
        }
      }
      