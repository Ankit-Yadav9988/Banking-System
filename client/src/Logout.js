import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  }, [navigate]); // 'navigate' is a dependency of handleLogout

  // Call logout immediately on load
  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]); // Include handleLogout in the dependency array

  return <p>Logging out...</p>;
};

export default Logout;