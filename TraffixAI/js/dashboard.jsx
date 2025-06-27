import React, { useState, useEffect, useRef } from 'react';

// Assume Tailwind CSS is configured and available in the environment.
// No direct Tailwind imports needed within React components if set up globally.

// Mock WebSocket for demonstration purposes
// In a real scenario, this would connect to your Raspberry Pi's WebSocket server or MQTT broker
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.readyState = 0; // CONNECTING
    this.interval = null; // For simulating data
    this.isConnected = false;

    console.log(`MockWebSocket: Attempting to connect to ${url}`);
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.isConnected = true;
      if (this.onopen) this.onopen();
      this.startSimulatingData();
      console.log('MockWebSocket: Connected.');
    }, 1000);
  }

  startSimulatingData() {
    this.interval = setInterval(() => {
      if (this.onmessage) {
        const trafficData = {
          timestamp: Date.now(),
          lane_counts: {
            North_Inbound: Math.floor(Math.random() * 15),
            North_Outbound: Math.floor(Math.random() * 10),
            East_Inbound: Math.floor(Math.random() * 20),
            East_Outbound: Math.floor(Math.random() * 8),
            South_Inbound: Math.floor(Math.random() * 12),
            South_Outbound: Math.floor(Math.random() * 7),
            West_Inbound: Math.floor(Math.random() * 18),
            West_Outbound: Math.floor(Math.random() * 9),
            Pedestrians_North: Math.floor(Math.random() * 3),
            Pedestrians_East: Math.floor(Math.random() * 2),
            Pedestrians_South: Math.floor(Math.random() * 4),
            Pedestrians_West: Math.floor(Math.random() * 1),
          },
          ai_decision: this.getRandomAIDecision(),
          video_feeds: {
            North: "https://placehold.co/400x300/007bff/ffffff?text=North+Cam",
            East: "https://placehold.co/400x300/007bff/ffffff?text=East+Cam",
            South: "https://placehold.co/400x300/007bff/ffffff?text=South+Cam",
            West: "https://placehold.co/400x300/007bff/ffffff?text=West+Cam",
          },
          junction_status: Math.random() > 0.5 ? 'Optimal' : 'Congested',
          light_cycle_time: Math.floor(Math.random() * 60) + 20, // 20-80 seconds
        };
        this.onmessage({ data: JSON.stringify(trafficData) });
      }
    }, 3000); // Send data every 3 seconds
  }

  getRandomAIDecision() {
    const decisions = [
      "Prioritizing North-South flow.",
      "Green light for East-West traffic.",
      "Adjusting North inbound lane for congestion.",
      "Pedestrian crossing initiated for South.",
      "Optimizing cycle for minimal wait times."
    ];
    return decisions[Math.floor(Math.random() * decisions.length)];
  }

  send(data) {
    console.log("MockWebSocket: Sent data:", data);
    // In a real app, this would send commands to the Pi
  }

  close() {
    console.log('MockWebSocket: Closing connection.');
    clearInterval(this.interval);
    this.readyState = 3; // CLOSED
    this.isConnected = false;
    if (this.onclose) this.onclose();
  }
}

// Gauge Component
const Gauge = ({ value, label, max = 100, unit = '' }) => {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90; // Rotate from -90 to 90 degrees for half-circle

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
      <div className="w-32 h-16 overflow-hidden relative rounded-t-full bg-gray-300">
        <div className="absolute inset-x-0 bottom-0 h-full origin-bottom rotate-90"
             style={{
               transform: `rotate(${rotation}deg)`,
               transformOrigin: 'bottom center',
               backgroundColor: percentage > 75 ? '#ef4444' : percentage > 50 ? '#f59e0b' : '#22c55e',
               transition: 'transform 0.5s ease-out'
             }}>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-full bg-transparent border-t-2 border-gray-400"></div>
        <div className="absolute w-2 h-2 bg-gray-700 rounded-full bottom-0 left-1/2 -translate-x-1/2 transform translate-y-1/2"></div>
      </div>
      <div className="mt-2 text-xl font-bold text-gray-800">{value}{unit}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};


// Main Dashboard Component
const Dashboard = ({ username }) => {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'menu', 'oversee_junction'
  const [trafficData, setTrafficData] = useState(null);
  const [socketStatus, setSocketStatus] = useState('Connecting...');
  const websocketRef = useRef(null); // Ref to hold the WebSocket instance

  // State for welcome animation
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);

  useEffect(() => {
    // Welcome animation sequence
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(() => setShowQuestion(true), 500);
      setTimeout(() => setShowUsername(true), 1500);
      setTimeout(() => setShowMenuOptions(true), 2500);
      setCurrentView('menu'); // Transition to menu view after animation
    }, 3000); // Welcome animation duration

    return () => clearTimeout(welcomeTimer);
  }, []);

  // WebSocket connection effect (for Oversee Junction)
  useEffect(() => {
    if (currentView === 'oversee_junction') {
      // In a real application, replace "ws://localhost:8080" with your Raspberry Pi's WebSocket URL
      // Or configure an MQTT client to connect to your broker.
      // Example for direct WebSocket to RPi: ws://[RaspberryPi-IP]:[Port]
      // Example for MQTT: Use a library like mqtt.js and connect to your broker's URL
      // For this demo, we use the MockWebSocket
      websocketRef.current = new MockWebSocket("ws://your-raspberry-pi-ip:8080/traffic_feed");

      websocketRef.current.onopen = () => {
        setSocketStatus('Connected');
        console.log('WebSocket connection opened.');
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTrafficData(data);
          // console.log("Received data:", data); // For debugging
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error, event.data);
        }
      };

      websocketRef.current.onclose = () => {
        setSocketStatus('Disconnected');
        console.log('WebSocket connection closed.');
      };

      websocketRef.current.onerror = (error) => {
        setSocketStatus('Error');
        console.error('WebSocket error:', error);
      };

      return () => {
        if (websocketRef.current && websocketRef.current.isConnected) {
          websocketRef.current.close();
        }
      };
    }
  }, [currentView]); // Re-run effect when view changes to 'oversee_junction'


  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white transition-opacity duration-1000 ease-in-out"
               style={{ opacity: showWelcome ? 1 : 0 }}>
            <h1 className="text-6xl font-bold text-yellow-500 animate-fade-in">
              Welcome to TraffixAI
            </h1>
          </div>
        );
      case 'menu':
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6">
            <div className="text-center">
              <h2 className={`text-4xl font-semibold mb-4 transition-opacity duration-1000 ${showQuestion ? 'opacity-100' : 'opacity-0'}`}>
                What would you like to do today,
              </h2>
              <p className={`text-5xl font-extrabold text-yellow-400 mb-8 transition-opacity duration-1000 delay-500 ${showUsername ? 'opacity-100' : 'opacity-0'}`}>
                {username}?
              </p>
            </div>
            <div className={`flex flex-col space-y-4 transition-opacity duration-1000 delay-1000 ${showMenuOptions ? 'opacity-100' : 'opacity-0'}`}>
              <button
                className="w-80 py-4 px-6 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={() => setCurrentView('oversee_junction')}
              >
                Oversee Junction
              </button>
              <button
                className="w-80 py-4 px-6 bg-gray-600 text-white text-xl font-bold rounded-xl shadow-lg cursor-not-allowed opacity-50"
                disabled
              >
                View Logs (Coming Soon)
              </button>
              <button
                className="w-80 py-4 px-6 bg-gray-600 text-white text-xl font-bold rounded-xl shadow-lg cursor-not-allowed opacity-50"
                disabled
              >
                Contact Devs (Coming Soon)
              </button>
            </div>
          </div>
        );
      case 'oversee_junction':
        return (
          <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Junction Control Dashboard</h1>
            
            <button
                className="absolute top-8 left-8 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                onClick={() => {
                    if (websocketRef.current && websocketRef.current.isConnected) {
                        websocketRef.current.close(); // Close WebSocket before returning to menu
                    }
                    setCurrentView('menu');
                }}
            >
                ← Back to Menu
            </button>

            {/* Connection Status */}
            <div className={`text-center text-sm font-medium mb-6 ${socketStatus === 'Connected' ? 'text-green-600' : socketStatus === 'Disconnected' ? 'text-red-600' : 'text-yellow-600'}`}>
              WebSocket Status: {socketStatus}
            </div>

            {trafficData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                {/* Traffic Counts Gauges */}
                <Gauge label="North Inbound" value={trafficData.lane_counts.North_Inbound} max={20} unit=" cars" />
                <Gauge label="East Inbound" value={trafficData.lane_counts.East_Inbound} max={20} unit=" cars" />
                <Gauge label="South Inbound" value={trafficData.lane_counts.South_Inbound} max={20} unit=" cars" />
                <Gauge label="West Inbound" value={trafficData.lane_counts.West_Inbound} max={20} unit=" cars" />
                
                <Gauge label="Pedestrians North" value={trafficData.lane_counts.Pedestrians_North} max={5} unit=" peds" />
                <Gauge label="Pedestrians East" value={trafficData.lane_counts.Pedestrians_East} max={5} unit=" peds" />
                <Gauge label="Pedestrians South" value={trafficData.lane_counts.Pedestrians_South} max={5} unit=" peds" />
                <Gauge label="Pedestrians West" value={trafficData.lane_counts.Pedestrians_West} max={5} unit=" peds" />

                {/* AI Decision & Junction Status */}
                <div className="col-span-full lg:col-span-2 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">AI Traffic Decision</h3>
                    <p className="text-xl text-indigo-700 font-medium mb-4">{trafficData.ai_decision}</p>
                    <div className={`px-4 py-2 rounded-full text-lg font-bold ${trafficData.junction_status === 'Optimal' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        Junction Status: {trafficData.junction_status}
                    </div>
                    <p className="text-md text-gray-600 mt-2">Current Cycle Time: {trafficData.light_cycle_time} seconds</p>
                </div>

                {/* Manual Controls (Simulated) */}
                <div className="col-span-full lg:col-span-2 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Manual Light Control</h3>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300" onClick={() => websocketRef.current.send(JSON.stringify({ command: 'set_green', direction: 'North-South' }))}>
                      North-South Green
                    </button>
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300" onClick={() => websocketRef.current.send(JSON.stringify({ command: 'set_green', direction: 'East-West' }))}>
                      East-West Green
                    </button>
                    <button className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300" onClick={() => websocketRef.current.send(JSON.stringify({ command: 'set_yellow', all: true }))}>
                      All Yellow
                    </button>
                    <button className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300" onClick={() => websocketRef.current.send(JSON.stringify({ command: 'set_red', all: true }))}>
                      All Red
                    </button>
                  </div>
                </div>

                {/* Camera Feeds */}
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  {Object.entries(trafficData.video_feeds).map(([direction, imageUrl]) => (
                    <div key={direction} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100 border-b">{direction} Camera Feed</h3>
                      <img
                        src={imageUrl}
                        alt={`${direction} Camera`}
                        className="w-full h-auto object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/cccccc/333333?text=Image+Error"; }}
                      />
                      <div className="p-4 text-gray-700">
                         {direction} Inbound: {trafficData.lane_counts[`${direction}_Inbound`]} cars<br/>
                         {direction} Outbound: {trafficData.lane_counts[`${direction}_Outbound`]} cars<br/>
                         Pedestrians: {trafficData.lane_counts[`Pedestrians_${direction}`]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 text-lg mt-10">
                <p>Waiting for real-time traffic data...</p>
                <p>Ensure your Raspberry Pi backend is running and accessible.</p>
              </div>
            )}
          </div>
        );
      default:
        return <div className="text-center py-10">Something went wrong.</div>;
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderContent()}
    </div>
  );
};

export default Dashboard;

// Basic CSS for animations (can be moved to style.css)
// This part assumes a build process would handle CSS for React
// but including it here for completeness if you were to inline.
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 2s ease-out forwards;
}
*/
