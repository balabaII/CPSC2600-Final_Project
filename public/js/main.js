(() => {
  const __WeatherApiKey = "a0fdc33c5898c3986e99ca66e2ba2f36";
  const deleteButton = document.querySelectorAll(".deleteProduct");
  const geoLocation = document.querySelector("#geoLocation");
  let globalLat, globalLon;

  const getJSONData = async (url) => {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const getCity = async (lat, lon) => {
    const data = await getJSONData(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${globalLat}&lon=${globalLon}&appid=${__WeatherApiKey}`
    );

    geoLocation.innerHTML = `Timezone: ${data.timezone}`;
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        globalLat = Math.round(position.coords.latitude * 10) / 10;
        globalLon = Math.round(position.coords.longitude * 10) / 10;
        console.log(globalLat, globalLon);
        getCity();
      });
    } else {
      geoLocation.innerHTML = "Geolocation is not supported by this browser.";
    }
  };

  const deleteProduct = (event) => {
    const parentDiv = event.target.parentNode,
      productId = parentDiv.querySelector("[name=productId]").value;

    fetch(`/admin/products/${productId}`, {
      method: "DELETE",
    }).then(() => {
      event.target.closest(".row").remove();
    });
  };

  function showPosition(position) {
    x.innerHTML =
      "Latitude: " +
      position.coords.latitude +
      "<br>Longitude: " +
      position.coords.longitude;
  }

  deleteButton.forEach((button) => {
    button.addEventListener("click", deleteProduct);
  });
  document.addEventListener("DOMContentLoaded", getLocation);
})();
