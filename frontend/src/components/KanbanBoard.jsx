import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { toast } from 'react-toastify';

const KanbanBoard = () => {
  const [kanbanData, setKanbanData] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/tasks/kanban');
      setKanbanData(res.data);
    } catch (err) {
      console.error('Error fetching kanban data:', err);
      toast.error('Failed to load kanban board');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStatus = destination.droppableId;
    
    try {
      await axios.put(`http://localhost:4000/api/tasks/${draggableId}`, {
        status: newStatus
      });
      
      // Update local state
      const newKanbanData = { ...kanbanData };
      const sourceColumn = newKanbanData[source.droppableId];
      const destColumn = newKanbanData[destination.droppableId];
      
      const [movedTask] = sourceColumn.splice(source.index, 1);
      movedTask.status = newStatus;
      destColumn.splice(destination.index, 0, movedTask);
      
      setKanbanData(newKanbanData);
      toast.success('Task status updated successfully');
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card 
            className={`shadow-sm ${snapshot.isDragging ? 'shadow-lg' : ''}`}
            style={{ 
              cursor: 'grab',
              transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
              border: isOverdue(task.dueDate) ? '2px solid #dc3545' : '1px solid #dee2e6'
            }}
            onClick={() => {
              setSelectedTask(task);
              setShowModal(true);
            }}
          >
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <Card.Title className="h6 mb-0">{task.title}</Card.Title>
                <Badge bg={getPriorityColor(task.priority)} className="ms-2">
                  {task.priority}
                </Badge>
              </div>
              
              {task.description && (
                <Card.Text className="small text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                  {task.description.length > 60 
                    ? `${task.description.substring(0, 60)}...` 
                    : task.description}
                </Card.Text>
              )}
              
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {task.assignedTo?.name || 'Unassigned'}
                </small>
                <small className={`${isOverdue(task.dueDate) ? 'text-danger fw-bold' : 'text-muted'}`}>
                  {formatDate(task.dueDate)}
                </small>
              </div>
              
              {task.project?.title && (
                <Badge bg="light" text="dark" className="mt-2">
                  {task.project.title}
                </Badge>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const Column = ({ title, tasks, droppableId }) => (
    <div className="col-md-4 mb-4">
      <Card className="h-100">
        <Card.Header className="bg-primary text-white text-center">
          <h5 className="mb-0">{title} ({tasks.length})</h5>
        </Card.Header>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <Card.Body
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`${snapshot.isDraggingOver ? 'bg-light' : ''}`}
              style={{ minHeight: '500px' }}
            >
              {tasks.map((task, index) => (
                <TaskCard key={task._id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Card.Body>
          )}
        </Droppable>
      </Card>
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">📋 Kanban Board</h3>
        <Button variant="outline-primary" onClick={fetchKanbanData}>
          🔄 Refresh
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          <Column title="To Do" tasks={kanbanData['To Do']} droppableId="To Do" />
          <Column title="In Progress" tasks={kanbanData['In Progress']} droppableId="In Progress" />
          <Column title="Done" tasks={kanbanData['Done']} droppableId="Done" />
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedTask?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <div>
              <div className="mb-3">
                <strong>Priority:</strong>{' '}
                <Badge bg={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>
              
              <div className="mb-3">
                <strong>Status:</strong> {selectedTask.status}
              </div>
              
              <div className="mb-3">
                <strong>Assigned To:</strong> {selectedTask.assignedTo?.name || 'Unassigned'}
              </div>
              
              <div className="mb-3">
                <strong>Project:</strong> {selectedTask.project?.title || 'No project'}
              </div>
              
              <div className="mb-3">
                <strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}
              </div>
              
              {selectedTask.description && (
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-2">{selectedTask.description}</p>
                </div>
              )}
              
              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="mb-3">
                  <strong>Comments:</strong>
                  <ul className="mt-2">
                    {selectedTask.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KanbanBoard;