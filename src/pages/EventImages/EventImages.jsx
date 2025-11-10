import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import "./EventImages.css";
import { useNavigate } from "react-router-dom";

const EventImages = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const mandapamId = user.mandapam_id;

  useEffect(() => {
    if (mandapamId) loadImages();
  }, [mandapamId]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const loadImages = async () => {
    console.log("📡 Fetching images...");
    try {
      const res = await API.get(`/event-images?mandapam_id=${mandapamId}`);
      console.log("✅ Images:", res.data);
      setImages(res.data || []);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image!");
    console.log("📤 Uploading image:", file.name);

    try {
      // convert file to base64 string
      const base64Full = await toBase64(file);
      const base64 = base64Full.split(",")[1]; // ✅ remove header like data:image/png;base64,
      const mime = file.type; // ✅ image/png or image/jpeg etc

      const payload = {
        mandapam_id: mandapamId,
        mime_type: mime,
        base64: base64
      };

      console.log("📦 Payload sending:", payload);

      const res = await API.post("/event-images", payload);
      console.log("✅ Uploaded:", res.data);
      loadImages();
      setFile(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>📸 Event Images</h2>
        <button onClick={() => navigate("/dashboard")}>⬅ Back</button>

        <div className="form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>

        <div className="gallery">
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={`data:${img.mime_type};base64,${img.base64}`}
                alt={`Event ${i + 1}`}
              />
            ))
          ) : (
            <p>No images found for this mandapam.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventImages;
