import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { FiDownload, FiUser, FiClock, FiFileText } from 'react-icons/fi';

const AllUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/uploads/recent')
      .then((res) => {
        setUploads(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching uploads:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h3 className="mb-4 text-center text-primary fw-bold">📎 Uploaded Files</h3>
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Body>
          {uploads.length === 0 ? (
            <p className="text-center text-muted">No files uploaded yet.</p>
          ) : (
            <ListGroup variant="flush">
              {uploads.map((upload, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-start flex-wrap"
                >
                  <div className="flex-grow-1">
                    <div className="fw-bold fs-6">
                      <FiFileText className="me-2" />
                      {upload.fileName}
                    </div>

                    <div className="mt-1 text-muted small">
                      <span className="me-3">
                        <FiUser className="me-1" />
                        Uploaded by:{" "}
                        <Badge bg="light" text="dark" className="ms-1">
                          {upload.uploadedBy || "Unknown"}
                        </Badge>
                      </span>

                      <span className="me-3">
                        🧩 Task:{" "}
                        <Badge bg="info" className="text-white">
                          {upload.taskTitle || "Untitled Task"}
                        </Badge>
                      </span>

                      <span className="me-2">
                        <FiClock className="me-1" />
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <a
                      href={upload.fileUrl}
                      download
                      className="btn btn-outline-primary btn-sm mt-2"
                    >
                      <FiDownload className="me-1" />
                      Download
                    </a>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllUploads;
