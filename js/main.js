// Cache frequently used DOM elements
const elements = {
  hamburgerBtn: document.querySelector(".header-hamburger-menyu"),
  hamburgerClose: document.querySelector(".header-responsive-close"),
  hamburgerMenu: document.querySelector(".header-responsive"),
  formModal: document.querySelector(".formModal"),
  bgCloseModal: document.querySelector(".bgCloseModal"),
  loader: document.querySelector(".loaderBG"),
  formModalText: document.querySelector(".formModalText"),
  formModalValid: document.querySelector(".formModamValid"),
  formModalInvalid: document.querySelector(".formModamInvalid"),
  headerLink: document.querySelectorAll(".header-responsive-link"),
};

// Menu functions
const toggleMenu = (show) => {
  elements.hamburgerMenu.classList.toggle("show", show);
};

elements.headerLink.forEach((item) => {
  item.addEventListener("click", () => {
    toggleMenu(false);
  });
});

// Event listeners for menu
elements.hamburgerBtn.addEventListener("click", () => toggleMenu(true));
elements.hamburgerClose.addEventListener("click", () => toggleMenu(false));
elements.hamburgerMenu.addEventListener("click", (e) => {
  if (e.target.classList.contains("header-responsive-link")) {
    toggleMenu(false);
  }
});

// Modal functions
const toggleModal = (show, message = "", isValid = true) => {
  elements.bgCloseModal.style.display = show ? "flex" : "none";
  elements.formModal.classList.toggle("active", show);
  if (show) {
    elements.formModalText.textContent = message;
    elements.formModalValid.style.display = isValid ? "block" : "none";
    elements.formModalInvalid.style.display = isValid ? "none" : "block";
  }
};

// Event listeners for modal
elements.formModal.addEventListener("click", () => toggleModal(false));
elements.bgCloseModal.addEventListener("click", () => toggleModal(false));

// Slider initialization
document.addEventListener("DOMContentLoaded", () => {
  new Swiper(".swiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 700,
    navigation: {
      nextEl: ".swiper-button-next1",
      prevEl: ".swiper-button-prev1",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000,
    },
  });
});

// Form validation
const validateForm = (
  formName,
  nameId,
  phoneId,
  nameErrorId,
  phoneErrorId,
  companyId,
  companyErrorId
) => {
  const form = document.forms[formName];
  const inputs = {
    name: document.getElementById(nameId),
    phone: document.getElementById(phoneId),
    company: document.getElementById(companyId),
  };
  const errors = {
    name: document.getElementById(nameErrorId),
    phone: document.getElementById(phoneErrorId),
    company: document.getElementById(companyErrorId),
  };
  inputs.phone.addEventListener("input", (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.startsWith("998")) {
      input = input.slice(3);
    }
    let formatted = "+998 ";
    if (input.length > 0) formatted += input.substring(0, 2) + " ";
    if (input.length > 2) formatted += input.substring(2, 5) + " ";
    if (input.length > 5) formatted += input.substring(5, 7) + " ";
    if (input.length > 7) formatted += input.substring(7, 9);

    e.target.value = formatted.trim();
  });

  inputs.phone.addEventListener("input", (e) => {
    const cursorPosition = e.target.selectionStart;
    e.target.setSelectionRange(cursorPosition, cursorPosition); // Maintain cursor position
  });

  const validateInputs = () => {
    let isValid = true;
    const nameValue = inputs.name.value.trim();
    const phoneValue = inputs.phone.value.trim();
    const companyValue = inputs.company.value.trim();

    const validations = [
      {
        input: inputs.name,
        error: errors.name,
        condition: !/^[A-Za-z\s]+$/.test(nameValue),
        message: "Ismni togri kiriting",
      },
      {
        input: inputs.phone,
        error: errors.phone,
        condition: !/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/.test(phoneValue),
        message: "Telefon raqamini to'g'ri kiriting: +998 XX XXX XX XX",
      },
      {
        input: inputs.company,
        error: errors.company,
        condition: companyValue === "",
        message: "Kompaniya nomi bo'sh bo'lmasligi kerak.",
      },
    ];

    validations.forEach(({ input, error, condition, message }) => {
      if (condition) {
        error.textContent = message;
        input.classList.add("invalidInput");
        isValid = false;
      } else {
        error.textContent = "";
        input.classList.remove("invalidInput");
      }
    });

    return isValid;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      elements.loader.style.display = "flex";
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzimi7yXqusuygOYk8bYkjAJhvJDrGSu9yOxi4SJsj57VqA-Q51GLqXaHJYZNO3qu0E/exec",
          {
            method: "POST",
            body: new FormData(form),
          }
        );
        if (response.ok) {
          toggleModal(true, "Thank you! Your data has been submitted");
          form.reset();
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        toggleModal(
          true,
          "An error occurred while submitting the data.",
          false
        );
      } finally {
        elements.loader.style.display = "none";
      }
    }
  });
};

validateForm(
  "contact-form-1",
  "name-1",
  "phone-1",
  "name-error-1",
  "phone-error-1",
  "company-1",
  "company-error1"
);