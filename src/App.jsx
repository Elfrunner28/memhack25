import logo from "./logo.svg";
import "./App.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";

function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYm9ta2EiLCJhIjoiY21ocXZuendlMTB1MTJqcHpqamx3NzVrciJ9.LnpWZyAtsFMkWzRbOyMkKw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/bomka/cmhqv52hy005d01r0h3udd541",
      center: [-90.049, 35.146],
      zoom: 10,
    });
    mapRef.current = map;

    map.on("load", async () => {
      console.log("Map style loaded successfully!");

      const geo = await fetch("/memphis.json").then((r) => r.json());

      map.addSource("memphis", {
        type: "geojson",
        data: geo,
      });

      map.addLayer({
        id: "memphis-fill",
        type: "fill",
        source: "memphis",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.25,
        },
      });

      map.addLayer({
        id: "memphis-outline",
        type: "line",
        source: "memphis",
        paint: {
          "line-color": "#1e40af",
          "line-width": 2,
        },
      });

      const bounds = new mapboxgl.LngLatBounds();
      geo.features.forEach((f) => {
        const coords =
          f.geometry.type === "Polygon"
            ? f.geometry.coordinates.flat(1)
            : f.geometry.type === "MultiPolygon"
            ? f.geometry.coordinates.flat(2)
            : [];

        coords.forEach((c) => bounds.extend(c));
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 40 });
      }
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
      <Map />
    </div>
  );
}

export default App;
