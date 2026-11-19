// Roadmap data and renderer for the Leonida Platinum Path guide.
// The four phases are the order the platinum is earned in. Which
// trophies a phase covers is derived from each trophy's "stage" in
// data/trophies.json; the missable alerts are written from the
// official descriptions and repeated here so they are seen first.
var ROADMAP_PHASES = [
  {
    stage: 1,
    title: "Phase 1 — Story first",
    goal: "Play the campaign from Gone Fishing to the final mission, earning the chapter and named-mission trophies, and heed every missable warning before its point of no return.",
    alerts: [
      "Before finishing VCIA Takedown: make the unscheduled departure at VCIA (Catch Me If You Can).",
      "Engage the Rhino when it appears instead of fleeing (Challenging Tank).",
      "Take the Ocean Beach cocktail moment during the opening sequence (In The Beginning…).",
      "Let the protagonists' shared public moment play out in full (Personal Best).",
      "Never skip a choice prompt, and retry a failed attempt instead of reloading instantly (Actions Speak Louder, Bad Luck, I Guess).",
      "Keep a separate save at every chapter boundary — it is the only way back to a missed story moment."
    ]
  },
  {
    stage: 2,
    title: "Phase 2 — Post-story clean-up",
    goal: "With free roam open, finish the stranger strands and story-adjacent work: the finales for Andy, Kenton, Billy, Randy and Tyrone, Bret's unique hunt, and three more strands to reach eight.",
    alerts: [
      "Witness strange encounters fully when they start; a one-off oddity driven past may not repeat (The Truth Is Out There).",
      "If a showroom visit is scripted, smash out through the glass during the visit itself (Capital Offense)."
    ]
  },
  {
    stage: 3,
    title: "Phase 3 — Collectibles and activities",
    goal: "Sweep Leonida region by region: 3 card sets, 100 WAiNK locations, 18 meditation spots, all 52 areas, 100 vehicles, 10 Scooter Bros registrations — plus the activity grinds: 250 stunts, 42 shooting-range golds, 14 drone-race wins, 20 race wins, 50 challenges, 5 bank vaults and one operation per gang.",
    alerts: [
      "No missables live in this phase — every set and count here can be finished at your own pace."
    ]
  },
  {
    stage: 4,
    title: "Phase 4 — Endgame",
    goal: "Close the money and completion trophies: launder $250,000 of marked bills, spend $100,000 in shops, buy all 8 garages, attain 100% completion (A Long Road, Gold) — and the platinum, Vice Got a Price!, lands with the last of the 54.",
    alerts: [
      "Check the in-game completion counter category by category; the last percent is usually a half-finished counted set from Phase 3."
    ]
  }
];

function renderRoadmap(container, trophies) {
  container.replaceChildren();
  ROADMAP_PHASES.forEach(function (phase) {
    var covered = trophies.filter(function (t) { return t.stage === phase.stage; });
    var missableNames = covered.filter(function (t) { return t.missable; }).map(function (t) { return t.name; });
    var box = document.createElement("article");
    box.className = "phase";

    var heading = document.createElement("h3");
    heading.textContent = phase.title + " (" + covered.length + " trophies)";
    box.appendChild(heading);

    var goal = document.createElement("p");
    goal.className = "goal";
    goal.textContent = phase.goal;
    box.appendChild(goal);

    var covers = document.createElement("p");
    covers.className = "covers";
    covers.textContent = "Covers: " + covered.map(function (t) { return t.name; }).join(" · ");
    box.appendChild(covers);

    if (missableNames.length) {
      var flag = document.createElement("p");
      flag.className = "alert";
      flag.textContent = "MISSABLE in this phase: " + missableNames.join(" · ");
      box.appendChild(flag);
    }
    phase.alerts.forEach(function (text) {
      var alert = document.createElement("p");
      alert.className = "alert";
      alert.textContent = "⚠ " + text;
      box.appendChild(alert);
    });

    container.appendChild(box);
  });
}
