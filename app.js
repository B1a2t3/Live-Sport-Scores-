const scoresDiv = document.getElementById('scores');
const loadingDiv = document.getElementById('loading');
const sportSelect = document.getElementById('sport-select');

const API_KEY = '3'; // TheSportsDB public test API key

// Mapping sport to league/team ID for API calls (these are example league IDs)
const sportLeagueIDs = {
  football: '4328',    // English Premier League
  basketball: '4387',  // NBA
  cricket: '599',      // ICC Cricket World Cup
};

async function fetchScores(sport) {
  loadingDiv.style.display = 'block';
  scoresDiv.innerHTML = '';

  const leagueID = sportLeagueIDs[sport];
  if (!leagueID) {
    loadingDiv.textContent = 'Sport not supported.';
    return;
  }

  // TheSportsDB API endpoint for next 5 events in a league
  const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${leagueID}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    loadingDiv.style.display = 'none';

    if (!data.events || data.events.length === 0) {
      scoresDiv.innerHTML = '<p>No upcoming matches found.</p>';
      return;
    }

    // Render match list
    data.events.forEach(match => {
      const matchDiv = document.createElement('div');
      matchDiv.className = 'match';

      matchDiv.innerHTML = `
        <div class="team">${match.strHomeTeam}</div>
        <div class="score">${match.intHomeScore !== null ? match.intHomeScore : '-'}</div>
        <div class="status">${match.dateEvent} ${match.strTime}</div>
        <div class="score">${match.intAwayScore !== null ? match.intAwayScore : '-'}</div>
        <div class="team">${match.strAwayTeam}</div>
      `;

      scoresDiv.appendChild(matchDiv);
    });

  } catch (error) {
    loadingDiv.style.display = 'none';
    scoresDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

// Initial fetch
fetchScores(sportSelect.value);

// Refresh every 30 seconds
let intervalId = setInterval(() => fetchScores(sportSelect.value), 30000);

// Change sport handler
sportSelect.addEventListener('change', () => {
  fetchScores(sportSelect.value);

  // Reset interval to avoid multiple intervals running
  clearInterval(intervalId);
  intervalId = setInterval(() => fetchScores(sportSelect.value), 30000);
});
