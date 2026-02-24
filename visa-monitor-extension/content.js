// Content script: Intercepts fetch/XHR calls to the visa scheduling API
// and detects when appointment slots become available.
// Injected at document_start on usvisascheduling.com pages.

(function () {
  "use strict";

  const SCHEDULE_API_PATTERN =
    /\/api\/v1\/schedule-group\/get-family-consular-schedule-days/;

  function processScheduleResponse(responseBody, url) {
    try {
      const json =
        typeof responseBody === "string"
          ? JSON.parse(responseBody)
          : responseBody;

      const scheduleDays = json?.ScheduleDays ?? json?.scheduleDays ?? [];
      const hasSlots = Array.isArray(scheduleDays) && scheduleDays.length > 0;

      const payload = {
        type: "VISA_SLOT_UPDATE",
        hasSlots,
        slotCount: scheduleDays.length,
        slots: scheduleDays.slice(0, 20), // send first 20 for display
        timestamp: new Date().toISOString(),
        url,
      };

      chrome.runtime.sendMessage(payload);

      if (hasSlots) {
        console.log(
          `[Visa Monitor] Slots found! ${scheduleDays.length} available day(s):`,
          scheduleDays
        );
      } else {
        console.log("[Visa Monitor] No slots available.");
      }
    } catch (err) {
      console.error("[Visa Monitor] Error parsing schedule response:", err);
    }
  }

  // --- Hook fetch ---
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url ?? "";

    if (SCHEDULE_API_PATTERN.test(url)) {
      const clone = response.clone();
      clone
        .json()
        .then((json) => processScheduleResponse(json, url))
        .catch(() => {});
    }

    return response;
  };

  // --- Hook XMLHttpRequest ---
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._visaMonitorUrl = url;
    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (SCHEDULE_API_PATTERN.test(this._visaMonitorUrl)) {
      this.addEventListener("load", function () {
        try {
          processScheduleResponse(this.responseText, this._visaMonitorUrl);
        } catch (err) {
          // ignore
        }
      });
    }
    return originalSend.apply(this, args);
  };

  // --- Periodic page refresh to keep checking ---
  chrome.storage.local.get(
    ["monitoringActive", "refreshIntervalSec"],
    (data) => {
      if (data.monitoringActive) {
        const interval = (data.refreshIntervalSec || 30) * 1000;
        console.log(
          `[Visa Monitor] Active. Auto-refresh in ${interval / 1000}s`
        );

        setTimeout(() => {
          chrome.storage.local.get(["monitoringActive"], (check) => {
            if (check.monitoringActive) {
              location.reload();
            }
          });
        }, interval);
      }
    }
  );

  console.log("[Visa Monitor] Content script loaded, API hooks installed.");
})();
