import React, { useEffect, useState } from 'react'
import { useZafClient } from '../utils/useZafClient';
import { TextField, Button, MenuItem, Box, Typography, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 const AdminUI = () => {
      const zafClient = useZafClient();
      const [task, setTask] = useState('');
      const [agentId, setAgentId] = useState('');
      const [agents, setAgents] = useState([]);
    
      useEffect(() => {
        if (zafClient) {         
          zafClient.request('/api/v2/users.json').then((data) => {
            setAgents(data.users.filter(user => user.role === 'agent'));
          });
        }
      }, [zafClient]);
    
      const handleSubmit = () => {
            console.log("first")
            if (zafClient) {
                  zafClient.request({
                    url: '/api/v2/tickets.json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      ticket: {
                        subject: task,
                        description: "task",
                        assignee_id: agentId, 
                        custom_fields: [
                          { id: 15849754207772, value: task }, 
                          { id: 15849852407452, value: agentId }, 
                        ]
                      }
                    })
                  })
                  .then(response => {
                    console.log('Task created as ticket:', response);
                    setTask('');
                    setAgentId('');
                    toast.success('Task created and assigned successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                  })
                  .catch(error => {
                    console.error('Error creating task ticket:', error);
                  });
                }
      };
    
      return (
            <Container maxWidth={false} sx={{ width: '100%', maxWidth: 300, p: 1 }}>
            <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: 'white' }}>
              <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
                Admin: Create Task
              </Typography>
              
              <TextField
                fullWidth
                label="Enter task"
                variant="outlined"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                margin="dense"
                size="small"
              />
              
              <TextField
                fullWidth
                select
                label="Select Agent"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                margin="dense"
                size="small"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </TextField>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 1 }}
                size="small"
              >
                Create Task
              </Button>
          
              <ToastContainer />
            </Box>
          </Container>
          
      );
    };


export default AdminUI;