import logo from "./logo.svg";
import "./App.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";

function Map() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    if (mapRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYm9ta2EiLCJhIjoiY21ocXZuendlMTB1MTJqcHpqamx3NzVrciJ9.LnpWZyAtsFMkWzRbOyMkKw";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/bomka/cmhqv52hy005d01r0h3udd541",
      center: [-90.049, 35.146],
      zoom: 10,
    });

    mapRef.current.on("style.load", () => {
      console.log("Map style loaded successfully!");
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
}

function App() {
  return (
    <div className="App">
      <p>hi</p>
      <Map />
    </div>
  );
}

export default App;
