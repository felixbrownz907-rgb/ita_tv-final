import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// IT International Academy TV - Broadcast Configuration
const firebaseConfig = {
  databaseURL: "https://ita-tv-db475-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [data, setData] = useState({ 
    mainVideo: "", 
    programName: "", 
    adVideo: "", 
    tickerText: "Welcome to IT International Academy TV - Empowering Students Through Technology" 
  });
  const [showAd, setShowAd] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const stationRef = ref(db, 'station');
    onValue(stationRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.val();
        setData(cloudData);
        if (cloudData.adVideo) {
          setShowAd(true);
        }
      }
    });

    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'Arial, sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* BROADCAST CLOCK */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '14px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '3px', zIndex: 10, border: '1px solid #444' }}>
        {time}
      </div>

      {/* SMART AD OVERLAY - NO CONTROLS */}
      {showAd && data.adVideo && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black', zIndex: 100 }}>
          <video 
            src={data.adVideo} 
            autoPlay 
            muted
            playsInline
            onEnded={() => setShowAd(false)} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: 'red', padding: '5px 15px', fontWeight: 'bold', fontSize: '12px' }}>
            COMMERCIAL BREAK
          </div>
        </div>
      )}

      {/* ITA TV WATERMARK */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'red', padding: '5px 10px', fontWeight: 'bold', borderRadius: '3px', zIndex: 10, boxShadow: '0 0 10px rgba(255,0,0,0.5)' }}>
        ITA TV LIVE
      </div>

      {/* MAIN BROADCAST SECTION - NO CONTROLS */}
      <div style={{ height: '60%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
        {data.mainVideo ? (
          <video 
            src={data.mainVideo} 
            autoPlay 
            loop 
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        ) : (
          <p>Connecting to ITA Broadcast Station...</p>
        )}
      </div>

      {/* MARKETING & INFO SECTION */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '0' }}>
        
        <div style={{ textAlign: 'center', padding: '15px' }}>
          <h3 style={{ margin: '0', color: '#888', fontSize: '12px', letterSpacing: '2px' }}>CURRENT PROGRAM:</h3>
          <h2 style={{ fontSize: '22px', margin: '5px 0 15px 0', color: '#fff' }}>{data.programName || "Education for All"}</h2>
          
          <a href="https://wa.me/260766149405" style={{ backgroundColor: '#25D366', color: 'white', padding: '12px 25px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)' }}>
            JOIN STUDENT WHATSAPP
          </a>
        </div>

        {/* NEWS TICKER (SCROLLING CAPTION) */}
        <div style={{ backgroundColor: '#1a1a1a', borderTop: '2px solid red', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <marquee scrollamount="6" style={{ fontSize: '16px', color: '#FFD700', fontWeight: '500' }}>
            {data.tickerText || "IT International Academy: Quality Education for a Digital World. Enroll Today!"}
          </marquee>
        </div>
      </div>
    </div>
  );
}

export default App;
