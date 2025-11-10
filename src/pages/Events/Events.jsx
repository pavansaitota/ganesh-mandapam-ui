import React, { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import "./Events.css";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    event_name: "",
    event_type: "",
    start_date: "",
    end_date: "",
    description: "",
    eventlogo: null,
    eventbanner: null,
    event_other: null
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const roleName = user?.roles?.[0]?.role_name?.toLowerCase() || "user";
  const isMandapamAdmin = ["president","vice president","treasurer"].includes(roleName);

  // convert image to base64
  const handleImage = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, [field]: reader.result.split(",")[1] });
    reader.readAsDataURL(file);
  };

  const fetchEvents = async () => {
    let url = "/events";
    if (!isMandapamAdmin && user.mandapam_id) {
      url = `/events?mandapam_id=${user.mandapam_id}`;
    }
    const res = await API.get(url);
    setEvents(res.data || []);
  };

  // CREATE / UPDATE
  const saveEvent = async () => {
    const payload = { ...form, mandapam_id: user.mandapam_id };
    if (editingEvent) {
      await API.put(`/events/${editingEvent.event_id}`, payload);
    } else {
      await API.post(`/events`, payload);
    }
    resetForm();
    fetchEvents();
  };

  const resetForm = () => {
    setEditingEvent(null);
    setForm({
      event_name: "",
      event_type: "",
      start_date: "",
      end_date: "",
      description: "",
      eventlogo: null,
      eventbanner: null,
      event_other: null
    });
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="events-page">
      <div className="events-container">
        <div className="header">
          <h2>{isMandapamAdmin ? "Manage Events" : "Events"}</h2>
          <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
        </div>

        {isMandapamAdmin && (
          <div className="event-form">
            <input placeholder="Event Name"
              value={form.event_name}
              onChange={(e)=>setForm({...form,event_name:e.target.value})}
            />
            <input placeholder="Event Type"
              value={form.event_type}
              onChange={(e)=>setForm({...form,event_type:e.target.value})}
            />

            <label>Start Date</label>
            <input type="date"
              value={form.start_date}
              onChange={(e)=>setForm({...form,start_date:e.target.value})}
            />
            <label>End Date</label>
            <input type="date"
              value={form.end_date}
              onChange={(e)=>setForm({...form,end_date:e.target.value})}
            />

            <textarea placeholder="Description"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
            />

            <label>Event Logo</label>
            <input type="file" onChange={(e)=>handleImage(e,"eventlogo")} />

            <label>Event Banner</label>
            <input type="file" onChange={(e)=>handleImage(e,"eventbanner")} />

            <label>Event Other Image</label>
            <input type="file" onChange={(e)=>handleImage(e,"event_other")} />

            <button onClick={saveEvent}>
              {editingEvent ? "Update Event" : "Create Event"}
            </button>
          </div>
        )}

        {/* EVENTS LIST */}
        <div className="event-list">
          {events.map((e)=>(
            <div key={e.event_id} className="event-card">
              <h3>{e.event_name}</h3>
              <p>{e.start_date?.split("T")[0]} → {e.end_date?.split("T")[0]}</p>
              <p>{e.description}</p>

              {e.eventlogo && (
                <img style={{width:"100px"}}
                  src={`data:image/png;base64,${e.eventlogo}`} alt=""
                />
              )}

              {isMandapamAdmin && (
                <button onClick={()=>{setEditingEvent(e);setForm(e);}}>
                  ✏️ Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
