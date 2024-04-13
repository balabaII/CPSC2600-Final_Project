(() => {
  const getJSONData = async (url) => {
    try {
      const response = await fetch(url);
      const data = response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      let geolocation = ["latitude", "longitude"];
      navigator.geolocation.getCurrentPosition((position) => {
        let xy = [position.coords.latitude, position.coords.longitude];
        xy.forEach((coord, i) => {
          const loc = document.querySelector(`#${geolocation[i]}`);
          loc.textContent = Number(parseFloat(coord)).toFixed(2);
        });
      });
    } else {
      document.querySelector("#geolocation").innerHTML =
        "Geolocation is not supported by this browser.";
    }
  };

  const setCopyrightYear = () => {
    document.querySelector("#footer-year").textContent =
      new Date().getFullYear();
  };

  const showModal = () => {
    document.querySelector("body").style.overflowY = "hidden";
    document.querySelector("#modal").style.display = "block";
  };

  const closeModal = () => {
    document.querySelector("body").style.overflowY = "auto";
    document.querySelector("#modal").style.display = "none";
  };

  const handleCheckbox = (e) => {
    const button = document.querySelector("#modal button");
    if (e.target.checked) button.disabled = false;
    else button.disabled = true;
  };

  const setActiveSection = (e) => {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((item) => {
      if (item === e.target) item.classList.add("active");
      else item.classList.remove("active");
    });

    const attributePage = e.target.getAttribute("page-link");
    const title =
      attributePage[0].toUpperCase() +
      attributePage.slice(1, attributePage.length);

    document.querySelector("title").textContent = title;
    displayActiveSection(attributePage);
  };

  const displayActiveSection = (name) => {
    document.querySelectorAll("[page-section]").forEach((item) => {
      if (item.getAttribute("page-section") === name)
        item.classList.remove("d-none");
      else item.classList.add("d-none");
    });
  };

  window.addEventListener("load", (e) => {
    showModal();
    getGeoLocation();
    setCopyrightYear();
    document
      .querySelector("#modal button")
      .addEventListener("click", closeModal);
    document
      .querySelector("#modal-checkbox")
      .addEventListener("change", handleCheckbox);
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.addEventListener("click", setActiveSection);
    });
  });
})();
