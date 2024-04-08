// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "ol/ol.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import Feature from "ol/Feature";
// import Point from "ol/geom/Point";
// import { fromLonLat } from "ol/proj";
// import { Vector as VectorLayer } from "ol/layer";
// import { Vector as VectorSource } from "ol/source";
// import { Icon, Style } from "ol/style";

// function App() {
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     const map = new Map({
//       target: "map",
//       layers: [
//         new TileLayer({
//           source: new OSM(),
//         }),
//       ],
//       view: new View({
//         center: fromLonLat([0, 0]),
//         zoom: 2,
//       }),
//     });

//     // Cleanup function
//     return () => {
//       map.setTarget(null);
//     };
//   }, []);

//   const captureLocation = async () => {
//     try {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         await axios.post("http://localhost:2000/api/location", { latitude, longitude });
//         setLocation({ latitude, longitude });

//         const map = new Map({
//           target: "map",
//           layers: [
//             new TileLayer({
//               source: new OSM(),
//             }),
//           ],
//           view: new View({
//             center: fromLonLat([longitude, latitude]),
//             zoom: 10,
//           }),
//         });

//         const marker = new Feature({
//           geometry: new Point(fromLonLat([longitude, latitude])),
//         });

//         const iconStyle = new Style({
//           image: new Icon({
//             anchor: [0.5, 1],
//             src: "https://cdn-icons-png.flaticon.com/512/7782/7782342.png",
//           }),
//         });

//         marker.setStyle(iconStyle);

//         const vectorLayer = new VectorLayer({
//           source: new VectorSource({
//             features: [marker],
//           }),
//         });

//         map.addLayer(vectorLayer);
//       });
//     } catch (error) {
//       console.error("Error capturing location: ", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Location Tracker</h1>
//       <button onClick={captureLocation}>Capture Location</button>
//       <div id="map" style={{ width: "100%", height: "400px" }}></div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const captureLiveLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setError(null);

      // Send the live location to the backend
      await axios.post(`${window.location.origin}/api/location`, {
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Error capturing live location: ", error);
      setError("Error capturing live location. Please try again.");
    }
  };

  return (
    <div>
      <h1>Location Tracker</h1>
      {error && <p>{error}</p>}
      <button onClick={captureLiveLocation}>Capture Live Location</button>
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default App;
