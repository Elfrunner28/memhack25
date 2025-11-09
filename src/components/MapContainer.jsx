import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Zip38127 from "./Zip38127";
import Zip38128 from "./Zip38128";


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
      center: [-90, 35.04],
      zoom: 9.9,
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

      // Comment out fitBounds so the initial center/zoom are respected
      // const bounds = new mapboxgl.LngLatBounds();
      // geo.features.forEach((f) => {
      //   const coords =
      //     f.geometry.type === "Polygon"
      //       ? f.geometry.coordinates.flat(1)
      //       : f.geometry.type === "MultiPolygon"
      //       ? f.geometry.coordinates.flat(2)
      //       : [];
      //   coords.forEach((c) => bounds.extend([c[0], c[1]]));
      // });
      // if (!bounds.isEmpty()) {
      //   map.fitBounds(bounds, { 
      //     padding: { top: 120, bottom: 40, left: 40, right: 40 }
      //   });
      // }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const Content = selectedZip && ZIP_COMPONENTS[selectedZip];

  // Modal component that renders to document.body
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
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
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
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.20)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.14)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Back to Map
          </button>

          {/* Header always shows selected ZIP */}
          <h1 style={{ marginTop: 0, marginRight: 140, fontSize: "2.5rem", fontWeight: 700 }}>
            ZIP {selectedZip || ""}
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

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .modal-content::-webkit-scrollbar {
            width: 8px;
          }

          .modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }

          .modal-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
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
