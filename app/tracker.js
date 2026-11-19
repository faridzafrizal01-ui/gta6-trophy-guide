// Progress tracker for the Leonida Platinum Path guide.
// Owns the earned-trophy state: a Set of trophy names persisted in
// localStorage, plus JSON export and import so progress survives a
// browser reset or moves between machines.
var TrophyTracker = (function () {
  var STORAGE_KEY = "leonida-platinum-path-progress-v1";

  function loadEarned() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      return new Set();
    }
  }

  function saveEarned(earned) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(earned)));
    } catch (err) {
      /* storage unavailable (private mode): progress lives for the session */
    }
  }

  function computeProgress(trophies, earned) {
    var byGrade = { Platinum: [0, 0], Gold: [0, 0], Silver: [0, 0], Bronze: [0, 0] };
    var done = 0;
    trophies.forEach(function (t) {
      if (byGrade[t.grade]) byGrade[t.grade][1] += 1;
      if (earned.has(t.name)) {
        done += 1;
        if (byGrade[t.grade]) byGrade[t.grade][0] += 1;
      }
    });
    return {
      done: done,
      total: trophies.length,
      percent: trophies.length ? Math.round((done / trophies.length) * 100) : 0,
      byGrade: byGrade
    };
  }

  function exportProgress(earned) {
    var payload = JSON.stringify({ app: "leonida-platinum-path", earned: Array.from(earned) }, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leonida-platinum-path-progress.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 2000);
  }

  function importProgress(file, onDone, onError) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        var names = Array.isArray(parsed) ? parsed : parsed.earned;
        if (!Array.isArray(names)) throw new Error("no earned list in file");
        onDone(new Set(names.filter(function (n) { return typeof n === "string"; })));
      } catch (err) {
        if (onError) onError(err);
      }
    };
    reader.onerror = function () { if (onError) onError(reader.error); };
    reader.readAsText(file);
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    loadEarned: loadEarned,
    saveEarned: saveEarned,
    computeProgress: computeProgress,
    exportProgress: exportProgress,
    importProgress: importProgress
  };
})();
