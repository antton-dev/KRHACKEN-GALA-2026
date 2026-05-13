// Variables d'état du jeu
let playerName = "";
let questions = [];
let currentTurn = 0;
let score = 0;
let wait = false; // Empêche le joueur de cliquer partout très vite

// Fonction utilitaire pour changer d'écran
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

    // Demande la partie au backend Python
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

    if (givenAnswer === correctAnswer) {
        clickedBtn.classList.add('btn-correct');
        score++;
    } else {
        clickedBtn.classList.add('btn-incorrect');
        // On cherche le bon bouton pour le mettre en vert et montrer la vraie réponse
        Array.from(boutons).forEach(b => {
            if (b.innerText === correctAnswer) b.classList.add('btn-correct');
        });
    }

    // On attend 1.5 seconde avant de passer au tour suivant (pour laisser le temps de lire)
    setTimeout(() => {
        currentTurn++;
        if (currentTurn < questions.length) {
            displayTurn();
        } else {
            endGame();
        }
    }, 1500);
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
    classement.forEach((joueur, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${index + 1}</td>
                <td>${joueur.name}</td>
                <td>${joueur.best}</td>
            </tr>
        `;
    });
}
