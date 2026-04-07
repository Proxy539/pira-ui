import './TicketCard.css';

const TYPE_LABELS = {
  bug: { label: 'Bug', color: '#e5493a' },
  story: { label: 'Story', color: '#36b37e' },
  task: { label: 'Task', color: '#4bade8' },
  epic: { label: 'Epic', color: '#904ee2' },
};

const PRIORITY_LABELS = {
  highest: { label: 'Highest', color: '#e5493a' },
  high: { label: 'High', color: '#e97f33' },
  medium: { label: 'Medium', color: '#f6c343' },
  low: { label: 'Low', color: '#4bade8' },
  lowest: { label: 'Lowest', color: '#4bade8' },
};

function TicketCard({ ticket }) {
  const type = TYPE_LABELS[ticket.type?.toLowerCase()] || TYPE_LABELS.task;
  const priority = PRIORITY_LABELS[ticket.priority?.toLowerCase()];

  return (
    <div className="ticket-card">
      <p className="ticket-title">{ticket.title}</p>
      <div className="ticket-meta">
        <span className="ticket-type-badge" style={{ backgroundColor: type.color }}>
          {type.label}
        </span>
        {ticket.key && <span className="ticket-key">{ticket.key}</span>}
        {priority && (
          <span className="ticket-priority" style={{ color: priority.color }}>
            {priority.label}
          </span>
        )}
        {ticket.assignee && (
          <span className="ticket-assignee" title={ticket.assignee}>
            {ticket.assignee.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

export default TicketCard;
