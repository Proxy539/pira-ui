const BASE_URL = 'http://localhost:8080/api/v1/projects';

export async function fetchTickets(projectId) {
  return fetch(`${BASE_URL}/${projectId}/tickets`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch tickets');
      }
      return res.json();
    });
}
