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

export async function createProject({ title, description }) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  });
}
