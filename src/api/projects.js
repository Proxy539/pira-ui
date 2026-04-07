const BASE_URL = 'http://localhost:8080/api/v1/projects';

export async function fetchProjects() {
  return fetch(BASE_URL)
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to fetch projects')
    }
    return res.json();
  });
  
}
