document.addEventListener("DOMContentLoaded", function () {
  const metaData = {
    video: {
      codeStation: "K5_BR240024",
      heureDict: {
        heure: 11,
        minute: 26,
        seconde: 37,
      },
      gps: {
        site: "Brentec'h",
        latitude: 47.85762,
        longitude: -3.97411,
      },
      ctd: {
        profondeur: 9.5,
        temperature: 15.9,
        salinite: "",
      },
      astro: {
        lune: "PQ",
        maree: "BM+1",
        coefficient: 74,
      },
      meteoAir: {
        ciel: "soleil",
        vent: 2,
        direction: "NE",
        atmPress: 1013.0,
        tempAir: 15.6,
      },
      meteoMer: {
        etatMer: "belle",
        houle: 1,
      },
      analyse: {
        exploitabilite: "",
        habitat: "laminaires, sable",
        faune: "Mullidae, Gobidae",
        visibilite: "",
      },
    },
  };

  function generateForm(data, containerId) {
    const container = document.getElementById(containerId);

    for (const section in data) {
      const sectionData = data[section];

      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = section;
      container.appendChild(sectionTitle);

      for (const key in sectionData) {
        if (typeof sectionData[key] === "object") {
          generateForm(sectionData[key], containerId);
        } else {
          const label = document.createElement("label");
          label.setAttribute("for", key);
          label.textContent = key;
          container.appendChild(label);

          const input = document.createElement("input");
          input.setAttribute("type", "text");
          input.setAttribute("id", key);
          input.setAttribute("name", key);
          input.value = sectionData[key];
          container.appendChild(input);

          container.appendChild(document.createElement("br"));
        }
      }
    }
  }

  generateForm(metaData.video, "formContainer");

  const form = document.getElementById("formMetaData");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});
