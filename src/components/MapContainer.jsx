import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";

function MapContainer() {
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

      const geo = await fetch("/memphis.clean.json").then((r) => r.json());

      map.addSource("memphis", {
        type: "geojson",
        data: geo,
      });

      // ZIPs to highlight red
      const targetZips = ["38128", "38127", "38118", "38114"];

      map.addLayer({
        id: "memphis-fill",
        type: "fill",
        source: "memphis",
        paint: {
          // Red for target ZIPs, white for everything else
          "fill-color": [
            "match",
            ["to-string", ["get", "Name"]],
            targetZips,
            "#ef4444", // red-500
            "#ffffff", // white
          ],
          // Make target ZIPs a bit more opaque
          "fill-opacity": [
            "case",
            ["in", ["to-string", ["get", "Name"]], ["literal", targetZips]],
            0.6, // selected
            0.25, // others
          ],
        },
      });

      map.addLayer({
        id: "memphis-outline",
        type: "line",
        source: "memphis",
        paint: {
          // Darker outline for selected ZIPs; light gray for others
          "line-color": [
            "case",
            ["in", ["to-string", ["get", "Name"]], ["literal", targetZips]],
            "#7f1d1d", // dark red
            "#1f2937", // gray-800 (tweak to taste)
          ],
          "line-width": 2,
        },
      });

      // Fit bounds (unchanged)
      const bounds = new mapboxgl.LngLatBounds();
      geo.features.forEach((f) => {
        const coords =
          f.geometry.type === "Polygon"
            ? f.geometry.coordinates.flat(1)
            : f.geometry.type === "MultiPolygon"
            ? f.geometry.coordinates.flat(2)
            : [];
        coords.forEach((c) => bounds.extend(c.slice(0, 2))); // ignore altitude if present
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40 });
    });

    // Cleanup
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

export default MapContainer;
