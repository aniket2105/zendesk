import React, { useEffect, useState } from "react";
import { useZafClient } from "../utils/useZafClient";
import {
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const AgentUI = ({ agentId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state for agent data and tasks
  const zafClient = useZafClient();
  const [completedTasks, setCompletedTasks] = useState(new Set()); // Track completed tasks by their IDs

const handleOpenTicket = (ticketId) => {
    zafClient.invoke('routeTo', 'ticket', ticketId); // Open the ticket in Zendesk sidebar
  };
  // Fetch the logged-in agent's ID
  useEffect(() => {
    const fetchTasks = () => {
      const customFieldID = "15849754207772"; // Replace with your custom field ID
      if (zafClient && agentId) {
        zafClient
          .request({
            url: `/api/v2/search.json?query=type:ticket assignee:${agentId} custom_field_${customFieldID}:*`, // Use agentId to fetch tasks assigned to them
            type: "GET",
          })
          .then((response) => {
            console.log("Tasks retrieved:", response);
            setTasks(response.results); // Adjust based on the API response structure
          })
          .catch((error) => {
            console.error("Error retrieving tasks:", error);
          })
          .finally(() => {
            setLoading(false); // Stop loading when tasks are fetched
          });
      }
    };

    if (agentId) {
      fetchTasks();
    }
  }, [agentId, zafClient]);
  const handleComplete = (ticketId) => {
    if (zafClient) {
      zafClient
        .request({
          url: `/api/v2/tickets/${ticketId}.json`,
          type: "PUT",
          data: JSON.stringify({
            ticket: {
              status: "solved", // Using 'solved' as an example; adjust as needed
            },
          }),
          contentType: "application/json",
        })
        .then((response) => {
          const updatedTicket = response.ticket;

          // Update the completed tasks state
          setCompletedTasks((prev) => new Set(prev).add(updatedTicket.id));

          // Update the tasks state to reflect the new status
          setTasks(
            tasks.map((task) =>
              task.id === updatedTicket.id
                ? { ...task, status: updatedTicket.status }
                : task
            )
          );

          alert("Task marked as completed!");
        })
        .catch((error) => {
          console.error("Error updating task status:", error);
        });
    }
  };

  return (
      <div>
      <Typography variant="h4" gutterBottom>
        Agent - View Tasks
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks assigned to you.</Typography>
      ) : (
        <List>
          {tasks.map(task => (
            <ListItem key={task.id} divider>
              <ListItemText primary={task?.description} />
              <Button 
                variant="contained" 
                color={task.status === 'solved' ? 'default' : 'primary'} 
                onClick={() => task.status !== 'solved' && handleComplete(task?.id)}
              >
                {task.status === 'solved' ? 'Completed' : 'Complete Task'}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => handleOpenTicket(task?.id)}
                style={{ marginLeft: 8 }}
              >
                Open Ticket
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default AgentUI;
