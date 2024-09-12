import { ToastContainer } from 'react-toastify';
import './App.css';
import AdminUI from './pages/AdminUI';
import AgentUI from './pages/AgentUI';
import { useZafClient } from './utils/useZafClient';
import { useEffect, useState } from 'react';


const App = () => {
  const zafClient = useZafClient();
  const [agentId, setAgentId] = useState(null); // State to hold the agent ID
  const [userRole, setUserRole] = useState(null); // State to hold the role of the current user

  useEffect(() => {
    if (zafClient) {
      zafClient.get('currentUser').then((data) => {
        const currentUser = data.currentUser;
        console.log('Current User Data:', currentUser); // Check what data is returned

        setUserRole(currentUser.role);
        if (currentUser.role === 'agent' || currentUser.role === 'light_agent') {
          setAgentId(currentUser.id); // Set the agent ID
        }
      }).catch((error) => {
        console.error('Error fetching currentUser:', error);
      });
    }
  }, [zafClient]);

    console.log("zafClient23",zafClient);
  if (userRole === 'admin') {
    return <AdminUI />;
  } else if (userRole === 'agent' || userRole === 'light_agent') {
    return <AgentUI agentId={agentId} />; 
  } else {
    return <LoadingUI />;
  }
};

<ToastContainer />


const LoadingUI = () => (
  <div>
    <h1>Loading...</h1>
  </div>
);

export default App;





