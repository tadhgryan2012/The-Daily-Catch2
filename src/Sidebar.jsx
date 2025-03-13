import React, { useState } from 'react';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const expandSidebar = () => setExpanded(true);
  const collapseSidebar = () => setExpanded(false);

  return (
    <nav
      className={`bg-dark text-white d-flex flex-column align-items-center px-2 pt-3 ${expanded ? 'expanded' : ''}`}
      id="sidebar"
      style={{
        height: '100vh',
        width: expanded ? '200px' : '60px',
        transition: 'width 0.3s',
        position: 'relative',
      }}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
    >
      <div className="text-center mb-3">
        <img
          className="logo img-fluid"
          src={"./logo.png"}
          alt="Logo"
          style={{
            width: expanded ? "64px" : "45px",
            height: expanded ? "64px" : "45px",
            borderRadius: "50%",
            border: "2px solid white",
            transition: "width 0.3s, height 0.3s", 
          }}
        />
        <h1
          className={`fs-5 mt-2 text-white ${expanded ? '' : 'd-none'}`}
          id="sidebar-title"
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          The Daily Catch
        </h1>
        {expanded && (
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              marginTop: '5px',
            }}
          />
        )}
      </div>
      <div className="nav flex-column w-100 text-center mt-5" style={{ position: 'absolute', top: '100px', width: '100%' }}>
        <a className="nav-link text-white py-2 d-flex align-items-center justify-content-center" href="/profile">
          <i className="material-icons fs-5 me-2">person</i>
          <span className={expanded ? '' : 'd-none'}>Profile</span>
        </a>
        <a className="nav-link text-white py-2 d-flex align-items-center justify-content-center" href="/settings">
          <i className="material-icons fs-5 me-2">settings</i>
          <span className={expanded ? '' : 'd-none'}>Settings</span>
        </a>
        <a className="nav-link text-white py-2 d-flex align-items-center justify-content-center" href="/help">
          <i className="material-icons fs-5 me-2">help</i>
          <span className={expanded ? '' : 'd-none'}>Help</span>
        </a>
      </div>
      <div className="mt-auto w-100 text-center" style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
        <a className="nav-link text-white py-2 d-flex align-items-center justify-content-center" href="/logout">
          <i className="material-icons fs-5 me-2">exit_to_app</i>
          <span className={expanded ? '' : 'd-none'}>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
