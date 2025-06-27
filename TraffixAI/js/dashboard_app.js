// This file contains the React application for the TraffixAI Admin Dashboard.
// React, ReactDOM, and MQTT.js libraries are loaded via CDNs in monitor_dashboard.php.
// This file itself is loaded with type="text/babel" in monitor_dashboard.php
// to allow in-browser JSX transpilation by Babel Standalone during development.

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
function Dashboard({ username }) {
  const [currentView, setCurrentView] = React.useState('welcome'); // 'welcome', 'menu', 'oversee_junction'
  const [trafficData, setTrafficData] = React.useState(null);
  const [mqttStatus, setMqttStatus] = React.useState('Connecting...');
  const mqttClientRef = React.useRef(null); // Ref to hold the MQTT client instance
  // Define MQTT Command Topic for frontend publishing
  const MQTT_COMMAND_TOPIC = "trafficai/junction1/commands";

  // State for welcome animation
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [showQuestion, setShowQuestion] = React.useState(false);
  const [showUsername, setShowUsername] = React.useState(false);
  const [showMenuOptions, setShowMenuOptions] = React.useState(false);

  React.useEffect(() => {
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

  // MQTT connection effect (for Oversee Junction)
  React.useEffect(() => {
    if (currentView === 'oversee_junction') {
      // --- MQTT Configuration for Frontend ---
      const MQTT_BROKER_URL = "wss://broker.hivemq.com:8884/mqtt"; // HiveMQ public broker using Secure WebSockets (port 8884)
      const MQTT_DATA_TOPIC = "trafficai/junction1/data"; // Topic to subscribe to for data

      if (typeof mqtt === 'undefined') {
          console.error("MQTT.js library not loaded. Please add <script src='https://unpkg.com/mqtt/dist/mqtt.min.js'></script> to monitor_dashboard.php");
          setMqttStatus('Error: MQTT library missing');
          return;
      }

      const client = mqtt.connect(MQTT_BROKER_URL);

      client.on('connect', () => {
        setMqttStatus('Connected');
        console.log('Connected to MQTT Broker (Frontend)!');
        client.subscribe(MQTT_DATA_TOPIC, (err) => { // Subscribe to data topic
          if (!err) {
            console.log(`Subscribed to data topic: ${MQTT_DATA_TOPIC}`);
          } else {
            console.error(`Subscription error: ${err}`);
          }
        });
      });

      client.on('message', (topic, message) => {
        try {
          const data = JSON.parse(message.toString());
          setTrafficData(data);
          // console.log("Received MQTT data:", data); // For debugging
        } catch (error) {
          console.error("Failed to parse MQTT message:", error, message.toString());
        }
      });

      client.on('close', () => {
        setMqttStatus('Disconnected');
        console.log('Disconnected from MQTT Broker.');
      });

      client.on('error', (err) => {
        setMqttStatus(`Error: ${err.message}`);
        console.error('MQTT error:', err);
      });

      // Store client in ref for cleanup
      mqttClientRef.current = client;

      // Clean up MQTT connection on component unmount or view change
      return () => {
        if (mqttClientRef.current) {
          mqttClientRef.current.end(true, () => console.log('MQTT client disconnected.')); // end(force, callback)
        }
      };
    } else {
        // If not in oversee_junction view, ensure client is disconnected
        if (mqttClientRef.current) {
            mqttClientRef.current.end(true, () => console.log('MQTT client disconnected due to view change.'));
            mqttClientRef.current = null;
        }
    }
  }, [currentView]); // Re-run effect when view changes to 'oversee_junction' or away from it

  // Function to publish a command via MQTT
  const publishCommand = (command_obj) => {
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(MQTT_COMMAND_TOPIC, JSON.stringify(command_obj), { qos: 1 });
      console.log(`Published command to ${MQTT_COMMAND_TOPIC}:`, command_obj);
    } else {
      console.warn("MQTT client not connected. Cannot publish command.");
      // Optionally show a message to the user that the command couldn't be sent
    }
  };


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
              <button
                  className="w-80 py-4 px-6 bg-red-700 hover:bg-red-800 text-white text-xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => {
                      if (window.confirm("Are you sure you want to reboot the Raspberry Pi? This will temporarily stop data flow.")) {
                          publishCommand({ type: "reboot" });
                      }
                  }}
              >
                  Reboot Raspberry Pi
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
                onClick={() => setCurrentView('menu')} // Back to menu
            >
                ← Back to Menu
            </button>

            {/* Connection Status */}
            <div className={`text-center text-sm font-medium mb-6 ${mqttStatus === 'Connected' ? 'text-green-600' : mqttStatus.startsWith('Error') || mqttStatus === 'Disconnected' ? 'text-red-600' : 'text-yellow-600'}`}>
              MQTT Status: {mqttStatus}
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
                    {/* Display current light states from Pi */}
                    {trafficData.current_light_states && (
                        <div className="mt-4 text-left w-full max-w-xs">
                            <h4 className="text-lg font-semibold mb-2">Current Light Status:</h4>
                            {Object.entries(trafficData.current_light_states).map(([lightName, state]) => (
                                <p key={lightName} className="text-sm">
                                    {lightName}: <span className={`font-bold ${state === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                        {state === 1 ? 'ON' : 'OFF'}
                                    </span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Manual Controls (Simulated) - UPDATED FOR REAL LIGHTS */}
                <div className="col-span-full lg:col-span-2 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Manual Light Control</h3>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {/* Individual Light Toggles (Optional, for fine control) */}
                    {/* Example for North Red ON/OFF
                    <button className="py-2 px-4 bg-gray-400 text-white rounded-md" onClick={() => publishCommand({ type: 'light_control', light: 'North_Red', state: 'on' })}>N Red ON</button>
                    <button className="py-2 px-4 bg-gray-400 text-white rounded-md" onClick={() => publishCommand({ type: 'light_control', light: 'North_Red', state: 'off' })}>N Red OFF</button>
                    */}

                    {/* Grouped Phase Controls */}
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'green', direction: 'North' })}>
                      North Green
                    </button>
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'green', direction: 'East' })}>
                      East Green
                    </button>
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'green', direction: 'South' })}>
                      South Green
                    </button>
                    <button className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'green', direction: 'West' })}>
                      West Green
                    </button>

                    <button className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 col-span-2"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'yellow', all: true })}>
                      All Yellow
                    </button>
                    <button className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 col-span-2"
                        onClick={() => publishCommand({ type: 'set_phase', phase_type: 'red', all: true })}>
                      All Red
                    </button>
                  </div>
                  <button
                      className="mt-6 py-3 px-6 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out w-full max-w-sm"
                      onClick={() => {
                          // Using native confirm for simplicity as per guidelines
                          if (window.confirm("Are you sure you want to reboot the Raspberry Pi? This will temporarily stop data flow and light control.")) {
                              publishCommand({ type: "reboot" });
                          }
                      }}
                  >
                      Reboot Raspberry Pi
                  </button>
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
                <p>Ensure your Raspberry Pi backend is running and publishing data to MQTT.</p>
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
}


// This is the main entry point to render the React app
const rootElement = document.getElementById('root');
if (rootElement) {
  const phpUsername = rootElement.getAttribute('data-username') || 'Admin';

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Dashboard username={phpUsername} />
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' not found for React app.");
}
