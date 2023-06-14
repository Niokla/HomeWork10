const msgerForm = document.querySelector(".msger-inputarea");
const msgerGeoBtn = document.querySelector(".msger-geo-btn");
const msgerInput = document.querySelector(".msger-input");
const msgerChat = document.querySelector(".msger-chat");

const BOT_NAME = "Bot";
const PERSON_NAME = "You";

if (!navigator.geolocation) {
    msgerGeoBtn.style.display = "none";
}

const websocket = new WebSocket("wss://echo-ws-service.herokuapp.com");

websocket.onopen = (e) => console.log("Connected");
websocket.onclose = (e) => console.log("Disconnected");
websocket.onerror = (e) => {
    console.log("Connection error");
};
websocket.onmessage = (e) => {
    let msg = e.data;
    console.log(msg);
    if (!isLocation(msg)) appendMessage(BOT_NAME, "left", msg);
};

msgerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, "right", msgText);
    msgerInput.value = "";
    websocket.send(msgText);
});

msgerGeoBtn.addEventListener("click", (event) => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            let loc = `${latitude}°, ${longitude}°`;
            let msg = `<a href="https://www.openstreetmap.org/#map=12/${latitude}/${longitude}" target="_blank">${loc}</a>`;
            appendMessage(PERSON_NAME, "right", msg);
            msgerInput.value = "";
            websocket.send(loc);
        },
        () => {
            appendMessage(PERSON_NAME, "right", "Geo-location error");
            msgerInput.value = "";
        }
    );
});

function appendMessage(name, side, text) {

    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

// utils

function formatDate(date) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");

    return `${h}:${m}`;
}

function isLocation(str) {
    var count = (str.match(/°/g) || []).length;
    return count === 2;
}