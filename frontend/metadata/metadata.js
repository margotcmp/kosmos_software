const defaultMetaData = {
  video: {
    codeStation: "",
    heureDict: { heure: 0, minute: 0, second: 0 },
    gpsDict: { site: "", latitude: 0.0, longitude: 0.0 },
    ctdDict: { depth: 0.0, temperature: 0.0, salinity: "" },
    astroDict: { moon: "NL", tide: "BM", coefficient: 0 },
    meteoAirDict: { sky: "", wind: 0, direction: "N", atmPressure: 0.0, airTemp: 0.0 },
    meteoMerDict: { seaState: "", swell: 0 },
    analyseDict: { exploitability: "", habitat: "", fauna: "", visibility: "" },
  },
};

function loadMetaData() {
  let metaData;
  try {
    metaData = JSON.parse(localStorage.getItem("metaData"));
  } catch {
    alert("Error reading metaData from localStorage.");
    return defaultMetaData;
  }
  
  if (!metaData || !validateMetaData(metaData)) {
    alert("Invalid or missing metaData. Loading default values.");
    return defaultMetaData;
  }
  return metaData;
}

function validateMetaData(data) {
  return data && data.video && data.video.heureDict && data.video.gpsDict;
}

const sectionTitles = {
  codeStation: "Station Code",
  gpsDict: "GPS Coordinates",
  meteoAirDict: "Meteorological Air Information",
  meteoMerDict: "Meteorological Sea Information",
  analyseDict: "Exploitability Information",
  heureDict: "Hour",
  ctdDict: "CTD Information",
  astroDict: "Astronomical Information",
};

function initializeChoices(selectElement, choicesArray) {
  new Choices(selectElement, {
    searchEnabled: true,
    shouldSort: false,
    choices: choicesArray.map(choice => ({ value: choice.value, label: choice.label })),
  });
}

function generateTable() {
  const metaData = loadMetaData();
  const table = document.getElementById("metadataTable");

  Object.entries(metaData.video).forEach(([key, value]) => {
    const sectionTitle = sectionTitles[key] || key;

    const titleRow = document.createElement("tr");
    const titleCell = document.createElement("td");
    titleCell.colSpan = 2;
    titleCell.textContent = sectionTitle;
    titleCell.classList.add("section-title");

    titleCell.addEventListener("click", () => {
      sectionContent.classList.toggle("collapsed");
      titleCell.classList.toggle("collapsed");
    });

    titleRow.appendChild(titleCell);
    table.appendChild(titleRow);

    const sectionContent = document.createElement("tbody");
    sectionContent.classList.add("section-content");

    if (key === "codeStation") {
      createFormRow(sectionContent, key, "Station Code", value);
    } else if (key === "heureDict") {
      createTimeField(sectionContent, value);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        createFormRow(sectionContent, key, subKey, subValue);
      });
    } else {
      createFormRow(sectionContent, key, value);
    }

    table.appendChild(sectionContent);

    document.getElementById("formMetaData").addEventListener("submit", submitForm);
  });
}

function createTimeField(container, timeValues) {
  const row = document.createElement("tr");

  const labelCell = document.createElement("td");
  labelCell.textContent = sectionTitles.heureDict;
  row.appendChild(labelCell);

  const inputCell = document.createElement("td");
  const timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.step = 1;
  timeInput.value = formatTime(timeValues);
  timeInput.id = "timeInformation";
  inputCell.appendChild(timeInput);
  row.appendChild(inputCell);

  container.appendChild(row);
}

function createFormRow(container, sectionKey, label, value) {
  const row = document.createElement("tr");

  const labelCell = document.createElement("label");
  labelCell.setAttribute("for", label);
  const tdCell = document.createElement("td");
  labelCell.textContent = sectionTitles[label] || label.charAt(0).toUpperCase() + label.slice(1);
  tdCell.appendChild(labelCell);
  row.appendChild(tdCell);

  const inputCell = document.createElement("td");
  let inputElement;

  if (label === "direction" || label === "tide" || label === "moon") {
    inputElement = document.createElement("select");
    inputElement.setAttribute("id", label);
    initializeChoices(inputElement, getChoicesForField(label));
    inputElement.value = value;
  } else {
    inputElement = document.createElement("input");
    inputElement.setAttribute("id", label);
    inputElement.type = determineInputType(value);
    inputElement.value = value;
  }

  inputElement.classList.add("form-input");
  inputCell.appendChild(inputElement);
  row.appendChild(inputCell);

  container.appendChild(row);
}

function getChoicesForField(field) {
  const choicesData = {
    direction: [
      { value: "N", label: "N" },
      { value: "NE", label: "NE" },
      { value: "NO", label: "NO" },
      { value: "S", label: "S" },
      { value: "SE", label: "SE" },
      { value: "SO", label: "SO" },
      { value: "E", label: "E" },
      { value: "O", label: "O" },
    ],
    tide: [
      { value: "BM", label: "BM (Low Tide)" },
      { value: "BM+1", label: "BM+1" },
      { value: "BM-1", label: "BM-1" },
      { value: "PM", label: "PM (High Tide)" },
      { value: "PM+1", label: "PM+1" },
      { value: "PM-1", label: "PM-1" },
    ],
    moon: [
      { value: "NL", label: "NL : Nouvelle Lune (New Moon)" },
      { value: "PC", label: "PC : Premier Croissant (Waxing Crescent)" },
      { value: "PQ", label: "PQ : Premier Quartier (First Quarter)" },
      { value: "GL", label: "GL : Gibbeuse Croissante (Waxing Gibbous)" },
      { value: "PL", label: "PL : Pleine Lune (Full Moon)" },
      { value: "GD", label: "GD : Gibbeuse Décroissante (Waning Gibbous)" },
      { value: "DQ", label: "DQ : Dernier Quartier (Last Quarter)" },
      { value: "DC", label: "DC : Dernier Croissant (Waning Crescent)" },
    ],
  };
  return choicesData[field] || [];
}

function determineInputType(value) {
  return typeof value === "number" ? "number" : "text";
}

function formatTime(timeDict) {
  const { heure, minute, second } = timeDict;
  return `${String(heure).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

async function submitForm(event) {
  event.preventDefault();

  const response = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });

  if (response.ok) {
    alert("Data sent successfully!");
  } else {
    alert("Error sending data.");
  }
}

document.addEventListener("DOMContentLoaded", generateTable);
