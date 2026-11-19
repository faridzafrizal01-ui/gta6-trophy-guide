// Leonida Platinum Path — app boot, filtering, spoiler shield,
// checklist rendering and the detail panel.
// Data comes from data/trophies.json (a relative fetch, so the app
// works fully offline from any static server). State lives in
// tracker.js; the roadmap lives in roadmap.js.
(function () {
  var listEl = document.getElementById("trophy-list");
  var detailEl = document.getElementById("detail");
  var searchEl = document.getElementById("search");
  var spoilerEl = document.getElementById("spoiler");
  var showingEl = document.getElementById("showing");
  var params = new URLSearchParams(window.location.search);

  var state = {
    trophies: [],
    earned: TrophyTracker.loadEarned(),
    selected: null,
    kind: (params.get("kind") || "all").toLowerCase(),
    grade: normalizeGrade(params.get("grade")),
    query: "",
    spoiler: false
  };

  function normalizeGrade(raw) {
    if (!raw) return "all";
    var g = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    return ["Platinum", "Gold", "Silver", "Bronze"].indexOf(g) >= 0 ? g : "all";
  }

  function isSpoilerHidden(trophy) {
    return state.spoiler && trophy.kind === "story" && !state.earned.has(trophy.name);
  }

  function matches(trophy) {
    if (state.kind === "missable") {
      if (!trophy.missable) return false;
    } else if (state.kind !== "all" && trophy.kind !== state.kind) {
      return false;
    }
    if (state.grade !== "all" && trophy.grade !== state.grade) return false;
    if (state.query) {
      var hay = (trophy.name + " " + trophy.description + " " + trophy.guide + " " + trophy.kind).toLowerCase();
      if (hay.indexOf(state.query) === -1) return false;
    }
    return true;
  }

  function renderProgress() {
    var p = TrophyTracker.computeProgress(state.trophies, state.earned);
    document.getElementById("progress-label").textContent =
      p.done + " of " + p.total + " earned (" + p.percent + "%)";
    document.getElementById("progress-fill").style.width = p.percent + "%";
    document.getElementById("grade-counts").textContent =
      "Platinum " + p.byGrade.Platinum[0] + "/" + p.byGrade.Platinum[1] +
      " · Gold " + p.byGrade.Gold[0] + "/" + p.byGrade.Gold[1] +
      " · Silver " + p.byGrade.Silver[0] + "/" + p.byGrade.Silver[1] +
      " · Bronze " + p.byGrade.Bronze[0] + "/" + p.byGrade.Bronze[1];
  }

  function badge(text, cls) {
    var span = document.createElement("span");
    span.className = "badge " + cls;
    span.textContent = text;
    return span;
  }

  function renderList() {
    listEl.replaceChildren();
    var visible = state.trophies.filter(matches);
    showingEl.textContent = "Showing " + visible.length + " of " + state.trophies.length + " trophies" +
      (state.kind === "online" ? " — the official PS5 list contains no online trophies." : "");
    visible.forEach(function (trophy) {
      var hidden = isSpoilerHidden(trophy);
      var li = document.createElement("li");
      li.className = "trophy" + (state.earned.has(trophy.name) ? " earned" : "") +
        (state.selected === trophy.name ? " selected" : "");

      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = state.earned.has(trophy.name);
      box.setAttribute("aria-label", "Mark " + trophy.name + " as earned");
      box.addEventListener("click", function (ev) { ev.stopPropagation(); });
      box.addEventListener("change", function () {
        if (box.checked) state.earned.add(trophy.name); else state.earned.delete(trophy.name);
        TrophyTracker.saveEarned(state.earned);
        renderAll();
      });
      li.appendChild(box);

      var text = document.createElement("span");
      var name = document.createElement("span");
      name.className = "name";
      name.textContent = hidden ? "???" : trophy.name;
      text.appendChild(name);
      text.appendChild(document.createTextNode(" "));
      text.appendChild(badge(trophy.grade, trophy.grade));
      text.appendChild(document.createTextNode(" "));
      text.appendChild(badge(trophy.kind, "kind"));
      if (trophy.missable) { text.appendChild(document.createTextNode(" ")); text.appendChild(badge("MISSABLE", "missable")); }
      if (trophy.hidden) { text.appendChild(document.createTextNode(" ")); text.appendChild(badge("Hidden", "kind")); }
      var desc = document.createElement("span");
      desc.className = "desc";
      desc.textContent = hidden ? "Spoiler shield on — earn this story trophy to reveal it." : trophy.description;
      text.appendChild(desc);
      li.appendChild(text);

      li.addEventListener("click", function () {
        state.selected = trophy.name;
        renderList();
        renderDetail();
      });
      listEl.appendChild(li);
    });
  }

  function renderDetail() {
    var trophy = state.trophies.find(function (t) { return t.name === state.selected; });
    detailEl.replaceChildren();
    if (!trophy) {
      var hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = "Select a trophy to read its official description, the guide and its sources.";
      detailEl.appendChild(hint);
      return;
    }
    var hidden = isSpoilerHidden(trophy);
    var title = document.createElement("h3");
    title.textContent = hidden ? "???" : trophy.name;
    detailEl.appendChild(title);

    var meta = document.createElement("p");
    meta.appendChild(badge(trophy.grade, trophy.grade));
    meta.appendChild(document.createTextNode(" "));
    meta.appendChild(badge(trophy.kind, "kind"));
    meta.appendChild(document.createTextNode(" Phase " + trophy.stage));
    if (trophy.count) meta.appendChild(document.createTextNode(" · Target: " + trophy.count));
    if (trophy.hidden) meta.appendChild(document.createTextNode(" · Hidden on PlayStation until earned"));
    detailEl.appendChild(meta);

    if (trophy.missable) {
      var warn = document.createElement("p");
      warn.className = "alert";
      warn.textContent = "⚠ MISSABLE — read the guide's point of no return before you play past it.";
      detailEl.appendChild(warn);
    }

    var official = document.createElement("p");
    official.className = "official";
    official.textContent = "Official description: “" + (hidden ? "???" : trophy.description) + "”";
    detailEl.appendChild(official);

    var guide = document.createElement("p");
    guide.className = "guide";
    guide.textContent = trophy.guide;
    detailEl.appendChild(guide);

    var sources = document.createElement("p");
    sources.className = "sources";
    sources.textContent = "Sources: " + trophy.sources;
    detailEl.appendChild(sources);
  }

  function renderAll() {
    renderProgress();
    renderList();
    renderDetail();
  }

  function wireChipGroup(containerId, attr, apply) {
    var container = document.getElementById(containerId);
    container.querySelectorAll("button").forEach(function (btn) {
      if (btn.getAttribute(attr) === (attr === "data-kind" ? state.kind : state.grade) ||
          (attr === "data-grade" && btn.getAttribute(attr) === state.grade)) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", function () {
        container.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        apply(btn.getAttribute(attr));
        renderList();
      });
    });
  }

  function boot(trophies) {
    state.trophies = trophies;
    renderRoadmap(document.getElementById("roadmap"), trophies);
    document.querySelectorAll("#kind-filters button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-kind") === state.kind);
    });
    document.querySelectorAll("#grade-filters button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-grade") === state.grade);
    });
    wireChipGroup("kind-filters", "data-kind", function (v) { state.kind = v; });
    wireChipGroup("grade-filters", "data-grade", function (v) { state.grade = v; });
    searchEl.addEventListener("input", function () {
      state.query = searchEl.value.trim().toLowerCase();
      renderList();
    });
    spoilerEl.addEventListener("change", function () {
      state.spoiler = spoilerEl.checked;
      renderList();
      renderDetail();
    });
    document.getElementById("export").addEventListener("click", function () {
      TrophyTracker.exportProgress(state.earned);
    });
    document.getElementById("import").addEventListener("change", function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      TrophyTracker.importProgress(file, function (imported) {
        state.earned = imported;
        TrophyTracker.saveEarned(state.earned);
        renderAll();
      });
    });
    if (!state.selected && trophies.length) {
      var firstMissable = trophies.find(function (t) { return t.missable; });
      state.selected = (firstMissable || trophies[0]).name;
    }
    renderAll();
  }

  fetch("data/trophies.json")
    .then(function (res) { return res.json(); })
    .then(function (doc) { boot(doc.trophies || []); })
    .catch(function () {
      showingEl.textContent = "Could not load data/trophies.json — serve app/ over a local server (node serve.ts).";
    });
})();
