// man testar skicka requests till vår server med olika endpoints, så ska vi hantera svaret man får tillbaks beroende på vad vi får tillbaka som response

// skicka några dåliga requests för att se hur servern hanterar det

// GET /favourites - hämtar listan

async function test1() {
    const request = new Request("http://localhost:8000/favourites"); 
    const response = await fetch(request);
    const favourites = await response.json();

    if(response.status == 200) {
        console.log("Test 1, godkänd!", favourites)
    } else {
        console.log("Test 1 misslyckades - status:", response.status)
    }
}

// POST /favourites - ändrar, lägger till i listan 

async function test2() {
    const options = {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: 10, // drinken med id 10 
            name: "Margarita"
        })
    }

    const request = new Request("http://localhost:8000/favourites", options); 
    const response = await fetch(request);
    const data = await response.json();

    if (response.status === 201 && data.id === 10 && data.name === "Margarita") {  // 201 istället för 200 för att indikera att något lagts till i databasen
        console.log("Test 2, godkänd!", data)
    } else {
        console.log("Test 2 misslyckades, status:", response.status, data)
    }

}

// GET /favourites/:id - hämtar ett specifikt recept ALT /favourite/name=pizza
async function test3() {
    const request = new Request("http://localhost:8000/favorites/10");
    const response = await fetch(request);
    const recipe = await response.json();

    if (response.status === 200) {
        console.log("Test 3, godkänd!)", recipe);
    } else {
        console.log("Test 3 misslyckades - status:", response.status);
    }
}

// DELETE /favourite/:id - tar bort ett specifikt recept 
async function test4() {
    const options = {
        method: "DELETE"
    };

    const request = new Request("http://localhost:8000/favorites/10", options);
    const response = await fetch(request);

    if (response.status === 200) {
        console.log("Test 4 godkänd, recept raderat!");
    } else {
        console.log("Test 4 misslyckades - status:", response.status);
    }
}

// TEST SOM ÄR FEL SKRIVNA MEDVETET

// Testar POST utan data (borde ge 400 Bad Request)
async function testError1() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // Skickar en tom body
    };

    const request = new Request("http://localhost:8000/favorites", options);
    const response = await fetch(request);

    if (response.status === 400) {
        console.log("TestError 1 godkänd");
    } else {
        console.log("Test Error 1 misslyckades - status:", response.status);
    }
}

// Testa GET på ett icke-existerande recept (borde ge 404 Not Found)
async function testError2() {
    const request = new Request("http://localhost:8000/favorites/9999"); // detta ID finns ej
    const response = await fetch(request);

    if (response.status === 404) {
        console.log("TestError 2 godkänd, id finns ej!");
    } else {
        console.log("TestError 2 misslyckades - status:", response.status);
    }
}

// Testa DELETE på ett ID som inte finns (borde ge 404 Not Found)
async function testError3() {
    const options = { method: "DELETE" };
    const request = new Request("http://localhost:8000/favorites/9999", options); // ID som inte finns
    const response = await fetch(request);

    if (response.status === 404) {
        console.log("TestError 3 godkänd, id finns ej!");
    } else {
        console.log("TestError 3 misslyckades - status:", response.status);
    }
}

// Testa POST med fel format (borde ge 400 Bad Request)
async function testError4() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            wrongField: "Fel data" // Skickar felaktiga fält
        })
    };

    const request = new Request("http://localhost:8000/favorites", options);
    const response = await fetch(request);

    if (response.status === 400) {
        console.log("TestError 4 godkänd");
    } else {
        console.log("TestError 4 misslyckades - status:", response.status);
    }
}


test1();
test2();
test3();
test4();
testError1();
testError2();
testError3(); 
testError4(); 