import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const SearchResults = () => {
  const { state } = useLocation();
  const { results, query } = state || {};
  const { projects = [], tasks = [], members = [] } = results || {};

  return (
    <Container className="mt-4">
      <h3 className="mb-4">🔍 Search Results for: <strong>{query}</strong></h3>

      {projects.length === 0 && tasks.length === 0 && members.length === 0 ? (
        <p className="text-muted">No results found.</p>
      ) : (
        <>
          {projects.length > 0 && (
            <>
              <h5 className="text-primary">📁 Project</h5>
              {projects.map(p => (
                <Card key={p._id} className="mb-3 p-3 shadow-sm">
                  <h6>{p.title}</h6>
                  <p>{p.description}</p>
                  <small>
                    {p.startDate?.slice(0, 10)} ➝ {p.endDate?.slice(0, 10)}
                  </small>
                </Card>
              ))}
            </>
          )}

          {tasks.length > 0 && (
            <>
              <h5 className="text-success">📌 Task</h5>
              {tasks.map(t => (
                <Card key={t._id} className="mb-3 p-3 shadow-sm">
                  <h6>{t.title}</h6>
                  <p>Status: <strong>{t.status}</strong></p>
                  {t.project?.title && <p>Project: {t.project.title}</p>}
                  {t.assignedTo?.name && <p>Assigned To: {t.assignedTo.name}</p>}
                </Card>
              ))}
            </>
          )}

          {members.length > 0 && (
            <>
              <h5 className="text-warning">👤 Team Member</h5>
              {members.map(m => (
                <Card key={m._id} className="mb-3 p-3 shadow-sm">
                  <h6>{m.name}</h6>
                  <p>Email: {m.email}</p>
                  {m.assignedTasks?.length > 0 && (
                    <>
                      <strong>Tasks:</strong>
                      <ul>
                        {m.assignedTasks.map((t, i) => (
                          <li key={i}>{t.title} - {t.status}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResults;
