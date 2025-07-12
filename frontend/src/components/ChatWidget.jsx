import React, { useState, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import axios from "axios";
import ChatBox from "./ChatBox";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const ChatWidget = ({ userId, role }) => {
  const [open, setOpen] = useState(false);
  const [senders, setSenders] = useState([]);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    if (role === "admin") {
      socket.on("receive_message", async (data) => {
        if (data.receiverId === userId) {
          const res = await axios.get(`http://localhost:4000/api/team/${data.senderId}`);
          const name = res.data.name || `User (${data.senderId.slice(0, 5)})`;
          toast.info(`📩 ${name} sent you a message!`);

          setSenders((prev) => {
            const exists = prev.find((s) => s.id === data.senderId);
            if (!exists) return [...prev, { id: data.senderId, name }];
            return prev;
          });
        }
      });
    }

    return () => socket.off("receive_message");
  }, [userId, role]);

  useEffect(() => {
    if (role === "admin") {
      const fetchSenders = async () => {
        try {
          const res = await axios.get("http://localhost:4000/api/messages");
          const teamRes = await axios.get("http://localhost:4000/api/team");

          const uniqueSenderIds = [...new Set(
            res.data.filter(m => m.receiverId === userId).map(m => m.senderId)
          )];

          const names = uniqueSenderIds.map(id => {
            const match = teamRes.data.find(t => t._id === id);
            return {
              id,
              name: match?.name || `User (${id.slice(0, 5)})`
            };
          });

          setSenders(names);
        } catch (err) {
          console.error("❌ Error loading senders", err);
        }
      };

      fetchSenders();
    }
  }, [userId, role]);

  return (
    <>
      <div onClick={() => setOpen(!open)} style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        backgroundColor: "#0d6efd",
        color: "white",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 999,
      }}>
        <BsChatDots size={28} />
      </div>

      {open && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "25px",
          width: "360px",
          zIndex: 999,
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
        }}>
          {role === "admin" ? (
            <>
              <label>Select Member to Chat</label>
              <select
                className="form-select mb-2"
                value={targetId || ""}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="" disabled>Select a sender</option>
                {senders.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {targetId && <ChatBox userId={userId} role={role} targetId={targetId} />}
            </>
          ) : (
            <ChatBox userId={userId} role={role} targetId="admin" />
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
