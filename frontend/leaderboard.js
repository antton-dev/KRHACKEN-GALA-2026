document.addEventListener("DOMContentLoaded", async () => {
    const reponse = await fetch('/api/leaderboard');
    const classement = await reponse.json();
    
    const tbody = document.getElementById('tableau-classement');
    
    classement.forEach((player, index) => {
        
        let medaille = "";
        if (index === 0) medaille = "🥇 ";
        if (index === 1) medaille = "🥈 ";
        if (index === 2) medaille = "🥉 ";

        const safeName = player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        
        tbody.innerHTML += `
            <tr>
                <td>${medaille}#${index + 1}</td>
                <td><strong>${safeName}</strong></td>
                <td>${player.best} pts</td>
            </tr>
        `;
    });
});
