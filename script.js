// Weather API
const weatherApiKey = "c2c3d617edad41fe1e0a607c7849f828";
const weatherCard = document.getElementById("weatherCard");
const locationDiv = document.getElementById("location");
const temperatureDiv = document.getElementById("temperature");

navigator.geolocation.getCurrentPosition(async (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
    const data = await res.json();

    locationDiv.textContent = `${data.name}, ${data.sys.country}`;
    temperatureDiv.textContent = `${data.weather[0].main} - ${data.main.temp}°C`;

    const emojiMap = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Mist: "🌫️"
    };

    document.querySelector(".weather-icon").textContent = emojiMap[data.weather[0].main] || "🌤️";
  } catch (err) {
    locationDiv.textContent = "Location unavailable";
    temperatureDiv.textContent = "Failed to load weather";
  }
}, () => {
  locationDiv.textContent = "Location unavailable";
  temperatureDiv.textContent = "Failed to load weather";
});

// Chatbot
const toggleBtn = document.getElementById("toggleChat");
const chatContainer = document.getElementById("chatContainer");
const chatBody = document.getElementById("chatBody");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

toggleBtn.onclick = () => {
  chatContainer.classList.toggle("hidden");
};

sendBtn.onclick = async () => {
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage("You", msg);
  userInput.value = "";

  const typingMsg = document.createElement("div");
  typingMsg.textContent = "Gemini is typing...";
  chatBody.appendChild(typingMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const temperature = temperatureDiv.textContent || "some temperature";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB9q-Zc4UylyI0bJa5eWtNcv7j9V9_Bp5s",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Based on the current temperature ${temperature}, ${msg}` }]
          }]
        }),
      }
    );

    const data = await response.json();
    const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*/g, "") || "I couldn't respond.";

    chatBody.removeChild(typingMsg);
    appendMessage("Gemini", geminiReply);
  } catch (e) {
    chatBody.removeChild(typingMsg);
    appendMessage("Gemini", "Something went wrong.");
  }
};

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}
