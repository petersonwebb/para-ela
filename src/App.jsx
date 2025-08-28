import React from 'react';

function App() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minHeight: '100vh' }}>
      <div style={{ flex: 1, textAlign: 'left', padding: '2rem' }}>
        {/* ...existing text content... */}
      </div>
      <div style={{ flex: '0 0 400px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          borderRadius: '16px',
          background: '#fff',
          padding: '1rem',
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <video
            src="/euela.mp"
            autoPlay
            loop
            muted
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;