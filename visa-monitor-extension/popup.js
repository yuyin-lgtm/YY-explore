document.addEventListener("DOMContentLoaded", () => {
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const checkCount = document.getElementById("checkCount");
  const lastCheck = document.getElementById("lastCheck");
  const slotsSection = document.getElementById("slotsSection");
  const slotList = document.getElementById("slotList");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const openBtn = document.getElementById("openBtn");
  const refreshInterval = document.getElementById("refreshInterval");
  const soundToggle = document.getElementById("soundToggle");
  const notifToggle = document.getElementById("notifToggle");

  function updateUI(data) {
    const active = data.monitoringActive;
    const hasSlots = data.lastHasSlots;

    // Status indicator
    statusDot.className = "status-dot";
    statusText.className = "status-text";

    if (hasSlots) {
      statusDot.classList.add("found");
      statusText.classList.add("found");
      statusText.textContent = `SLOTS AVAILABLE (${data.lastSlotCount || 0} days)`;
    } else if (active) {
      statusDot.classList.add("active");
      statusText.classList.add("active");
      statusText.textContent = "Monitoring...";
    } else {
      statusText.textContent = "Stopped";
    }

    // Stats
    checkCount.textContent = data.checkCount || 0;

    if (data.lastCheck) {
      const date = new Date(data.lastCheck);
      lastCheck.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      lastCheck.textContent = "--";
    }

    // Slot list
    if (hasSlots && data.lastSlots && data.lastSlots.length > 0) {
      slotsSection.classList.add("visible");
      slotList.innerHTML = "";
      data.lastSlots.forEach((slot) => {
        const div = document.createElement("div");
        div.className = "slot-item";
        const dateStr = slot.Date || slot.date || JSON.stringify(slot);
        div.textContent = dateStr;
        slotList.appendChild(div);
      });
    } else {
      slotsSection.classList.remove("visible");
    }

    // Buttons
    startBtn.style.display = active ? "none" : "block";
    stopBtn.style.display = active ? "block" : "none";

    // Controls
    if (data.refreshIntervalSec) {
      refreshInterval.value = String(data.refreshIntervalSec);
    }
    if (data.soundEnabled !== undefined) {
      soundToggle.checked = data.soundEnabled;
    }
    if (data.notificationsEnabled !== undefined) {
      notifToggle.checked = data.notificationsEnabled;
    }
  }

  // Load initial state
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (data) => {
    if (data) updateUI(data);
  });

  // Poll for updates every second while popup is open
  const pollInterval = setInterval(() => {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (data) => {
      if (data) updateUI(data);
    });
  }, 1000);

  // Start monitoring
  startBtn.addEventListener("click", () => {
    const config = {
      refreshIntervalSec: parseInt(refreshInterval.value, 10),
      soundEnabled: soundToggle.checked,
    };

    chrome.storage.local.set({
      notificationsEnabled: notifToggle.checked,
      soundEnabled: soundToggle.checked,
    });

    chrome.runtime.sendMessage(
      { type: "START_MONITORING", config },
      () => {
        chrome.runtime.sendMessage({ type: "GET_STATUS" }, (data) => {
          if (data) updateUI(data);
        });
      }
    );
  });

  // Stop monitoring
  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "STOP_MONITORING" }, () => {
      chrome.runtime.sendMessage({ type: "GET_STATUS" }, (data) => {
        if (data) updateUI(data);
      });
    });
  });

  // Open scheduling page
  openBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_SCHEDULE_PAGE" });
  });

  // Save settings on change
  refreshInterval.addEventListener("change", () => {
    chrome.storage.local.set({
      refreshIntervalSec: parseInt(refreshInterval.value, 10),
    });
  });

  soundToggle.addEventListener("change", () => {
    chrome.storage.local.set({ soundEnabled: soundToggle.checked });
  });

  notifToggle.addEventListener("change", () => {
    chrome.storage.local.set({ notificationsEnabled: notifToggle.checked });
  });
});
