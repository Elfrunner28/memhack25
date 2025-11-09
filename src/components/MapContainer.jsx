import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";

/** ---- Simple per-ZIP content components (demo two, others blank) ---- */
function Zip38128() {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <h2 style={{ marginTop: 0 }}>ZIP 38128 </h2>
      <p></p>
      <ul>
        <li>Example metric A</li>
        <li>Example metric B</li>
      </ul>
    </div>
  );
}

function Zip38127() {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <h2 style={{ marginTop: 0 }}>ZIP 38127 — Demo Panel</h2>
      <p>Custom content for 38127 goes here.</p>
      <p>
        You can replace this with a real component later (tables, embeds, etc.).
      </p>
    </div>
  );
}

/** Blank fallback for undecided ZIPs */
function BlankZip({ zip }) {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <h2 style={{ marginTop: 0 }}>ZIP {zip}</h2>
      <p>
        No content yet. (This one is intentionally left blank for the demo.)
      </p>
    </div>
  );
}

const ZIP_COMPONENTS = {
  38128: Zip38128,
  38127: Zip38127,
};

function MapContainer() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedZip, setSelectedZip] = useState(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYm9ta2EiLCJhIjoiY21ocXZuendlMTB1MTJqcHpqamx3NzVrciJ9.LnpWZyAtsFMkWzRbOyMkKw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/bomka/cmhqv52hy005d01r0h3udd541",
      center: [-90.049, 35.146],
      zoom: 8,
    });

    map.scrollZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.boxZoom.disable();

    mapRef.current = map;

    map.on("load", async () => {
      const geo = await fetch("/memphis.json").then((r) => r.json());

      map.addSource("memphis", {
        type: "geojson",
        data: geo,
      });

      const redZips = ["38128", "38127", "38118", "38114"];

      // Base fill (white)
      map.addLayer({
        id: "memphis-fill",
        type: "fill",
        source: "memphis",
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.2,
        },
      });

      // Red highlight for selected
      map.addLayer({
        id: "hot-zips",
        type: "fill",
        source: "memphis",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.5,
        },
        filter: ["in", ["to-string", ["get", "Name"]], ["literal", redZips]],
      });

      // Outline
      map.addLayer({
        id: "memphis-outline",
        type: "line",
        source: "memphis",
        paint: {
          "line-color": "#333",
          "line-width": 1.5,
        },
      });

      map.on("mouseenter", "hot-zips", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "hot-zips", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "hot-zips", (e) => {
        const zip = e.features?.[0]?.properties?.Name?.toString();
        if (!zip) return;
        setSelectedZip(zip);
        setModalOpen(true);
      });

      const bounds = new mapboxgl.LngLatBounds();
      geo.features.forEach((f) => {
        const coords =
          f.geometry.type === "Polygon"
            ? f.geometry.coordinates.flat(1)
            : f.geometry.type === "MultiPolygon"
            ? f.geometry.coordinates.flat(2)
            : [];
        coords.forEach((c) => bounds.extend([c[0], c[1]])); // ignore altitude if present
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40 });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const Content = selectedZip && ZIP_COMPONENTS[selectedZip];

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "80vw",
              height: "80vh",
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: 6,
                border: "1px solid #ddd",
                background: "#f7f7f7",
              }}
            >
              Back to Map
            </button>

            {/* Header always shows selected ZIP */}
            <h1 style={{ marginTop: 0, marginRight: 120 }}>
              {selectedZip || ""}
            </h1>

            {/* ZIP-specific content (two demo zips) or blank fallback */}
            {selectedZip ? (
              Content ? (
                <Content />
              ) : (
                <BlankZip zip={selectedZip} />
              )
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

export default MapContainer;
