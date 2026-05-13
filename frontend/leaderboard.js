// Dès que la page s'ouvre, on va chercher les données
document.addEventListener("DOMContentLoaded", async () => {
    // Appel à l'API que l'on a créée hier
    const reponse = await fetch('/api/leaderboard');
    const classement = await reponse.json();
    
    const tbody = document.getElementById('tableau-classement');
    
    classement.forEach((player, index) => {
        // Petit bonus visuel pour le podium
        let medaille = "";
        if (index === 0) medaille = "🥇 ";
        if (index === 1) medaille = "🥈 ";
        if (index === 2) medaille = "🥉 ";

        tbody.innerHTML += `
            <tr>
                <td>${medaille}#${index + 1}</td>
                <td><strong>${player.name}</strong></td>
                <td>${player.best} pts</td>
            </tr>
        `;
    });
});
