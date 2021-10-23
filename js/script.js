const overlay = document.querySelector(".overlay");

function overlayClose() {
  if (overlay.classList.contains("overlay--modal")) {
    closeModal();
  } else {
    toggleMenu();
  }
}

overlay.addEventListener("click", overlayClose);

const btnMenu = document.querySelector(".btn--menu");
const btnMenuIcon = document.querySelector(".menu-icon");
const nav = document.querySelector(".navigation__list");

function toggleMenu() {
  nav.classList.toggle("navigation__list--hidden");
  overlay.classList.toggle("overlay--hidden");
  document.body.classList.toggle("disable-scroll");

  if (nav.classList.contains("navigation__list--hidden")) {
    btnMenuIcon.src = "./images/icon-hamburger.svg";
    btnMenu.setAttribute("aria-expanded", "false");
  } else {
    btnMenuIcon.src = "./images/icon-close-menu.svg";
    btnMenu.setAttribute("aria-expanded", "true");
  }
}

btnMenu.addEventListener("click", toggleMenu);

const bookmark = document.querySelector(".bookmark");

function bookmarkProject() {
  bookmark.classList.toggle("bookmark--active");

  if (bookmark.classList.contains("bookmark--active")) {
    bookmark.setAttribute("aria-pressed", "true");
  } else {
    bookmark.setAttribute("aria-pressed", "false");
  }
}

bookmark.addEventListener("click", bookmarkProject);

const amountGoal = 100000;
let totalBacked = 89914;
let totalBackers = 5007;
let focusedElementBeforeModal;

const modalTrigger = document.querySelectorAll(".modal-trigger");
const btnPrimary = document.querySelector(".btn--primary");
const btnSelectReward = document.querySelectorAll(".btn--reward");

const modalContainer = document.querySelector(".modal-container");

const modalSelection = document.querySelector(".modal--selection");
const btnCloseModal = document.querySelector(".btn--close-modal");
const radioInputs = document.querySelectorAll(".radio__input");
const pledgeForms = document.querySelectorAll(".pledge__form");

const modalSuccess = document.querySelector(".modal--success");
const btnCloseSuccess = document.querySelector(".btn--success");

function openModal(triggerbtn) {
  focusedElementBeforeModal = triggerbtn;
  focusedElementBeforeModal.setAttribute("aria-expanded", "true");

  overlay.classList.remove("overlay--hidden");
  overlay.classList.add("overlay--modal");

  document.body.classList.add("modal-open");
  modalContainer.classList.remove("display-none");
  modalContainer.classList.remove("hidden");
  modalSelection.classList.remove("hidden");
  modalSelection.classList.remove("fadeOut");

  modalSelection.classList.add("fadeIn");
  modalSelection.focus();

  modalSelection.addEventListener("keydown", tabTrapKey);

  const focusableElementsString =
    "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

  let focusableElements = modalSelection.querySelectorAll(
    focusableElementsString
  );

  focusableElements = Array.prototype.slice.call(focusableElements);

  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];

  function tabTrapKey(event) {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstTabStop) {
          event.preventDefault();
          lastTabStop.focus();
        }
      } else {
        if (document.activeElement === lastTabStop) {
          event.preventDefault();
          firstTabStop.focus();
        }
      }
    }
  }

  if (triggerbtn === btnPrimary) {
    document.activeElement.blur();
    firstTabStop.focus(); 
  } else {
    document.getElementById(
      `reward-${triggerbtn.dataset.group}`
    ).checked = true;
    updateCheckedStyles();
    document.getElementById(`reward-${triggerbtn.dataset.group}`).focus();

    const selected = document.getElementById(
      `modalPledge--${triggerbtn.dataset.group}`
    );

    selected.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }
}

function updateCheckedStyles() {
  radioInputs.forEach((input) => {
    if (input.checked) {
      input.closest(".pledge").classList.add("pledge--selected");
    } else if (!input.checked) {
      input.closest(".pledge").classList.remove("pledge--selected");
    }
  });
}

radioInputs.forEach((input) => {
  input.addEventListener("change", updateCheckedStyles);
});

modalTrigger.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.target.focus();
    openModal(btn);
  });
});

function closeModal() {
  modalSelection.classList.add("hidden");
  modalSelection.classList.remove("fadeIn");
  modalSelection.classList.add("fadeOut");
  modalSuccess.classList.add("hidden");
  modalSuccess.classList.add("fadeOutSuccess");
  modalSuccess.classList.remove("fadeInSuccess");
  overlay.classList.add("overlay--hidden");
  overlay.classList.remove("overlay--modal");
  document.body.classList.remove("modal-open");
  modalContainer.classList.add("hidden");

  document.querySelectorAll(".pledge__form").forEach((form) => {
    form.reset();
  });
  radioInputs.forEach((input) => {
    input.checked = false;
  });
  updateCheckedStyles();

  document.activeElement.blur();
  focusedElementBeforeModal.focus();
  focusedElementBeforeModal.setAttribute("aria-expanded", "false");

  setTimeout(function () {
    modalContainer.classList.add("display-none");
  }, 700);
}

[btnCloseModal, btnCloseSuccess].forEach((btn) => {
  btn.addEventListener("click", closeModal);
});
document.addEventListener("keydown", (event) => {
  if (event.key == "Escape" && overlay.classList.contains("overlay--modal")) {
    closeModal();
  }
});
modalContainer.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    return;
  } else {
    closeModal();
  }
});

pledgeForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (form.dataset.group != "noreward") {
      updateReward(form);
    }
    totalBackers++;
    document.getElementById("num-backers").innerHTML =
      totalBackers.toLocaleString();

    updateTotalBacked(form);
    successModal();
  });
});

function updateReward(form) {
  let numRemaining = parseInt(
    document.querySelector(`.number--${form.dataset.group}`).innerHTML
  );

  if (numRemaining > 0) {
    numRemaining--;
    document
      .querySelectorAll(`.number--${form.dataset.group}`)
      .forEach((item) => {
        item.innerHTML = numRemaining;
      });
  }
}

function updateTotalBacked(form) {
  const amountPledged = parseInt(
    document.getElementById(`amount-${form.dataset.group}`).value
  );

  totalBacked += amountPledged;

  document.getElementById(
    "total-backed"
  ).innerHTML = `$${totalBacked.toLocaleString()}`;

  const percentageBacked = Math.floor((totalBacked / amountGoal) * 100);

  document.querySelector(
    ".statistics__slider-inner"
  ).style.width = `${percentageBacked}%`;
}

function successModal() {
  document.activeElement.blur();
  modalSelection.classList.add("hidden");
  modalSelection.classList.add("fadeOut");
  modalSuccess.classList.remove("hidden");
  modalSuccess.classList.remove("fadeOutSuccess");
  modalSuccess.classList.add("fadeInSuccess");
}
