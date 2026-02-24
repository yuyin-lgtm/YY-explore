// Background service worker: Handles notifications, alarm-based polling,
// and state management for the visa slot monitor.

const DEFAULT_CONFIG = {
  monitoringActive: false,
  refreshIntervalSec: 30,
  soundEnabled: true,
  notificationsEnabled: true,
  checkCount: 0,
  lastCheck: null,
  lastSlots: [],
  lastHasSlots: false,
};

// --- Initialization ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(null, (existing) => {
    const merged = { ...DEFAULT_CONFIG, ...existing };
    chrome.storage.local.set(merged);
  });
});

// --- Listen for slot updates from content script ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VISA_SLOT_UPDATE") {
    handleSlotUpdate(message);
    sendResponse({ received: true });
    return;
  }

  if (message.type === "START_MONITORING") {
    startMonitoring(message.config);
    sendResponse({ started: true });
    return;
  }

  if (message.type === "STOP_MONITORING") {
    stopMonitoring();
    sendResponse({ stopped: true });
    return;
  }

  if (message.type === "GET_STATUS") {
    chrome.storage.local.get(null, (data) => {
      sendResponse(data);
    });
    return true; // async response
  }

  if (message.type === "OPEN_SCHEDULE_PAGE") {
    chrome.tabs.create({
      url: "https://www.usvisascheduling.com/en-US/schedule/",
      active: true,
    });
    sendResponse({ opened: true });
    return;
  }
});

async function handleSlotUpdate(message) {
  const data = await getStorage();
  const newCheckCount = (data.checkCount || 0) + 1;

  const update = {
    checkCount: newCheckCount,
    lastCheck: message.timestamp,
    lastHasSlots: message.hasSlots,
    lastSlots: message.slots || [],
    lastSlotCount: message.slotCount || 0,
  };

  await setStorage(update);

  if (message.hasSlots && data.notificationsEnabled !== false) {
    const slotDates = message.slots
      .map((s) => s.Date || s.date || JSON.stringify(s))
      .slice(0, 5)
      .join(", ");

    chrome.notifications.create(`visa-slot-${Date.now()}`, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Visa Slots Available!",
      message: `${message.slotCount} appointment day(s) found! Dates: ${slotDates}`,
      priority: 2,
      requireInteraction: true,
    });

    // Play alert sound by injecting into the active tab
    if (data.soundEnabled !== false) {
      try {
        const tabs = await chrome.tabs.query({
          url: "https://www.usvisascheduling.com/*",
        });
        for (const tab of tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: playAlertSound,
          });
        }
      } catch (err) {
        // tab might be closed
      }
    }
  }
}

function playAlertSound() {
  // Generate a distinct alert tone using Web Audio API
  const ctx = new AudioContext();
  const frequencies = [880, 1100, 880, 1100, 1320];
  let time = ctx.currentTime;

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
    osc.start(time);
    osc.stop(time + 0.25);
    time += 0.3;
  });
}

async function startMonitoring(config = {}) {
  const update = {
    monitoringActive: true,
    checkCount: 0,
    lastCheck: null,
    lastHasSlots: false,
    lastSlots: [],
  };

  if (config.refreshIntervalSec) {
    update.refreshIntervalSec = config.refreshIntervalSec;
  }
  if (config.soundEnabled !== undefined) {
    update.soundEnabled = config.soundEnabled;
  }

  await setStorage(update);

  // Reload any open scheduling tabs to start the content script monitoring
  const tabs = await chrome.tabs.query({
    url: "https://www.usvisascheduling.com/*",
  });

  if (tabs.length > 0) {
    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  } else {
    // Open the scheduling page if not already open
    chrome.tabs.create({
      url: "https://www.usvisascheduling.com/en-US/schedule/",
      active: false,
    });
  }
}

async function stopMonitoring() {
  await setStorage({ monitoringActive: false });

  // Stop auto-refresh in content scripts by reloading tabs one last time
  const tabs = await chrome.tabs.query({
    url: "https://www.usvisascheduling.com/*",
  });
  for (const tab of tabs) {
    chrome.tabs.reload(tab.id);
  }
}

// --- Notification click handler: open the scheduling page ---
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("visa-slot-")) {
    chrome.tabs.create({
      url: "https://www.usvisascheduling.com/en-US/schedule/",
      active: true,
    });
  }
});

// --- Storage helpers ---
function getStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, resolve);
  });
}

function setStorage(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
}
