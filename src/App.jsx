import React from 'react';
import Sidebar from './Sidebar';
import Map from './Map';

const App = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Map />
    </div>
  );
};

export default App;
