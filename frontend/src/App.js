import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Quest from './components/Quest';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Solo Sparks</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Register />
        <Login />
      </div>
      {isLoggedIn ? <Quest /> : <p>Please log in to view quests.</p>}
    </div>
  );
};

export default App;