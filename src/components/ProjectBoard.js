import { useEffect, useState } from 'react';
import './ProjectBoard.css';
import { fetchTickets } from '../api/tickets';
import TicketCard from './TicketCard';

const COLUMNS = [
  { id: 'todo',        label: 'TO DO' },
  { id: 'in_progress', label: 'IN PROGRESS' },
  { id: 'in_review',   label: 'IN REVIEW' },
  { id: 'done',        label: 'DONE' },
];

const STATUS_MAP = {
  todo: 'todo',
  'to do': 'todo',
  to_do: 'todo',
  in_progress: 'in_progress',
  inprogress: 'in_progress',
  'in progress': 'in_progress',
  in_review: 'in_review',
  inreview: 'in_review',
  'in review': 'in_review',
  done: 'done',
  closed: 'done',
  resolved: 'done',
};

function normalizeStatus(status) {
  return STATUS_MAP[status?.toLowerCase()] || 'todo';
}

function ProjectBoard({ project, onBack }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTickets(project.id)
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [project.id]);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tickets.filter(t => normalizeStatus(t.status) === col.id);
    return acc;
  }, {});

  return (
    <div className="board-page">
      <div className="board-header">
        <button className="back-btn" onClick={onBack}>
          &#8592; Projects
        </button>
        <div className="board-header-title">
          <h1>{project.title}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
      </div>

      <div className="board-subheader">
        <span className="board-label">Board</span>
      </div>

      {loading && <p className="board-status">Loading tickets...</p>}
      {error && <p className="board-status board-error">Error: {error}</p>}

      {!loading && !error && (
        <div className="board-columns">
          {COLUMNS.map(col => (
            <div className="board-column" key={col.id}>
              <div className="column-header">
                <span className="column-title">{col.label}</span>
                <span className="column-count">{grouped[col.id].length}</span>
              </div>
              <div className="column-tickets">
                {grouped[col.id].map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {grouped[col.id].length === 0 && (
                  <p className="column-empty">No issues</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectBoard;
