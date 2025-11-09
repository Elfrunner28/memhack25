import mapboxgl from "mapbox-gl";
import MapContainer from "./MapContainer";

function MemphisMap({ width = "100%", height = "100vh", style = {} }) {
  const handleMapLoad = async (map) => {
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
  };

  return (
    <MapContainer
      accessToken="pk.eyJ1IjoiYm9ta2EiLCJhIjoiY21ocXZuendlMTB1MTJqcHpqamx3NzVrciJ9.LnpWZyAtsFMkWzRbOyMkKw"
      mapStyle="mapbox://styles/bomka/cmhqv52hy005d01r0h3udd541"
      center={[-90.049, 35.146]}
      zoom={10}
      onMapLoad={handleMapLoad}
      width={width}
      height={height}
      style={style}
    />
  );
}

export default MemphisMap;
