let currentRegions = [];
let currentStatuses = [];
let mobileRegions = [];

/* =========================
   PC 區域複選
========================= */

function setRegion(r, e) {
  const allBtn = document.querySelector(".region-btn[onclick*=\"setRegion('all'\"]");

  if (r === "all") {
    currentRegions = [];
    document.querySelectorAll(".region-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    if (e) e.classList.add("active");
  } else {
    if (currentRegions.includes(r)) {
      currentRegions = currentRegions.filter((item) => item !== r);
      if (e) e.classList.remove("active");
    } else {
      currentRegions.push(r);
      if (e) e.classList.add("active");
    }
  }

  if (allBtn) {
    if (currentRegions.length > 0) {
      allBtn.classList.remove("active");
    } else {
      allBtn.classList.add("active");
    }
  }

  mobileRegions = [...currentRegions];
  syncMobileRegion();
  toggleStatusFilter();
  applyFilter();
}

/* =========================
   手機區域開關
========================= */

function toggleMobileRegion() {
  const box = document.querySelector(".mobile-region-select");
  const menu = document.getElementById("mobileRegionList");
  if (menu) menu.classList.toggle("show");
  if (box) box.classList.toggle("open");
}

/* =========================
   手機選擇區域
========================= */

function mobileSelectRegion(value, text, el) {
  const title = document.getElementById("mobileRegionText");
  if (value === "all") {
    mobileRegions = [];
    document.querySelectorAll(".mobile-region-list div").forEach((item) => {
      item.classList.remove("active");
    });
    el.classList.add("active");
    title.innerHTML = "全部地區";
  } else {
    const all = document.querySelector(".mobile-region-list div[onclick*=\"mobileSelectRegion('all'\"]");
    if (all) all.classList.remove("active");

    if (mobileRegions.includes(value)) {
      mobileRegions = mobileRegions.filter((item) => item !== value);
      el.classList.remove("active");
    } else {
      mobileRegions.push(value);
      el.classList.add("active");
    }

    if (mobileRegions.length === 0) {
      title.innerHTML = "全部地區";
      if (all) all.classList.add("active");
    } else {
      let names = [];
      document.querySelectorAll(".mobile-region-list div.active").forEach((item) => {
        if (item.innerText !== "全部地區") names.push(item.innerText);
      });
      title.innerHTML = names.join("、");
    }
  }
  currentRegions = [...mobileRegions];
  syncDesktopRegion();
  toggleStatusFilter();
  applyFilter();
  document.querySelector(".mobile-region-select")?.classList.remove("open");
  document.getElementById("mobileRegionList")?.classList.remove("show");
}

/* =========================
   同步 PC active
========================= */

function syncDesktopRegion() {
  document.querySelectorAll(".region-btn").forEach((btn) => {
    btn.classList.remove("active");
    const onclick = btn.getAttribute("onclick");
    if (!onclick) return;
    if (onclick.includes("'all'")) {
      if (currentRegions.length === 0) btn.classList.add("active");
    } else {
      const match = onclick.match(/setRegion\('([^']+)'/);
      if (match && currentRegions.includes(match[1])) btn.classList.add("active");
    }
  });
}

/* =========================
   同步手機 active
========================= */

function syncMobileRegion() {
  document.querySelectorAll(".mobile-region-list div").forEach((item) => {
    item.classList.remove("active");
    if (item.innerText === "全部地區" && currentRegions.length === 0) {
      item.classList.add("active");
    } else {
      const onclick = item.getAttribute("onclick");
      if (onclick) {
        const match = onclick.match(/mobileSelectRegion\('([^']+)'/);
        if (match && currentRegions.includes(match[1])) item.classList.add("active");
      }
    }
  });
  const title = document.getElementById("mobileRegionText");
  if (!title) return;
  if (currentRegions.length === 0) {
    title.innerHTML = "全部地區";
  } else {
    const names = [];
    document.querySelectorAll(".mobile-region-list div.active").forEach((item) => {
      if (item.innerText !== "全部地區") names.push(item.innerText);
    });
    title.innerHTML = names.join("、");
  }
}

/* =========================
   點外關閉手機
========================= */

document.addEventListener("click", function (e) {
  const box = document.querySelector(".mobile-region-select");
  const list = document.getElementById("mobileRegionList");
  if (box && !box.contains(e.target)) {
    if (list) list.classList.remove("show");
    box.classList.remove("open");
  }
});

/* =========================
   狀態 checkbox
========================= */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#statusFilter input").forEach((check) => {
    check.addEventListener("change", () => {
      currentStatuses = Array.from(document.querySelectorAll("#statusFilter input:checked")).map((item) => item.value);
      applyFilter();
    });
  });
});

function toggleStatusFilter() {
  const box = document.getElementById("statusFilter");
  if (!box) return;
  box.style.display = "flex";
}

/* =========================
   核心篩選
========================= */

function applyFilter() {
  document.querySelectorAll(".day-card").forEach((card) => {
    const items = card.querySelectorAll(".agenda-item");
    let hasMatch = false;
    items.forEach((item) => {
      const region = item.dataset.region;
      const status = item.dataset.status;
      const regionMatch = currentRegions.length === 0 || currentRegions.includes(region);
      const statusMatch = currentStatuses.length === 0 || currentStatuses.includes(status);
      if (regionMatch && statusMatch) {
        item.style.display = "";
        hasMatch = true;
      } else {
        item.style.display = "none";
      }
    });
    card.style.display = "";
    const more = card.querySelector(".view-more-btn");
    if (more) {
      more.style.display = (hasMatch || items.length === 0) ? "" : "none";
    }
  });
}

/* =========================
   日期星期
========================= */

window.addEventListener("DOMContentLoaded", () => {
  const weekMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  document.querySelectorAll(".day-card").forEach((card) => {
    if (card.dataset.date) {
      const [y, m, d] = card.dataset.date.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const el = card.querySelector(".weekday-text");
      if (el) el.textContent = weekMap[date.getDay()];
    }
  });

  const allBtn = document.querySelector(".region-btn[onclick*=\"setRegion('all'\"]");
  if (allBtn) allBtn.classList.add("active");
  toggleStatusFilter();
  applyFilter();
  updateArrowVisibility(); // 初始化箭頭狀態
});

/* =========================
   地區按鈕捲動控制
========================= */

function scrollRegionBtns(direction) {
  const box = document.getElementById("regionBtns");
  if (!box) return;
  box.scrollBy({ left: direction * 250, behavior: "smooth" });
  setTimeout(updateArrowVisibility, 350);
}

function updateArrowVisibility() {
  const box = document.getElementById("regionBtns");
  const leftArrow = document.querySelector(".region-arrow.left");
  const rightArrow = document.querySelector(".region-arrow.right");

  if (!box) return;


  // 沒有超出，不需要箭頭
  if (box.scrollWidth <= box.clientWidth) {
    if (leftArrow) leftArrow.style.display = "none";
    if (rightArrow) rightArrow.style.display = "none";
    return;
  }


  const isAtStart = box.scrollLeft <= 5;
  const isAtEnd =
    box.scrollLeft + box.clientWidth >= box.scrollWidth - 5;


  // 左箭頭
  if (leftArrow) {
    leftArrow.style.display = isAtStart ? "none" : "flex";
  }


  // 右箭頭
  if (rightArrow) {
    rightArrow.style.display = isAtEnd ? "none" : "flex";
  }
}
document.getElementById("regionBtns")?.addEventListener("scroll", updateArrowVisibility);