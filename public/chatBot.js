(function () {
  const api_Url = "https://ai-customer-support-b4dw.vercel.app/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag?.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("Owner id not found");
    return;
  }

  // Inject CSS styles for animations
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes botPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    .bot-typing-dots {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 2px;
    }
    .bot-dot {
      width: 7px;
      height: 7px;
      background-color: #4b5563;
      border-radius: 50%;
      animation: botPulse 1.4s infinite ease-in-out both;
    }
    .bot-dot:nth-child(1) { animation-delay: -0.32s; }
    .bot-dot:nth-child(2) { animation-delay: -0.16s; }
  `;
  document.head.appendChild(style);

  const button = document.createElement("div");
  button.innerHTML = "🗨️";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    zIndex: "999999",
  });

  document.body.appendChild(button);

  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "330px",
    height: "450px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  });

  box.innerHTML = `<div style="
  background:#000;
  color:#fff;
  padding:14px 16px;
  font-size:14px;
  font-weight:600;
  display:flex;
  justify-content:space-between;
  align-items:center;
  " >
  <span>Customer Support</span>
  <span id='chat-close' style='cursor:pointer; font-size:16px;' >❌</span>
  </div>
  
  <div id='chat-messages' style='
  flex:1;
  padding:12px;
  overflow-y:auto;
  background:#f9fafb;
  display:flex;
  flex-direction:column;
  gap:8px;
  '></div>

  <div style='
  display:flex;
  border-top:1px solid #e5e7eb;
  padding:10px;
  gap:8px;
  background:#fff;
  ' >
  <input id='chat-input' type='text' 
  style='
  flex:1;
  padding:9px 12px;
  border:1px solid #d1d5db;
  border-radius:8px;
  font-size:12.5px;
  outline:none;
  transition: border-color 0.2s;
  ' 
  placeholder='Type a message (Press Enter to send)...' />
<button
  id="chat-send"
  style="
    padding:9px 14px;
    border:none;
    background:#000;
    color:#fff;
    border-radius:8px;
    font-size:13px;
    font-weight:500;
    cursor:pointer;
    transition: opacity 0.2s;
  "
>
  Send
</button>
  </div>
  `;

  document.body.appendChild(box);

  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
    if (box.style.display === "flex") {
      input.focus();
    }
  };

  document.querySelector("#chat-close").onclick = () => {
    box.style.display = "none";
  };

  const input = document.querySelector("#chat-input");
  const sendBtn = document.querySelector("#chat-send");
  const messageArea = document.querySelector("#chat-messages");

  function addMessage(text, from) {
    const bubble = document.createElement("div");
    bubble.innerHTML = text;
    Object.assign(bubble.style, {
      maxWidth: "80%",
      padding: "9px 13px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: "1.45",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user" ? "#000" : "#e5e7eb",
      color: from === "user" ? "#fff" : "#111",
      borderTopRightRadius: from === "user" ? "4px" : "14px",
      borderTopLeftRadius: from === "user" ? "14px" : "4px",
      wordBreak: "break-word",
    });

    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    return bubble;
  }

  // Initial welcome message
  addMessage("hi! how can i help you?", "ai");

  let isSending = false;

  async function sendMessage(textToSend) {
    const text = textToSend || input.value.trim();
    if (!text || isSending) return;

    isSending = true;
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";

    addMessage(text, "user");

    // Create animated typing indicator
    const typing = document.createElement("div");
    Object.assign(typing.style, {
      padding: "8px 12px",
      borderRadius: "14px",
      borderTopLeftRadius: "4px",
      background: "#e5e7eb",
      alignSelf: "flex-start",
      display: "flex",
      alignItems: "center",
      marginBottom: "4px",
    });

    typing.innerHTML = `
      <div class="bot-typing-dots">
        <span class="bot-dot"></span>
        <span class="bot-dot"></span>
        <span class="bot-dot"></span>
      </div>
    `;

    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      const response = await fetch(api_Url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ownerId,
          message: text,
        }),
      });

      const data = await response.json();
      messageArea.removeChild(typing);

      let reply = "Something went wrong";
      if (typeof data === "string") {
        reply = data;
      } else if (data && data.message) {
        reply = data.message;
      }

      addMessage(reply, "ai");
    } catch (error) {
      console.log(error);
      messageArea.removeChild(typing);
      addMessage("Something went wrong. Please try again later.", "ai");
    } finally {
      isSending = false;
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      input.focus();
    }
  }

  sendBtn.onclick = () => sendMessage();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();


