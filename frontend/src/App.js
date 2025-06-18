import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Quest from './components/Quest';
import Rewards from './components/Rewards';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5 fade-in" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
        Solo Sparks
      </h1>
      {!isLoggedIn ? (
        <div className="row justify-content-center">
          <div className="col-md-5 mb-4">
            <Register />
          </div>
          <div className="col-md-5 mb-4">
            <Login />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 mb-4">
            <Quest />
          </div>
          <div className="col-md-6 mb-4">
            <Rewards />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;