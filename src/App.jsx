import React from 'react';

function App() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#000'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: '5vw',
        color: '#ffcce6'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '400',
          marginBottom: '1rem',
          color: '#ffcce6',
          textAlign: 'left'
        }}>
          Bem-vinda, meu amor <span style={{fontSize: '3rem'}}>❤️</span>
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#fff',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          Este é o nosso espaço especial, onde cada momento juntos é eternizado com amor
        </p>
      </div>
      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3vw'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(255,192,203,0.25)',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <video
            src="/euela.mp"
            autoPlay
            loop
            muted
            style={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;