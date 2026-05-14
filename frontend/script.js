// Variables d'état du jeu
let playerName = "";
let questions = [];
let currentTurn = 0;
let score = 0;
let wait = false; 


function displayScreen(id) {
    document.querySelectorAll('.ecran').forEach(e => e.classList.remove('ecran-actif'));
    document.getElementById(id).classList.add('ecran-actif');
}

// --- DÉMARRAGE DU JEU ---
async function startGame() {
    const input = document.getElementById('nom-joueur');
    if (input.value.trim() === "") {
        alert("Merci de rentrer un pseudo !");
        return;
    }
    playerName = input.value.trim();

    
    const reponse = await fetch('/api/start', { method: 'POST' });
    questions = await reponse.json();

    if (questions.error) {
        alert(questions.error);
        return;
    }

    // Réinitialise les variables et lance le 1er tour
    currentTurn = 0;
    score = 0;
    displayScreen('ecran-jeu');
    displayTurn();
}

// --- AFFICHAGE D'UN TOUR ---
function displayTurn() {
    wait = false;
    const q = questions[currentTurn];
    
    // Mise à jour du texte et de l'image
    document.getElementById('texte-tour').innerText = `Tour ${currentTurn + 1} / 10`;
    document.getElementById('image-celebrite').src = q.image;

    // Génération des 4 boutons
    const conteneur = document.getElementById('boutons-propositions');
    conteneur.innerHTML = ""; // On vide l'ancien tour
    
    q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice;
        btn.onclick = () => checkAnswer(btn, choice, q.expected_answer);
        conteneur.appendChild(btn);
    });
}

// --- VÉRIFICATION DE LA RÉPONSE ---
function checkAnswer(clickedBtn, givenAnswer, correctAnswer) {
    if (wait) return; // Si on a déjà cliqué, on bloque
    wait = true;

    const boutons = document.getElementById('boutons-propositions').children;

    // 1. Coloration des boutons (inchangée)
    if (givenAnswer === correctAnswer) {
        clickedBtn.classList.add('btn-correct');
        score++;
    } else {
        clickedBtn.classList.add('btn-incorrect');
        Array.from(boutons).forEach(b => {
            if (b.innerText === correctAnswer) b.classList.add('btn-correct');
        });
    }

    // 2. NOUVEAU : On affiche le bouton "Suivant" au lieu de mettre un chrono
    document.getElementById('btn-suivant').style.display = "block";
}


function nextTurn() {
    document.getElementById('btn-suivant').style.display = "none";
    
    currentTurn++;
    
    if (currentTurn < questions.length) {
        displayTurn(); 
    } else {
        endGame();
    }
}



// --- FIN DE PARTIE ET CLASSEMENT ---
async function endGame() {
    displayScreen('ecran-fin');
    document.getElementById('score-final').innerText = score;

    // 1. Envoi du score à Python
    await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score: score })
    });


    // 2. Récupération du Top 10
    const reponseBoard = await fetch('/api/leaderboard');
    const classement = await reponseBoard.json();

    // 3. Affichage dans le tableau
    const tbody = document.getElementById('tbody-classement');
    tbody.innerHTML = "";

    if (score <= 4) {
        link = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmJwMXJxbmd2eTNtOHFraWZxczV5d3c0YTBwbXA1YTNjMTgwZDMxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HenISf9DhFjaSf6/giphy.gif"
    } else if (score > 5 && score < 10) {
        link = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eXBsbjJlZDg0djh6dmFsN3p0MHY0cHlicTA5Y3ZwYnB5c3pqam41bSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/Ykk7PxxEzyBfLVWgqX/giphy.gif"
    } else if (score == 10) {
        link = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjFhMHhlMHdzaTV6M3c1YXVyYTI2ZWV4cnh3OHU2NXljMnV0MjdwNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HeoePKZ841bZzby/giphy.gif"
    }
    document.getElementById('final_image').src = link ;


    classement.forEach((joueur, index) => {
        const safeName = joueur.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        tbody.innerHTML += `
            <tr>
                <td>#${index + 1}</td>
                <td>${safeName}</td>
                <td>${joueur.best}</td>
            </tr>
        `;
    });
}
