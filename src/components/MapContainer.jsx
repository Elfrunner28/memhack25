import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Zip38127 from "./Zip38127";
import Zip38118 from "./Zip38118";

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
  38118: Zip38118,
  38127: Zip38127,
};

// ---- Config ----
const MAP_STYLE = "mapbox://styles/bomka/cmhqv52hy005d01r0h3udd541"; // your dark style
const HOT_ZIPS = ["38128", "38127", "38118", "38114"]; // always the reddest

// Simple deterministic hash -> [0, 1)
function hashStringToUnit(str) {
  let h = 2166136261; // FNV-1a base
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // convert to unsigned 32-bit then normalize
  const u = (h >>> 0) / 0xffffffff;
  return u;
}

// Ease a bit so midtones are richer (feel more “varied”)
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

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
      style: MAP_STYLE,
      center: [-90.0, 35.04],
      zoom: 9.9,
    });

    // Lock the map (no scroll/zoom/pan)
    map.scrollZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.boxZoom.disable();

    mapRef.current = map;

    map.on("load", async () => {
      // Load your polygons
      const rawGeo = await fetch("/memphis.json").then((r) => r.json());

      // Add deterministic heat value per ZIP (non-changing across reloads)
      const geo = {
        ...rawGeo,
        features: rawGeo.features.map((f) => {
          const name = String(f.properties?.Name ?? "");
          // HOT_ZIPS forced to max (1). Others get seeded value in [0.15, 0.9] then eased.
          let heat = HOT_ZIPS.includes(name)
            ? 1
            : easeInOut(0.15 + 0.75 * hashStringToUnit(name));
          return {
            ...f,
            properties: {
              ...f.properties,
              heat,
            },
          };
        }),
      };

      // Add as a source
      if (map.getSource("memphis")) map.removeSource("memphis");
      map.addSource("memphis", { type: "geojson", data: geo });

      // One fill layer for everything using a color ramp:
      // white -> soft yellow -> amber -> red
      // Hot zips will also be heat=1, so they hit the reddest stop.
      map.addLayer({
        id: "zip-fill",
        type: "fill",
        source: "memphis",
        paint: {
          // Color ramp from heat property
          "fill-color": [
            "case",
            // Safety: if heat missing, make it very light
            ["!", ["has", "heat"]],
            "#ffffff",
            [
              "interpolate",
              ["linear"],
              ["get", "heat"],
              0,
              "#ffffff", // white
              0.35,
              "#fff6cc", // pale yellow
              0.6,
              "#ffca5c", // amber
              0.8,
              "#ff8a33", // orange-red
              1,
              "#ff2a2a", // red (hottest)
            ],
          ],
          // Slightly higher opacity so it stands out on dark basemap
          "fill-opacity": 0.7,
        },
      });

      // Outline layer so polygons pop on a dark map
      map.addLayer({
        id: "zip-outline",
        type: "line",
        source: "memphis",
        paint: {
          "line-color": "rgba(255,255,255,0.55)", // light outline for dark base
          "line-width": 1.2,
        },
      });

      // Invisible "hit" layer on top just for clicks/hover on HOT_ZIPS
      map.addLayer({
        id: "hot-zips-hit",
        type: "fill",
        source: "memphis",
        paint: {
          "fill-opacity": 0, // invisible but still interactive
        },
        filter: ["in", ["to-string", ["get", "Name"]], ["literal", HOT_ZIPS]],
      });

      // Cursor + click to open modal (only for the four hot zips)
      map.on("mouseenter", "hot-zips-hit", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "hot-zips-hit", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "hot-zips-hit", (e) => {
        const zip = e.features?.[0]?.properties?.Name?.toString();
        if (!zip) return;
        setSelectedZip(zip);
        setModalOpen(true);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const Content = selectedZip && ZIP_COMPONENTS[selectedZip];

  // Modal to document.body
  const ModalPortal = () => {
    if (!modalOpen) return null;

    return ReactDOM.createPortal(
      <div
        className="modal-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={() => setModalOpen(false)}
      >
        <div
          className="modal-content"
          style={{
            width: "90vw",
            maxWidth: "1200px",
            height: "85vh",
            background: "rgba(18, 18, 26, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            animation: "growIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            color: "#ffffff",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setModalOpen(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              background: "rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
          >
            Back to Map
          </button>

          <h1
            style={{
              marginTop: 0,
              marginRight: 140,
              fontSize: "2.4rem",
              fontWeight: 700,
            }}
          >
            ZIP {selectedZip || ""}
            <span
              style={{
                marginLeft: "0.9rem",
                background: "#ef4444",
                color: "#fff",
                padding: "0.4rem 0.6rem",
                borderRadius: "6px",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              High Risk
            </span>
          </h1>

          {selectedZip ? (
            Content ? (
              <Content />
            ) : (
              <BlankZip zip={selectedZip} />
            )
          ) : null}
        </div>

        <style>{`
          @keyframes fadeIn { 
            from { opacity: 0; } 
            to { opacity: 1; } 
          }
          
          @keyframes growIn {
            0% {
              opacity: 0;
              transform: scale(0.05);
            }
            60% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .modal-content::-webkit-scrollbar { width: 8px; }
          .modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05); border-radius: 4px;
          }
          .modal-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2); border-radius: 4px;
          }
          .modal-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
      <ModalPortal />
    </>
  );
}

export default MapContainer;
