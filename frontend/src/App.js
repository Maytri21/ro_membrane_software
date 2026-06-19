import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Login from "./login";
import membranes from "./membrane";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend
} from "recharts";

const calcMeq = (mg, eqWt) => {
  return mg ? Number(mg) / eqWt : 0;
};

const calcCaCO3 = (mg, eqWt) => {
  return mg ? (Number(mg) * 50) / eqWt : 0;
};


  const ionFactors = {
  ammonium: 18.04,
  sodium: 23,
  potassium: 39.1,
  calcium: 20.04,
  magnesium: 12.15,
  strontium: 43.8,
  barium: 68.7,
  chloride: 35.45,
  fluoride: 19,
  nitrate: 62,
  carbonate: 30,
  bicarbonate: 61,
  sulfate: 48.03,
  silica: 60.08,
  boron: 10.81
};

const ionicContribution = (
  concentration,
  eqWeight,
  charge
) =>
  calcMeq(concentration, eqWeight) *
  charge *
  charge;

const IonRow = ({
  label,
  value,
  setter,
  factor
}) => (

<tr>

<td style={styles.label}>
  {label}
</td>

<td style={styles.cell}>
  <input
    value={value}
    onChange={(e) => setter(e.target.value)}
    style={styles.input}
  />
</td>

<td style={styles.resultCell}>
  {calcCaCO3(value, factor).toFixed(3)}
</td>

<td style={styles.resultCell}>
  {calcMeq(value, factor).toFixed(3)}
</td>

<td style={styles.resultCell}>
  {Number(value || 0).toFixed(2)}
</td>

</tr>




);

function App() {

  // NAVIGATION

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  // PROJECT INFO

  const [projectName, setProjectName] =
    useState("");

  const [companyName, setCompanyName] =
    useState("");

  const [engineerName, setEngineerName] =
    useState("");

  const [notes, setNotes] =
    useState("");

  // FEED DATA

  const [recovery, setRecovery] =
    useState("");

  const [membraneSize, setMembraneSize] =
    useState("");

  const [temperature, setTemperature] =
    useState("");

  const [feedFlow, setFeedFlow] =
    useState("");

  const [feedTDS, setFeedTDS] =
    useState("");

  const [waterType, setWaterType] =
    useState("");

  const [pH, setPH] = useState("");

  const [calcium, setCalcium] = useState("");

  const [magnesium, setMagnesium] = useState("");

  const [sodium, setSodium] = useState("");

  const [potassium, setPotassium] = useState("");

  const [chloride, setChloride] = useState("");

  const [sulfate, setSulfate] = useState("");

  const [bicarbonate, setBicarbonate] = useState("");

  const [silica, setSilica] = useState("");

  const [ammonium, setAmmonium] = useState("");

  const [strontium, setStrontium] = useState("");

  const [barium, setBarium] = useState("");

  const [carbonate, setCarbonate] = useState("");

  const [nitrate, setNitrate] = useState("");

  const [fluoride, setFluoride] = useState("");

  const [boron, setBoron] = useState("");

  const [lsi, setLsi] = useState(0);

  const [sdsi, setSdsi] = useState(0);

  const [caSo4Sat, setCaSo4Sat] = useState(0);

  const [baSo4Sat, setBaSo4Sat] = useState(0);

  const [srSo4Sat, setSrSo4Sat] = useState(0);

  const [silicaSat, setSilicaSat] = useState(0);

  // RESULTS

  const [result, setResult] =
    useState(null);
  
  const [savedProjects, setSavedProjects] =
  useState([]);

  const [selectedMembrane,
    setSelectedMembrane] =
    useState("");

const membraneData =
  membranes.find(

    (m) =>
      m.name === selectedMembrane

  ); 

  // STATUS

  const [simulationStatus, setSimulationStatus] =
    useState("Not Started");

  const [loading, setLoading] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
  useState(
    localStorage.getItem("isLoggedIn")
      === "true"
  );

  const [stages, setStages] = useState(1);

const [pressureVessels, setPressureVessels] =
  useState(1);

const [elementsPerVessel, setElementsPerVessel] =
  useState(1);

const [pumpEfficiency, setPumpEfficiency] =
  useState(80);

const [systemFeedPressure, setSystemFeedPressure] =
  useState(10);



const totalCations =

  calcMeq(ammonium, ionFactors.ammonium) +
  calcMeq(sodium, ionFactors.sodium) +
  calcMeq(potassium, ionFactors.potassium) +
  calcMeq(calcium, ionFactors.calcium) +
  calcMeq(magnesium, ionFactors.magnesium) +
  calcMeq(strontium, ionFactors.strontium) +
  calcMeq(barium, ionFactors.barium);

const totalAnions =

  calcMeq(chloride, ionFactors.chloride) +
  calcMeq(fluoride, ionFactors.fluoride) +
  calcMeq(nitrate, ionFactors.nitrate) +
  calcMeq(carbonate, ionFactors.carbonate) +
  calcMeq(bicarbonate, ionFactors.bicarbonate) +
  calcMeq(sulfate, ionFactors.sulfate) +
  calcMeq(boron, ionFactors.boron);

const chargeBalance =

totalCations + totalAnions === 0

? 0

: (
Math.abs(totalCations - totalAnions) /
(totalCations + totalAnions)
) * 100;

const totalTDS =

Number(ammonium || 0) +
Number(sodium || 0) +
Number(potassium || 0) +
Number(calcium || 0) +
Number(magnesium || 0) +
Number(strontium || 0) +
Number(barium || 0) +
Number(chloride || 0) +
Number(fluoride || 0) +
Number(nitrate || 0) +
Number(carbonate || 0) +
Number(bicarbonate || 0) +
Number(sulfate || 0) +
Number(silica || 0) +
Number(boron || 0);

const addChloride = () => {

  const difference =
    totalCations - totalAnions;

  if (difference <= 0) {
    alert(
      "Anions are already greater than or equal to cations."
    );
    return;
  }

  const chlorideNeeded =
    difference *
    ionFactors.chloride;

  setChloride(
    (
      Number(chloride || 0) +
      chlorideNeeded
    ).toFixed(2)
  );

};

const addSulfate = () => {

  const difference =
    totalCations - totalAnions;

  if (difference <= 0) {
    alert(
      "Anions are already greater than or equal to cations."
    );
    return;
  }

  const sulfateNeeded =
    difference *
    ionFactors.sulfate;

  setSulfate(
    (
      Number(sulfate || 0) +
      sulfateNeeded
    ).toFixed(2)
  );

};

const adjustCations = () => {

  const difference =
    totalAnions - totalCations;

  if (difference <= 0) {
    alert(
      "Cations are already greater than or equal to anions."
    );
    return;
  }

  const sodiumNeeded =
    difference *
    ionFactors.sodium;

  setSodium(
    (
      Number(sodium || 0) +
      sodiumNeeded
    ).toFixed(2)
  );

};

const adjustAnions = () => {

  const difference =
    totalCations - totalAnions;

  if (difference <= 0) {
    alert(
      "Anions are already greater than or equal to cations."
    );
    return;
  }

  const chlorideNeeded =
    difference *
    ionFactors.chloride;

  setChloride(
    (
      Number(chloride || 0) +
      chlorideNeeded
    ).toFixed(2)
  );

};

const adjustAllIons = () => {

  if (
    totalCations === 0 ||
    totalAnions === 0
  ) {
    alert(
      "Please enter ion values first."
    );
    return;
  }

  const ratio =
    totalCations / totalAnions;

  if (ratio > 1) {

    setChloride(
      (
        Number(chloride || 0) *
        ratio
      ).toFixed(2)
    );

    setSulfate(
      (
        Number(sulfate || 0) *
        ratio
      ).toFixed(2)
    );

  } else {

    setSodium(
      (
        Number(sodium || 0) /
        ratio
      ).toFixed(2)
    );

    setCalcium(
      (
        Number(calcium || 0) /
        ratio
      ).toFixed(2)
    );

  }

};

// Total Hardness (as CaCO3)

const totalHardness =
(
  Number(calcium || 0) * 2.497 +
  Number(magnesium || 0) * 4.118
).toFixed(2);


// Total Alkalinity (as CaCO3)

const totalAlkalinity =
(
  Number(bicarbonate || 0) * 0.82 +
  Number(carbonate || 0) * 1.67
).toFixed(2);


// TDS Difference

const tdsDifference =
Math.abs(
  Number(feedTDS || 0) -
  Number(totalTDS || 0)
).toFixed(2);


// TDS Quality Check

const tdsStatus =
tdsDifference <= 50
? "Excellent"
: tdsDifference <= 100
? "Acceptable"
: "Review Water Analysis";


// Ionic Strength

const ionicStrength =
(
  0.5 *
  (
    ionicContribution(ammonium, ionFactors.ammonium, 1) +
    ionicContribution(sodium, ionFactors.sodium, 1) +
    ionicContribution(potassium, ionFactors.potassium, 1) +
    ionicContribution(calcium, ionFactors.calcium, 2) +
    ionicContribution(magnesium, ionFactors.magnesium, 2) +
    ionicContribution(strontium, ionFactors.strontium, 2) +
    ionicContribution(barium, ionFactors.barium, 2) +
    ionicContribution(chloride, ionFactors.chloride, 1) +
    ionicContribution(fluoride, ionFactors.fluoride, 1) +
    ionicContribution(nitrate, ionFactors.nitrate, 1) +
    ionicContribution(carbonate, ionFactors.carbonate, 2) +
    ionicContribution(bicarbonate, ionFactors.bicarbonate, 1) +
    ionicContribution(sulfate, ionFactors.sulfate, 2)
  )
).toFixed(3);

const concentrationFactor =
1 / (1 - Number(recovery || 0) / 100);

const concentrateCalcium =
Number(calcium || 0) *
concentrationFactor;

const concentrateMagnesium =
Number(magnesium || 0) *
concentrationFactor;

const concentrateBicarbonate =
Number(bicarbonate || 0) *
concentrationFactor;

const concentrateSulfate =
Number(sulfate || 0) *
concentrationFactor;

const concentrateSilica =
Number(silica || 0) *
concentrationFactor;

const concentrateBarium =
Number(barium || 0) *
concentrationFactor;

const concentrateStrontium =
Number(strontium || 0) *
concentrationFactor;

const tds = Number(totalTDS || 1);
const temp = Number(temperature || 25);
const caHardness = Number(totalHardness || 0);
const alkalinity = Number(totalAlkalinity || 1);

const A =
  (Math.log10(tds) - 1) / 10;

const B =
  -13.12 *
  Math.log10(temp + 273) +
  34.55;

const C =
  Math.log10(
    Math.max(caHardness, 1)
  ) - 0.4;

const D =
  Math.log10(
    Math.max(alkalinity, 1)
  );

const pHs =
  (9.3 + A + B) -
  (C + D);

const lsiRaw =
  (Number(pH || 7) - pHs);

  const seawaterCorrection =
  waterType === "Sea Water"
    ? 5
    : waterType === "Brackish Water"
    ? 2
    : 0;

const lsiValue =
(
  lsiRaw - seawaterCorrection
).toFixed(2);

const lsiAssessment =
  lsiValue < -1
    ? "No Scaling Risk"
    : lsiValue < 0
    ? "Low Scaling Risk"
    : lsiValue < 1
    ? "Moderate Scaling Risk"
    : "High Scaling Risk";

const sdsiValue =
(
  Number(lsiValue) - 1.2
).toFixed(2);

const caSo4SatValue =
(
  (concentrateCalcium * concentrateSulfate) /
  120000
).toFixed(1);

const baSo4SatValue =
(
  (concentrateBarium * concentrateSulfate) /
  100
).toFixed(1);

const srSo4SatValue =
(
  (concentrateStrontium * concentrateSulfate) /
  250
).toFixed(1);

const silicaLimit = 150;

const silicaSatValue =
(
  (concentrateSilica /
    silicaLimit) *
  100
).toFixed(1);

const permeateFlow =
  Number(feedFlow || 0) *
  (Number(recovery || 0) / 100);

const concentrateFlow =
  Number(feedFlow || 0) -
  permeateFlow;

const membraneInfo =
  membranes.find(
    m => m.name === selectedMembrane
  );

const saltRejection =
  Number(result?.salt_rejection || 0);

const permeateTDS =
  Number(result?.product_tds || 0);

const concentrateTDS =
  Number(feedTDS || 0) *
  (
    Number(feedFlow || 0) /
    Math.max(concentrateFlow, 1)
  );

const totalElements =
  Number(pressureVessels || 0) *
  Number(elementsPerVessel || 0);

const membraneAreaMap = {
  "2.5 x 14": 6,
  "2.5 x 21": 12,
  "2.5 x 40": 28,

  "4 x 40": 80,

  "8 x 40": 400,
  "8 x 80": 440,

  "14 x 40": 700,
  "14 x 80": 1400
};

const membraneArea =
  totalElements *
  Number(membraneData?.area || 0);

const membraneAreaM2 =
  membraneArea * 0.092903;

const flux = Number(result?.flux || 0);

let designStatus = "";

if (flux > 45) {
  designStatus =
    "Increase membrane area or number of elements";
}
else if (flux < 10) {
  designStatus =
    "Membrane area oversized";
}
else {
  designStatus =
    "Design within recommended limits";
}

const osmoticPressure =
(
  Number(feedTDS || 0) * 0.00074
).toFixed(2);

let basePressure = 55;

if (waterType === "Brackish Water") {
  basePressure = 12;
}
else if (waterType === "Low Pressure") {
  basePressure = 8;
}
else if (waterType === "Ultra Low Pressure") {
  basePressure = 6;
}
else if (waterType === "Nanofiltration") {
  basePressure = 7;
}

const recoveryCorrection =
Number(recovery || 0) * 0.08;

const tdsCorrection =
Number(concentrateTDS || 0) * 0.0005;

const feedPressure =
  Number(result?.feed_pressure || 0);

let recoveryStatus = "";

if (recovery < 40) {
  recoveryStatus = "Low Recovery";
}
else if (recovery <= 75) {
  recoveryStatus = "Normal Recovery";
}
else if (recovery <= 85) {
  recoveryStatus = "High Recovery";
}
else {
  recoveryStatus = "Scaling Risk";
}

let pressureStatus = "";

if (feedPressure < 15) {
  pressureStatus = "Low Pressure";
}
else if (feedPressure < 40) {
  pressureStatus = "BWRO Range";
}
else {
  pressureStatus = "SWRO Range";
}

let permeateStatus = "";

if (permeateTDS < 50) {
  permeateStatus = "Excellent Quality";
}
else if (permeateTDS < 500) {
  permeateStatus = "Good Quality";
}
else {
  permeateStatus = "Needs Improvement";
}

let rejectionStatus = "";

if (saltRejection > 99.5) {
  rejectionStatus = "Excellent";
}
else if (saltRejection > 98) {
  rejectionStatus = "Good";
}
else if (saltRejection > 95) {
  rejectionStatus = "Acceptable";
}
else {
  rejectionStatus = "Poor";
}

let osmoticStatus = "";

if (osmoticPressure < 5) {
  osmoticStatus = "Low Osmotic Load";
}
else if (osmoticPressure < 25) {
  osmoticStatus = "Moderate Osmotic Load";
}
else {
  osmoticStatus = "High Osmotic Load";
}

let scalingRisk = "LOW";

if (
  Number(lsiValue) > 1.5 ||
  Number(caSo4SatValue) > 90 ||
  Number(baSo4SatValue) > 90 ||
  Number(srSo4SatValue) > 90 ||
  Number(silicaSatValue) > 90
) {
  scalingRisk = "HIGH";
}
else if (
  Number(lsiValue) > 0.5 ||
  Number(caSo4SatValue) > 70 ||
  Number(baSo4SatValue) > 70 ||
  Number(srSo4SatValue) > 70 ||
  Number(silicaSatValue) > 70
) {
  scalingRisk = "MEDIUM";
}
else {
  scalingRisk = "LOW";
}

let foulingRisk = "LOW";

if (
  Number(feedTDS) > 35000 ||
  Number(recovery) > 80
) {
  foulingRisk = "HIGH";
}
else if (
  Number(feedTDS) > 10000 ||
  Number(recovery) > 65
) {
  foulingRisk = "MEDIUM";
}
else {
  foulingRisk = "LOW";
}

  const loadProjects = async () => {

  try {

    const username =
      localStorage.getItem("username");

    const response = await axios.get(

      `http://127.0.0.1:5000/projects/${username}`

    );

    console.log("Projects:", response.data);

    setSavedProjects(response.data);

  }

  catch (error) {

    console.log(error);

  }

};

  useEffect(() => {

  loadProjects();

}, []);

  // CHART DATA

  const lineData = [

    {
      name: "Feed",
      tds: feedTDS,
      pressure:
        result?.feed_pressure || 0
    },

    {
      name: "Product",
      tds:
        result?.product_tds || 0,
      pressure:
        (result?.feed_pressure || 0) - 5
    }

  ];

  const barData = [

    {
      name: "Flux",
      value: result?.flux || 0
    },

    {
      name: "Recovery",
      value: recovery
    },

    {
      name: "Salt Rejection",
      value:
        result?.salt_rejection || 0
    }

  ];

  const pieData = [

    {
      name: "Product Water",
      value:
        result?.product_flow_rate || 0
    },

    {
      name: "Reject Water",
      value:
        feedFlow -
        (result?.product_flow_rate || 0)
    }

  ];

  // RUN PROJECTION

const recommendMembrane = () => {
  console.log("Water Type:", waterType || "N/A");
  console.log("Feed TDS:", feedTDS);

   const type =
    waterType
      .toLowerCase()
      .trim();

  // LOW TDS FIRST

  if (
    Number(feedTDS) < 500
  ) {

    return "LP21-4040";

  }

  // SEA WATER

  // SEA WATER

if (type.includes("sea")) {

  if (membraneSize === "2.5 x 14") {
    return "SW30-2514";
  }

  if (membraneSize === "2.5 x 21") {
    return "SW30-2521";
  }

  if (membraneSize === "2.5 x 40") {
    return "SW30-2540";
  }

  if (membraneSize === "4 x 40") {
    return "SW30-4040";
  }

  if (membraneSize === "8 x 40") {
    return "SW30HRLE-400";
  }

  if (membraneSize === "8 x 80") {
    return "SW30HRLE-440";
  }

  if (membraneSize === "14 x 80") {
    return "SW30-1480";
  }

  return "SW30HRLE-400";
}

  // GROUND / BRACKISH

  if (

    type.includes("ground")

    ||

    type.includes("brackish")

  ) {

    return "BW30XFR-400";

  }

  // DEFAULT

  return "BW30XFR-400";

};

const calculateScalingRisk = () => {

  if (

    feedTDS > 35000 &&
    recovery > 60

  ) {

    return "HIGH";

  }

  if (

    feedTDS > 15000 &&
    recovery > 45

  ) {

    return "MEDIUM";

  }

  return "LOW";

};

const calculateMembraneHealth = () => {

  let health = 100;

  if (feedTDS > 35000) {

    health -= 20;

  }

  if (recovery > 70) {

    health -= 15;

  }

  if (temperature > 40) {

    health -= 10;

  }

  if (calculateScalingRisk() === "HIGH") {

    health -= 25;

  }

  return Math.max(
    health,
    10
  );

};
const getWarnings = () => {

  const warnings = [];

  if (feedTDS > 40000) {

    warnings.push(
      "Very High Feed TDS"
    );

  }

  if (recovery > 85) {

    warnings.push(
      "Recovery Too High"
    );

  }

  if (temperature > 45) {

    warnings.push(
      "High Temperature Risk"
    );

  }

  if (feedFlow < 100) {

    warnings.push(
      "Low Feed Flow"
    );

  }

  return warnings;

};

const calculateCost = () => {

  try {

    const flowM3Hr =
      Number(feedFlow || 0) / 1000;

    const pressure =

      result &&
      result.feed_pressure

        ? Number(result.feed_pressure)

        : 15;

    const pumpEfficiencyValue =
  Number(pumpEfficiency || 80) / 100;

    const powerKW =
(
  flowM3Hr *
  pressure
) /
(
  pumpEfficiencyValue * 36
);

    const electricityRate = 8; // ₹/kWh

    const membraneReplacementYears = 3;

    const maintenancePercent = 0.1; // 10%

    const operatingHoursPerDay = 20;

    const operatingHours = operatingHoursPerDay;

    const tariff = 8;

    const dailyEnergy =

      powerKW *
      operatingHours;

    const dailyPowerCost =

      dailyEnergy *
      tariff;

    let membraneCost = 18000;

    if (
      membraneData &&
      membraneData.size ===
      "8 Inch"
    ) {

      membraneCost = 45000;

    }

    else if (
      membraneData &&
      membraneData.size ===
      "14 Inch"
    ) {

      membraneCost = 120000;

    }

    const membraneLifeYears = 4;

      const yearlyPowerCost =
        powerKW *
        operatingHoursPerDay *
        365 *
        electricityRate;

      const yearlyMembraneCost =
        membraneCost /
        membraneReplacementYears;

      const yearlyMaintenanceCost =
        membraneCost *
        maintenancePercent;

      const yearlyCost =
        yearlyPowerCost +
        yearlyMembraneCost +
        yearlyMaintenanceCost;

      const yearlyProductionM3 =

      (
        (result?.product_flow_rate ||
        0) *
        20 *
        365
      ) / 1000;

      const costPerM3 =
        yearlyProductionM3 > 0
        ? yearlyCost / yearlyProductionM3
        : 0;

    return {

      powerKW:
        powerKW.toFixed(2),

      dailyEnergy:
        dailyEnergy.toFixed(2),

      dailyPowerCost:
        dailyPowerCost.toFixed(2),

      membraneCost:
        membraneCost.toFixed(2),

      maintenanceCost:
        yearlyMaintenanceCost.toFixed(2),

      yearlyCost:
        yearlyCost.toFixed(2),

      costPerM3:
        costPerM3.toFixed(2)

    };

  }

  catch (error) {

    console.error("Cost Error:", error);

    return {

      powerKW: 0,
      dailyEnergy: 0,
      dailyPowerCost: 0,
      membraneCost: 0,
      maintenanceCost: 0,
      yearlyCost: 0

    };

  }

};
  const runProjection = async () => {

    console.log({
    recovery,
    temperature,
    feedFlow,
    feedTDS,
    waterType,
    membraneSize,
    selectedMembrane
  });
if (!recovery) {
  alert("Recovery missing");
  return;
}

if (!temperature) {
  alert("Temperature missing");
  return;
}

if (!feedFlow) {
  alert("Feed Flow missing");
  return;
}

if (!feedTDS) {
  alert("Feed TDS missing");
  return;
}

if (!waterType) {
  alert("Water Type missing");
  return;
}

if (!membraneSize) {
  alert("Membrane Size missing");
  return;
}

try {

  setSimulationStatus("Running...");
  setLoading(true);

  const recommendedMembrane =
    recommendMembrane();

  setSelectedMembrane(
    recommendedMembrane
  );

  const membraneData = membranes.find(
  (m) =>
    m.name === recommendedMembrane
);

console.log(
  "Recommended Membrane:",
  recommendedMembrane
);

console.log(
  "Membrane Data:",
  membraneData
);
   
  if (!membraneData) {

  alert(
    "No membrane selected. Please select a membrane."
  );

  return;
}

const adjustedRecovery = Math.min(
  recovery,
  membraneData.recovery_limit
);

  const osmoticPressure =
    Number(feedTDS) * 0.00074;

  const recoveryFactor =
    1 + (Number(recovery) / 100);

  const calculatedPressure =
    osmoticPressure *
    recoveryFactor *
    1.8;

  const adjustedPressure =
    Math.max(
      calculatedPressure,
      8
    );

  if (!membraneData) {

    alert(
      "No membrane selected. Please select a membrane."
    );

    return;
  }

  const response = await axios.post(
    "http://127.0.0.1:5000/predict",
    {
      recovery: Number(adjustedRecovery),
      temperature: Number(temperature),
      feedFlow: Number(feedFlow),
      feedTDS: Number(feedTDS),
      waterType: waterType,
      membraneSize: membraneSize,
      selectedMembrane: recommendedMembrane,
      membraneData: {
        max_pressure: membraneData.max_pressure,
        salt_rejection: membraneData.salt_rejection,
        recovery_limit: membraneData.recovery_limit,
        type: membraneData.type,
        size: membraneData.size
        
      },
      pH: pH,
      calcium: calcium,
      magnesium: magnesium,
      sodium: sodium,
      potassium: potassium,
      chloride: chloride,
      sulfate: sulfate,
      bicarbonate: bicarbonate,
      silica: silica,
      adjustedPressure: adjustedPressure
    }
  );

      setResult(response.data);
 
      setLoading(false);

      setSimulationStatus(
        "Simulation Completed"
      );

      setActiveMenu("dashboard");

    } catch (error) {

      console.log(error);

if (error.response) {
  console.log("Backend Response:");
  console.log(error.response.data);
}

setLoading(false);

setSimulationStatus(
  "Simulation Failed"
);

alert("Backend Error");

    }
  };

  // SAVE PROJECT

  const saveProject = async () => {

  try {

    console.log({
    projectName,
    companyName,
    engineerName,
    notes,
    membraneSize,
    feedTDS,
    recovery,
    temperature,
    feedFlow,
    waterType,
    pH,
    calcium,
    magnesium,
    sodium,
    potassium,
    chloride,
    sulfate,
    bicarbonate,
    silica,
    result
});

    await axios.post(

      "http://127.0.0.1:5000/save_project",

      {

        username:
          localStorage.getItem("username"),

        project_name: projectName,

        company_name: companyName,

        engineer_name: engineerName,

        notes: notes,

        membrane_size: membraneSize,

        selected_membrane: selectedMembrane,

        membrane_area: result?.membrane_area,

        feed_tds: feedTDS,

        recovery: recovery,

        temperature: temperature,

        feed_flow: feedFlow,

        water_type: waterType,

        pH: pH,

        calcium: calcium,

        magnesium: magnesium,

        sodium: sodium,

        potassium: potassium,

        chloride: chloride,

        sulfate: sulfate,

        bicarbonate: bicarbonate,

        silica: silica,

        ammonium: ammonium,
        
        strontium: strontium,

        barium: barium,

        carbonate: carbonate,

        nitrate: nitrate,

        fluoride: fluoride,

        boron: boron,

        stages: stages,

        pressure_vessels: pressureVessels,

        elements_per_vessel: elementsPerVessel,

        pump_efficiency: pumpEfficiency,

        system_feed_pressure: systemFeedPressure,

        result: result

      }

    );

    alert(
      "Project Saved Successfully"
    );

  }

  catch (error) {

    alert(
      "Failed To Save Project"
    );

    console.log(error);

  }

};
  // EXPORT PDF

const exportReport = () => {

  const doc = new jsPDF();

  const costData = calculateCost();

  // HEADER
doc.setFillColor(40, 40, 40);

doc.rect(
  0,
  0,
  doc.internal.pageSize.getWidth(),
  30,
  "F"
);

doc.setFontSize(22);
doc.setFont("helvetica", "bold");
doc.setTextColor(255, 255, 255);

doc.text(
  "RO MEMBRANE PROJECTION REPORT",
  doc.internal.pageSize.getWidth() / 2,
  20,
  { align: "center" }
);

// Reset for rest of report
doc.setTextColor(0, 0, 0);

  // PROJECT INFO

  autoTable(doc, {

    startY: 40,

    head: [["Project Information", ""]],

   body: [
  ["Project Name", projectName || "N/A"],
  ["Company", companyName || "N/A"],
  ["Engineer", engineerName || "N/A"]
],

    theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}

  });

  // Executive Summary

 autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Executive Summary"]],

  body: [[
    `This report presents the design and performance projection of a reverse osmosis system treating ${waterType} with a feed TDS of ${feedTDS} ppm. The selected membrane configuration is expected to achieve a recovery of ${recovery}% with a permeate TDS of ${Number(result?.product_tds || 0).toFixed(1)} ppm and a salt rejection of ${Number(result?.salt_rejection || 0).toFixed(2)}%.`
  ]],

  theme: "grid",

  headStyles: {
    fillColor: [40, 40, 40],
    textColor: [255, 255, 255],
    fontStyle: "bold"
  },

  bodyStyles: {
    textColor: [0, 0, 0]
  }
});

  // FEED WATER DATA

  autoTable(doc, {

    startY:
      doc.lastAutoTable.finalY + 8,

    head: [["Feed Water Data", ""]],

    body: [

      ["Water Type", waterType],

      ["Feed TDS", `${feedTDS} ppm`],

      ["Recovery", `${recovery}%`],

      ["Temperature", `${temperature} °C`],

      ["Feed Flow", `${feedFlow} LPH`],

      ["Membrane", membraneDisplayName],

      ["Membrane Size", membraneSize]

    ],

    theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}

  });

  // WATER CHEMISTRY

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Water Chemistry", "Value"]],

  body: [
    ["pH", pH || "N/A"],
    ["Calcium", calcium || "N/A"],
    ["Magnesium", magnesium || "N/A"],
    ["Sodium", sodium || "N/A"],
    ["Potassium", potassium || "N/A"],
    ["Chloride", chloride || "N/A"],
    ["Sulfate", sulfate || "N/A"],
    ["Bicarbonate", bicarbonate || "N/A"],
    ["Silica", silica || "N/A"],
    ["Ammonium", ammonium || "N/A"],
    ["Strontium", strontium || "N/A"],
    ["Barium", barium || "N/A"],
    ["Carbonate", carbonate || "N/A"],
    ["Nitrate", nitrate || "N/A"],
    ["Fluoride", fluoride || "N/A"],
    ["Boron", boron || "N/A"]
  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}
});

// SCALING ANALYSIS

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Scaling Parameter", "Value"]],

  body: [
    ["LSI", lsiValue],
    ["S&DSI", sdsiValue],
    ["Silica Saturation", `${silicaSatValue}%`],
    ["CaSO4 Saturation", `${caSo4SatValue}%`],
    ["BaSO4 Saturation", `${baSo4SatValue}%`],
    ["SrSO4 Saturation", `${srSo4SatValue}%`],
  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}
});

// SCALING ASSESSMENT

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Assessment", "Status"]],

  body: [
    [
      "Carbonate Scaling",
      Number(lsiValue) > 1
        ? "High"
        : Number(lsiValue) > 0
        ? "Moderate"
        : "Low"
    ],

    [
      "Silica Scaling",
      Number(silicaSatValue) > 100
        ? "High"
        : Number(silicaSatValue) > 80
        ? "Moderate"
        : "Low"
    ],

    [
      "Sulfate Scaling",
      Number(caSo4SatValue) > 100
        ? "High"
        : Number(caSo4SatValue) > 80
        ? "Moderate"
        : "Low"
    ],

    [
      "Overall Scaling Risk",
      lsiAssessment
    ]
  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}
});

// SYSTEM CONFIGURATION

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["System Configuration", "Value"]],

  body: [
    ["Stages", stages],
    ["Pressure Vessels", pressureVessels],
    ["Elements Per Vessel", elementsPerVessel],
    ["Pump Efficiency", `${pumpEfficiency}%`],
    ["Feed Pressure", `${systemFeedPressure} bar`]
  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}
});

// MEMBRANE SPECIFICATION

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Membrane Specification", "Value"]],

  body: [
    ["Model", membraneDisplayName],
    ["Application", membraneData?.application],
    ["Element Size", membraneData?.size],
    ["Maximum Pressure", `${membraneData?.max_pressure} bar`],
    ["Salt Rejection", `${Number(result?.salt_rejection || 0).toFixed(2)}%`]
  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}
});

 
  // RESULTS TABLE

  autoTable(doc, {

    startY:
    doc.lastAutoTable.finalY + 15,

    head: [["Result", "Value"]],

    body: [

      [
        "Selected Membrane",
        membraneDisplayName
      ],

      [
        "Membrane Area",
        `${membraneAreaM2.toFixed(2)} m²`
      ],

      [
        "Product Flow",
        `${result?.product_flow_rate} LPH`
      ],

      [
        "Feed Pressure",
        `${result?.feed_pressure} bar`
      ],

      [
        "Product TDS",
        `${result?.product_tds} ppm`
      ],

      [
        "Flux",
        `${result?.flux} LMH`
      ],

      [
        "Salt Rejection",
        `${Number(result?.salt_rejection || 0).toFixed(2)}%`
      ]

    ],

    theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}

  });

 // COST ESTIMATION TABLE

autoTable(doc, {

  startY:
    doc.lastAutoTable.finalY + 10,

  head: [["Cost Estimation", "Value"]],

  body: [

    [
      "Daily Power Cost",
      `Rs ${costData.dailyPowerCost}`
    ],

    [
      "Membrane Cost",
      `Rs ${costData.membraneCost}`
    ],

    [
      "Maintenance Cost",
      `Rs ${costData.maintenanceCost}`
    ],

    [
      "Cost per m³",
      `Rs ${costData.costPerM3}`
    ],

    [
      "Estimated Yearly Cost",
      `Rs ${costData.yearlyCost}`
    ]

  ],

  theme: "grid",

headStyles: {
  fillColor: [40, 40, 40],
  textColor: [255, 255, 255],
  fontStyle: "bold"
},

bodyStyles: {
  textColor: [0, 0, 0]
},

alternateRowStyles: {
  fillColor: [245, 245, 245]
}

});

  doc.save(
    "RO_Membrane_Report.pdf"
  );

};


  if (!isLoggedIn) {

  const loadProjects = async () => {

  try {

    const username =
      localStorage.getItem("username");

    const response = await axios.get(

      `http://127.0.0.1:5000/projects/${username}`

    );

    setSavedProjects(response.data);

  }

  catch (error) {

    console.log(error);

  }

};

  return (
    <Login
      onLogin={() =>
        setIsLoggedIn(true)
      }
    />
  );

}

const deleteProject = async (id) => {

  try {

    await axios.delete(
      `http://127.0.0.1:5000/project/${id}`
    );

    alert("Project Deleted");

    loadProjects();

  } catch (error) {

    console.log(error);

    alert("Failed To Delete Project");

  }
};

const recommendation =
  waterType === "Sea Water"
    ? "SWRO membrane selected. Energy recovery device recommended."
    : waterType === "Brackish Water"
    ? "BWRO design suitable. Antiscalant dosing recommended."
    : "Low pressure RO system suitable.";

const membraneNameMap = {
  "2.5 x 14": "SW30-2514",
  "2.5 x 21": "SW30-2521",
  "2.5 x 40": "SW30-2540",
  "4 x 40": "SW30-4040",
  "8 x 40": "SW30HRLE-400",
  "8 x 80": "SW30HRLE-440",
  "14 x 40": "SW30-1440",
  "14 x 80": "SW30-1480"
};

const membraneDisplayName =
  membraneNameMap[membraneSize] || selectedMembrane;


  return (

    <div style={styles.app}>

      {/* SIDEBAR */}

      <div style={styles.sidebar}>

        <div style={styles.brandSection}>

          <div style={styles.brandTitle}>
            RO Projection
          </div>

          <div style={styles.brandSub}>
            Industrial RO Simulation Platform
          </div>

        </div>

        <button
          style={
            activeMenu === "dashboard"
              ? styles.activeButton
              : styles.menuButton
          }
          onClick={() =>
            setActiveMenu("dashboard")
          }
        >
          Dashboard
        </button>

        <button
          style={
            activeMenu === "project"
              ? styles.activeButton
              : styles.menuButton
          }
          onClick={() =>
            setActiveMenu("project")
          }
        >
          Project Information
        </button>

        <button
          style={
            activeMenu === "feed"
              ? styles.activeButton
              : styles.menuButton
          }
          onClick={() =>
            setActiveMenu("feed")
          }
        >
          Feed Water Data
        </button>

        <button
          style={
          activeMenu === "waterChemistry"
          ? styles.activeButton
          : styles.menuButton
        }
        onClick={() => {
          setActiveMenu("waterChemistry");
        }}
      >
        Water Chemistry
        </button>

        <button
          style={
          activeMenu === "ScalingInformation"
          ? styles.activeButton
          : styles.menuButton
        }
        onClick={() => {
          setActiveMenu("ScalingInformation");
        }}
      >
        Scaling Information
        </button>

        <button
        style={
          activeMenu === "systemConfiguration"
          ? styles.activeButton
          : styles.menuButton
        }
          onClick={() => setActiveMenu("systemConfiguration")}
        >
         System Configuration
        </button>

        <button
          style={
            activeMenu === "results"
              ? styles.activeButton
              : styles.menuButton
          }
          onClick={() =>
            setActiveMenu("results")
          }
        >
          Projection Results
          </button>
          <button
            style={
              activeMenu === "savedProjects"
              ? styles.activeButton
              : styles.menuButton
            }

            onClick={() =>
              setActiveMenu("savedProjects")
            }
          >

            Saved Projects

          </button>
          <button

  style={
    activeMenu === "membranes"
      ? styles.activeButton
      : styles.menuButton
  }

  onClick={() =>
    setActiveMenu("membranes")
  }

>

  Membrane Comparison

</button>   

      </div>

      {/* MAIN */}

      <div style={styles.workspace}>

        {/* TOPBAR */}

        <div style={styles.topbar}>

          <div>
            <strong>Project:</strong>
            {" "}
            {projectName || "Untitled"}
          </div>

          <div>
            <strong>Engineer:</strong>
            {" "}
            {engineerName || "Not Assigned"}
          </div>

          <div>

            <strong>Status:</strong>

            <span
              style={{
                marginLeft: "8px",
                fontWeight: "700",
                color:
                  simulationStatus ===
                  "Simulation Completed"
                    ? "#15803d"
                    : simulationStatus ===
                      "Running..."
                    ? "#ca8a04"
                    : simulationStatus ===
                      "Simulation Failed"
                    ? "#dc2626"
                    : "#64748b"
              }}
            >
              {simulationStatus}
            </span>

          </div>

        </div>

        {/* ACTION BAR */}

        <div style={styles.actionBar}>

          <button
            style={styles.secondaryBtn}
            onClick={() => {

              localStorage.removeItem(
                "isLoggedIn"
              );

              window.location.reload();

            }}
          >
            Logout
          </button>

          <button
            style={styles.primaryBtn}
            onClick={runProjection}
          >
            {
              loading
                ? "Running Simulation..."
                : "Run Projection"
            }
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={saveProject}
          >
            Save Project
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={exportReport}
          >
            Export PDF
          </button>

        </div>

        {/* DASHBOARD */}

        {
          activeMenu === "dashboard" && (

            <div>

              {/* KPI */}

              <div style={styles.kpiGrid}>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiLabel}>
                    Product Flow
                  </div>

                  <div style={styles.kpiValue}>
                    {result?.product_flow_rate || 0}
                  </div>

                  <div style={styles.kpiUnit}>
                    LPH
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiLabel}>
                    Feed Pressure
                  </div>

                  <div style={styles.kpiValue}>
                    {result?.feed_pressure || 0}
                  </div>

                  <div style={styles.kpiUnit}>
                    bar
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiLabel}>
                    Product TDS
                  </div>

                  <div style={styles.kpiValue}>
                    {result?.product_tds || 0}
                  </div>

                  <div style={styles.kpiUnit}>
                    ppm
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiLabel}>
                    Recovery
                  </div>

                  <div style={styles.kpiValue}>
                    {recovery}
                  </div>

                  <div style={styles.kpiUnit}>
                    %
                  </div>
                </div>

              </div>

              {/* OVERVIEW */}

              <div style={styles.dashboardGrid}>

                <div style={styles.panel}>

                  <div style={styles.panelTitle}>
                    System Overview
                  </div>

                  <table style={styles.table}>

                    <tbody>

<tr>
  <td style={styles.label}>Membrane</td>
  <td style={styles.cell}>
  {membraneDisplayName} | {membraneData?.application}
</td>
</tr>

<tr>
  <td style={styles.label}>Membrane Area</td>
  <td style={styles.cell}>
    {membraneAreaM2.toFixed(2)} m²
  </td>
</tr>

<tr>
  <td style={styles.label}>Element Size</td>
  <td style={styles.cell}>
    {membraneData?.size}
  </td>
</tr>

<tr>
  <td style={styles.label}>Application</td>
  <td style={styles.cell}>
    {membraneData?.application}
  </td>
</tr>

<tr>
  <td style={styles.label}>Max Pressure</td>
  <td style={styles.cell}>
    {membraneData?.max_pressure} bar
  </td>
</tr>

<tr>
  <td style={styles.label}>Water Type</td>
  <td style={styles.cell}>
    {waterType}
  </td>
</tr>

<tr>
  <td style={styles.label}>Salt Rejection</td>
  <td style={styles.cell}>
    {Number(result?.salt_rejection || 0).toFixed(2)} %
  </td>
</tr>

<tr>
  <td style={styles.label}>Recommendation</td>
  <td style={styles.cell}>
    {recommendation}
  </td>
</tr>

                    </tbody>

                  </table>

                </div>

                {/* HEALTH */}

                <div style={styles.panel}>

                  <div style={styles.panelTitle}>
                    System Health
                  </div>

                  <div style={styles.healthRow}>
  <span>Scaling Risk</span>

  <span
    style={{
      fontWeight: "bold",
      color:
        scalingRisk === "HIGH"
          ? "#dc2626"
          : scalingRisk === "MEDIUM"
          ? "#d97706"
          : "#16a34a"
    }}
  >
    {scalingRisk}
  </span>
</div>

                  <div style={styles.healthRow}>
  <span>Fouling Risk</span>

  <span
    style={{
      fontWeight: "bold",
      color:
        foulingRisk === "HIGH"
          ? "#dc2626"
          : foulingRisk === "MEDIUM"
          ? "#d97706"
          : "#16a34a"
    }}
  >
    {foulingRisk}
  </span>
</div>

                  <div style={styles.healthRow}>
                    <span>Simulation</span>

                    <span style={styles.good}>
                      {simulationStatus}
                    </span>
                  </div>

                </div>

              </div>

              <div
  style={{
    ...styles.panel,
    marginTop: "25px"
  }}
>
                <h3 style={{
  
  marginBottom: "20px"
}}>
  Design Status: ACCEPTABLE
</h3>
  <h3>Design Validation</h3>

  <p>✅ <b>Flux:</b> {designStatus}</p>

<p>⚠️ <b>Recovery:</b> {recoveryStatus}</p>

<p>🔵 <b>Pressure:</b> {pressureStatus}</p>

<p>💧 <b>Permeate Quality:</b> {permeateStatus}</p>
</div>

              {/* CHARTS */}

              <div style={styles.chartGrid}>

                {/* LINE CHART */}

                <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px"
  }}
>
  <div style={styles.panel}>
  <h3>TDS Reduction</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart
      data={[
        {
          name: "Feed",
          tds: Number(feedTDS)
        },
        {
          name: "Product",
          tds: Number(permeateTDS)
        }
      ]}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="tds"
        fill="#0f766e"
      />
    </BarChart>
  </ResponsiveContainer>
</div>

<div style={styles.panel}>
  <h3>Pressure Analysis</h3>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart
      data={[
        {
          name: "Osmotic",
          pressure: Number(osmoticPressure)
        },
        {
          name: "Feed",
          pressure: Number(feedPressure)
        }
      ]}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="pressure"
        fill="#2563eb"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
</div>

                {/* BAR CHART */}

                <div style={styles.panel}>

                  <div style={styles.panelTitle}>
                    Performance Metrics
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: 300
                    }}
                  >

                    <ResponsiveContainer>

                      <BarChart
                        data={barData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="value"
                          fill="#0f766e"
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>

              {/* PIE CHART */}

              <div style={{ marginTop: "25px" }}>

                <div style={styles.panel}>

                  <div style={styles.panelTitle}>
                    Water Recovery Distribution
                  </div>

<div style={styles.panel}>
  <h3>Process Flow Diagram</h3>

  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "40px 20px",
      flexWrap: "wrap",
      textAlign: "center"
    }}
  >
    <div>
      <h4>Feed Water</h4>
      <p>{Number(feedFlow).toFixed(2)} m³/hr</p>
    </div>

    <div style={{ fontSize: "30px" }}>
      ➜
    </div>

    <div>
      <h4>RO System</h4>
      <p>{totalElements} Elements</p>
    </div>

    <div style={{ fontSize: "30px" }}>
      ➜
    </div>

    <div>
      <h4>Product</h4>
      <p>{permeateFlow.toFixed(2)} m³/hr</p>
    </div>

    <div style={{ fontSize: "30px" }}>
      +
    </div>

    <div>
      <h4>Reject</h4>
      <p>{concentrateFlow.toFixed(2)} m³/hr</p>
    </div>
  </div>
</div>
</div>
</div>
              

               <div style={{ marginTop: "25px" }}>

  <div style={styles.panel}>

  <div style={styles.panelTitle}>
    Cost Estimation
  </div>

  <table style={styles.table}>

    <tbody>

      <tr>

        <td style={styles.label}>
          Daily Power Cost
        </td>

        <td style={styles.cell}>
          ₹ {calculateCost().dailyPowerCost}
        </td>

      </tr>

      <tr>

        <td style={styles.label}>
          Membrane Cost
        </td>

        <td style={styles.cell}>
          ₹ {calculateCost().membraneCost}
        </td>

      </tr>

      <tr>

        <td style={styles.label}>
          Maintenance Cost
        </td>

        <td style={styles.cell}>
          ₹ {calculateCost().maintenanceCost}
        </td>

      </tr>

      <tr>

        <td style={styles.label}>
          Cost per m³
        </td>

        <td style={styles.cell}>
          ₹ {calculateCost().costPerM3}
        </td>

      </tr>

      <tr>

        <td style={styles.label}>
          Estimated Yearly Cost
        </td>

        <td style={styles.cell}>
          ₹ {calculateCost().yearlyCost}
        </td>

      </tr>

    </tbody>

  </table>

</div>
</div>

            </div>
          )
        }
      
        {/* PROJECT INFO */}

        {
          activeMenu === "project" && (

            <div style={styles.panel}>

              <div style={styles.panelTitle}>
                Project Information
              </div>

              <div style={styles.formGrid}>

                <div>

                  <label style={styles.formLabel}>
                    Project Name
                  </label>

                  <input
                    style={styles.input}
                    value={projectName}
                    onChange={(e) =>
                      setProjectName(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Company Name
                  </label>

                  <input
                    style={styles.input}
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Engineer Name
                  </label>

                  <input
                    style={styles.input}
                    value={engineerName}
                    onChange={(e) =>
                      setEngineerName(e.target.value)
                    }
                  />

                </div>

              </div>

              <div style={{ marginTop: "20px" }}>

                <label style={styles.formLabel}>
                  Notes
                </label>

                <textarea
                  style={styles.textarea}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                />

              </div>

            </div>
          )
        }

        {/* FEED DATA */}

        {
          activeMenu === "feed" && (

            <div style={styles.panel}>

              <div style={styles.panelTitle}>
                Feed Water Parameters
              </div>

              <div style={styles.formGrid}>

                <div>

                  <label style={styles.formLabel}>
                    Recovery %
                  </label>

                  <input
                    style={styles.input}
                    value={recovery}
                    onChange={(e) =>
                      setRecovery(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Temperature °C
                  </label>

                  <input
                    style={styles.input}
                    value={temperature}
                    onChange={(e) =>
                      setTemperature(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Feed Flow
                  </label>

                  <input
                    style={styles.input}
                    value={feedFlow}
                    onChange={(e) =>
                      setFeedFlow(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Feed TDS
                  </label>

                  <input
                    style={styles.input}
                    value={feedTDS}
                    onChange={(e) =>
                      setFeedTDS(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label style={styles.formLabel}>
                    Water Type
                  </label>

                  <select
                    style={styles.input}
                    value={waterType}
                    onChange={(e) =>
                      setWaterType(e.target.value)
                    }
                  >

                    <option>
                      Select Water Type
                    </option>

                    <option>
                      Sea Water
                    </option>

                    <option>
                      Brackish Water
                    </option>

                    <option>
                      Ground Water
                    </option>

                  </select>
                 </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Membrane Size
                    </label>

                    <select
                      value={membraneSize}
                      onChange={(e) =>
                        setMembraneSize(e.target.value)
                      }
                      style={styles.input}
                    >

                    <option>
                      Select Membrane Size
                    </option>

                    <option value="2.5 x 14">
                      2.5 × 14
                    </option>

                    <option value="2.5 x 21">
                      2.5 × 21
                    </option>

                    <option value="2.5 x 40">
                      2.5 × 40
                    </option>

                    <option value="4 x 40">
                      4 × 40
                    </option>

                    <option value="8 x 40">
                      8 × 40
                    </option>

                    <option value="8 x 80">
                      8 × 80
                    </option>

                    <option value="14 x 80">
                      14 × 80
                    </option>

                  </select>
                

                </div>

              </div>

            </div>
          )
        }

        {/* water chemistry */}

        {
activeMenu === "waterChemistry" && (

<div style={styles.card}>

<h2 style={{
  marginBottom: "20px",
  color: "#0f766e",
  borderBottom: "3px solid #0f766e",
  paddingBottom: "10px"
}}>
  Water Chemistry Analysis
</h2>

<div style={{
  background: "#f8fafc",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  border: "1px solid #cbd5e1"
}}>

<h3 style={{
  color: "#1e293b",
  marginBottom: "10px"
}}>
  Feed Water Parameters
</h3>

<table style={styles.table}>
<tbody>

<tr>
<td style={styles.label}>
pH
</td>

<td style={styles.cell}>
<input
type="number"
step="0.1"
value={pH}
onChange={(e)=>setPH(e.target.value)}
style={styles.input}
/>
</td>
</tr>

</tbody>
</table>

</div>

<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
}}>

{/* CATIONS */}

<div>

<h3 style={{
  background: "#dbeafe",
  color: "#1e40af",
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center"
}}>
  Cations (+)
</h3>

<table style={styles.table}>

<thead>

<tr style={{
  background:"#0f766e",
  color:"white"
}}>

<th style={{padding:"8px"}}>Ion</th>

<th style={{padding:"8px"}}>mg/L</th>

<th style={{padding:"8px"}}>ppm CaCO₃</th>

<th style={{padding:"8px"}}>meq/L</th>

<th style={{padding:"8px"}}>Total</th>

</tr>

</thead>

<tbody>

<IonRow
label="Ammonium (NH₄⁺)"
value={ammonium}
setter={setAmmonium}
factor={ionFactors.ammonium}
/>

<IonRow
label="Sodium (Na⁺)"
value={sodium}
setter={setSodium}
factor={ionFactors.sodium}
/>

<IonRow
label="Potassium (K⁺)"
value={potassium}
setter={setPotassium}
factor={ionFactors.potassium}
/>

<IonRow
label="Calcium (Ca²⁺)"
value={calcium}
setter={setCalcium}
factor={ionFactors.calcium}
/>

<IonRow
label="Magnesium (Mg²⁺)"
value={magnesium}
setter={setMagnesium}
factor={ionFactors.magnesium}
/>

<IonRow
label="Strontium (Sr²⁺)"
value={strontium}
setter={setStrontium}
factor={ionFactors.strontium}
/>

<IonRow
label="Barium (Ba²⁺)"
value={barium}
setter={setBarium}
factor={ionFactors.barium}
/>

</tbody>
</table>

</div>

{/* ANIONS */}

<div>

<h3 style={{
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center"
}}>
  Anions (-)
</h3>

<table style={styles.table}>

<thead>

<tr style={{
  background:"#0f766e",
  color:"white"
}}>

<th style={{padding:"8px"}}>Ion</th>

<th style={{padding:"8px"}}>mg/L</th>

<th style={{padding:"8px"}}>ppm CaCO₃</th>

<th style={{padding:"8px"}}>meq/L</th>

<th style={{padding:"8px"}}>Total</th>

</tr>

</thead>

<tbody>

<IonRow
label="Chloride (Cl⁻)"
value={chloride}
setter={setChloride}
factor={ionFactors.chloride}
/>

<IonRow
label="Fluoride (F⁻)"
value={fluoride}
setter={setFluoride}
factor={ionFactors.fluoride}
/>

<IonRow
label="Nitrate (NO₃⁻)"
value={nitrate}
setter={setNitrate}
factor={ionFactors.nitrate}
/>

<IonRow
label="Carbonate (CO₃²⁻)"
value={carbonate}
setter={setCarbonate}
factor={ionFactors.carbonate}
/>

<IonRow
label="Bicarbonate (HCO₃⁻)"
value={bicarbonate}
setter={setBicarbonate}
factor={ionFactors.bicarbonate}
/>

<IonRow
label="Sulfate (SO₄²⁻)"
value={sulfate}
setter={setSulfate}
factor={ionFactors.sulfate}
/>

<IonRow
label="Silica (SiO₂)"
value={silica}
setter={setSilica}
factor={ionFactors.silica}
/>

<IonRow
label="Boron (B)"
value={boron}
setter={setBoron}
factor={ionFactors.boron}
/>

</tbody>
</table>

</div>

</div>

{/* SUMMARY CARDS */}

<div
  style={{
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px"
  }}
>

  <div style={styles.metricCard}>
    <h4>Total TDS</h4>
    <h2>{totalTDS.toFixed(2)}</h2>
    <p>mg/L</p>
  </div>

  <div style={styles.metricCard}>
    <h4>Total Cations</h4>
    <h2>{totalCations.toFixed(3)}</h2>
    <p>meq/L</p>
  </div>

  <div style={styles.metricCard}>
    <h4>Total Anions</h4>
    <h2>{totalAnions.toFixed(3)}</h2>
    <p>meq/L</p>
  </div>

  <div style={styles.metricCard}>
    <h4>Charge Balance Error</h4>
    <h2>{chargeBalance.toFixed(2)}%</h2>
  </div>

  <div style={styles.metricCard}>
    <h4>Total Hardness</h4>
    <h2>{totalHardness}</h2>
    <p>mg/L as CaCO₃</p>
  </div>

  <div style={styles.metricCard}>
    <h4>Total Alkalinity</h4>
    <h2>{totalAlkalinity}</h2>
    <p>mg/L as CaCO₃</p>
  </div>

  <div style={styles.metricCard}>
    <h4>Ionic Strength</h4>
    <h2>{ionicStrength}</h2>
    <p>meq/L</p>
  </div>

  <div style={styles.metricCard}>
    <h4>TDS Difference</h4>
    <h2>{tdsDifference}</h2>
    <p>mg/L</p>
  </div>

</div>

{/* WATER QUALITY ASSESSMENT */}

<div
  style={{
    marginTop: "25px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}
>
  <h3
    style={{
      color: "#0f766e",
      marginBottom: "15px"
    }}
  >
    Water Quality Assessment
  </h3>

  <p>
    <b>Hardness:</b>{" "}
    {
      Number(totalHardness) < 75
      ? "Soft Water"
      : Number(totalHardness) < 150
      ? "Moderately Hard Water"
      : Number(totalHardness) < 300
      ? "Hard Water"
      : "Very Hard Water"
    }
  </p>

  <p>
    <b>Alkalinity:</b>{" "}
    {
      Number(totalAlkalinity) < 80
      ? "Low"
      : Number(totalAlkalinity) < 200
      ? "Normal"
      : "High"
    }
  </p>

  <p>
    <b>Charge Balance:</b>{" "}
    {
      Math.abs(chargeBalance) < 5
      ? "Excellent"
      : Math.abs(chargeBalance) < 10
      ? "Acceptable"
      : "Poor"
    }
  </p>

  <p>
    <b>TDS Validation:</b>{" "}
    {tdsStatus}
  </p>

  <p>
    <b>Overall Assessment:</b>{" "}
    {
      Math.abs(chargeBalance) < 5 &&
      Number(tdsDifference) < 100
      ? "Suitable for RO Design"
      : "Review Water Analysis"
    }
  </p>

  <div
    style={{
      marginTop: "15px",
      padding: "15px",
      borderRadius: "8px",
      background:
        Math.abs(chargeBalance) < 5
          ? "#dcfce7"
          : "#fee2e2",
      color:
        Math.abs(chargeBalance) < 5
          ? "#166534"
          : "#991b1b",
      fontWeight: "bold"
    }}
  >
    {
      Math.abs(chargeBalance) < 5
      ? "✓ Water Chemistry Balanced"
      : "⚠ Water Chemistry Requires Adjustment"
    }
  </div>

</div>

{/* ION BALANCE TOOLS */}

<div
  style={{
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "12px"
  }}
>
  <button
    style={styles.primaryButton}
    onClick={addChloride}
  >
    Add Chloride
  </button>

  <button
    style={styles.primaryButton}
    onClick={addSulfate}
  >
    Add Sulfate
  </button>

  <button
    style={styles.primaryButton}
    onClick={adjustCations}
  >
    Adjust Cations
  </button>

  <button
    style={styles.primaryButton}
    onClick={adjustAnions}
  >
    Adjust Anions
  </button>

  <button
    style={styles.primaryButton}
    onClick={adjustAllIons}
  >
    Auto Balance
  </button>
</div>

<div style={{
  marginTop: "25px",
  display: "flex",
  gap: "20px"
}}>

<div style={{
  flex: 1,
  background: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}}>

<h3 style={{
  color: "#0f766e",
  marginBottom: "15px"
}}>
Charge Balance
</h3>

<p>
<b>Cations:</b> {totalCations.toFixed(3)}
</p>

<p>
<b>Anions:</b> {totalAnions.toFixed(3)}
</p>

<p>
<b>Balance:</b> {chargeBalance.toFixed(2)} %
</p>

<div
  style={{
    background:
      Math.abs(chargeBalance) < 5
        ? "#dcfce7"
        : "#fee2e2",
    color:
      Math.abs(chargeBalance) < 5
        ? "#166534"
        : "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "bold",
    marginTop: "15px"
  }}
>
  {
    Math.abs(chargeBalance) < 5
      ? "✓ Balanced Water Chemistry"
      : "⚠ Water Chemistry Not Balanced"
  }
</div>

</div>

</div>

</div>

)}

{/* SCALING INFORMATION */}

{activeMenu === "ScalingInformation" && (

<div style={styles.card}>

<h2
style={{
  marginBottom: "20px",
  color: "#0f766e",
  borderBottom: "3px solid #0f766e",
  paddingBottom: "10px"
}}
>
Scaling Information
</h2>

<div
style={{
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "25px"
}}
>

<div style={styles.metricCard}>
  <h3>LSI</h3>
  <h1>{lsiValue}</h1>
</div>

<div style={styles.metricCard}>
  <h3>S&DSI</h3>
  <h1>{sdsiValue}</h1>
</div>

<div style={styles.metricCard}>
  <h3>Silica Saturation</h3>
  <h1>{silicaSatValue}%</h1>
</div>

<div style={styles.metricCard}>
  <h3>CaSO₄ Saturation</h3>
  <h1>{caSo4SatValue}%</h1>
</div>

<div style={styles.metricCard}>
  <h3>BaSO₄ Saturation</h3>
  <h1>{baSo4SatValue}%</h1>
</div>

<div style={styles.metricCard}>
  <h3>SrSO₄ Saturation</h3>
  <h1>{srSo4SatValue}%</h1>
</div>

<div style={styles.metricCard}>
  <h3>Conc. Factor</h3>
  <h1>{concentrationFactor.toFixed(2)}</h1>
</div>

<div style={styles.metricCard}>
  <h3>Conc. Silica</h3>
  <h1>{concentrateSilica.toFixed(1)}</h1>
</div>

<div style={styles.metricCard}>
  <h3>Conc. Sulfate</h3>
  <h1>{concentrateSulfate.toFixed(1)}</h1>
</div>

</div>

<div
style={{
  background: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}}
>

<h3
style={{
  color: "#0f766e",
  marginBottom: "15px"
}}
>
Scaling Assessment
</h3>

<p>
  <b>LSI:</b>{" "}
  {
    Number(lsiValue) < 0
      ? "No Scaling Risk"
      : Number(lsiValue) < 1
      ? "Acceptable"
      : Number(lsiValue) < 2
      ? "Monitor Closely"
      : "High Calcium Carbonate Scaling Risk"
  }
</p>

<p>
  <b>S&DSI:</b>{" "}
  {
    Number(sdsiValue) < 0
      ? "No Sulfate Scaling Risk"
      : Number(sdsiValue) < 1
      ? "Acceptable"
      : Number(sdsiValue) < 2
      ? "Monitor Closely"
      : "High Sulfate Scaling Risk"
  }
</p>

<p>
  <b>Silica:</b>{" "}
  {
    Number(silicaSatValue) < 70
      ? "Acceptable"
      : Number(silicaSatValue) < 90
      ? "Monitor Closely"
      : Number(silicaSatValue) < 100
      ? "Approaching Limit"
      : "Silica Scaling Likely"
  }
</p>

<p>
  <b>CaSO₄:</b>{" "}
  {
    Number(caSo4SatValue) < 200
      ? "Acceptable"
      : Number(caSo4SatValue) < 500
      ? "Monitor Closely"
      : "Calcium Sulfate Scaling Likely"
  }
</p>

<p>
  <b>BaSO₄:</b>{" "}
  {
    Number(baSo4SatValue) < 50
      ? "Acceptable"
      : Number(baSo4SatValue) < 100
      ? "Monitor Closely"
      : "Barium Sulfate Scaling Likely"
  }
</p>

<p>
  <b>SrSO₄:</b>{" "}
  {
    Number(srSo4SatValue) < 50
      ? "Acceptable"
      : Number(srSo4SatValue) < 100
      ? "Monitor Closely"
      : "Strontium Sulfate Scaling Likely"
  }
</p>

</div>

</div>

)}

{/* SYSTEM CONFIGURATION */}

{activeMenu === "systemConfiguration" && (

<div style={styles.card}>

<h2
style={{
  marginBottom: "20px",
  color: "#0f766e",
  borderBottom: "3px solid #0f766e",
  paddingBottom: "10px"
}}
>
System Configuration
</h2>

<div
style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
}}
>

<div>

<h3>System Parameters</h3>

<table style={styles.table}>
<tbody>

<tr>
<td style={styles.label}>Stages</td>
<td style={styles.cell}>
<input
type="number"
value={stages}
onChange={(e)=>setStages(e.target.value)}
style={styles.input}
/>
</td>
</tr>

<tr>
<td style={styles.label}>Pressure Vessels</td>
<td style={styles.cell}>
<input
type="number"
value={pressureVessels}
onChange={(e)=>setPressureVessels(e.target.value)}
style={styles.input}
/>
</td>
</tr>

<tr>
<td style={styles.label}>Elements / Vessel</td>
<td style={styles.cell}>
<input
type="number"
value={elementsPerVessel}
onChange={(e)=>setElementsPerVessel(e.target.value)}
style={styles.input}
/>
</td>
</tr>

<tr>
<td style={styles.label}>Pump Efficiency (%)</td>
<td style={styles.cell}>
<input
type="number"
value={pumpEfficiency}
onChange={(e)=>setPumpEfficiency(e.target.value)}
style={styles.input}
/>
</td>
</tr>

<tr>
<td style={styles.label}>Feed Pressure (bar)</td>
<td style={styles.cell}>
<input
type="number"
value={systemFeedPressure}
onChange={(e)=>setSystemFeedPressure(e.target.value)}
style={styles.input}
/>
</td>
</tr>

</tbody>
</table>

</div>

<div>

<h3>Configuration Summary</h3>

<div style={styles.metricCard}>
<h4>Total Elements</h4>

<h2>
{
Number(pressureVessels || 0) *
Number(elementsPerVessel || 0)
}
</h2>

</div>

<div
  style={{
    ...styles.metricCard,
    marginTop: "20px"
  }}
>
  <h4>Total Membrane Area</h4>

<h2>
  {membraneArea.toFixed(0)}
</h2>

<p>ft²</p>

<p
  style={{
    fontSize: "14px",
    color: "#666",
    marginTop: "5px"
  }}
>
  ({membraneAreaM2.toFixed(2)} m²)
</p>
</div>

<div
style={{
marginTop:"15px"
}}
>

<p>
<b>Stages:</b> {stages}
</p>

<p>
<b>Pressure Vessels:</b> {pressureVessels}
</p>

<p>
<b>Elements/Vessel:</b> {elementsPerVessel}
</p>

<p>
  <b>Total Elements:</b> {totalElements}
</p>

<p>
<b>Pump Efficiency:</b> {pumpEfficiency} %
</p>

<p>
<b>Feed Pressure:</b> {systemFeedPressure} bar
</p>

<p>
  <b>Design Flux:</b>{" "}
  {Number(result?.flux || 0).toFixed(2)} LMH
</p>

</div>

</div>

</div>

</div>

)}


        {/* RESULTS */}

       {activeMenu === "results" && (

<div style={styles.card}>

<h2
style={{
  marginBottom: "20px",
  color: "#0f766e",
  borderBottom: "3px solid #0f766e",
  paddingBottom: "10px"
}}
>
Projection Results
</h2>

<div
style={{
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "20px"
}}
>

<div style={styles.metricCard}>
  <h4>Permeate Flow</h4>
  <h2>{Number(result?.product_flow_rate || 0).toFixed(2)}</h2>
  <p>m³/hr</p>
</div>

<div style={styles.metricCard}>
  <h4>Concentrate Flow</h4>
  <h2>{concentrateFlow.toFixed(2)}</h2>
  <p>m³/hr</p>
</div>

<div style={styles.metricCard}>
  <h4>Recovery</h4>
  <h2>{recovery}%</h2>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: "bold",
      color:
        recovery > 85
          ? "red"
          : recovery < 40
          ? "orange"
          : "green"
    }}
  >
    {recoveryStatus}
  </p>
</div>

<div style={styles.metricCard}>
  <h4>Permeate TDS</h4>
 <h2>{Number(result?.product_tds || 0).toFixed(2)}</h2>
  <p>mg/L</p>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: "bold",
      color:
        permeateTDS > 500
          ? "red"
          : permeateTDS > 200
          ? "orange"
          : "green"
    }}
  >
    {permeateStatus}
  </p>
</div>

<div style={styles.metricCard}>
  <h4>Concentrate TDS</h4>
  <h2>{concentrateTDS.toFixed(2)}</h2>
  <p>mg/L</p>
</div>

<div style={styles.metricCard}>
  <h4>Salt Rejection</h4>
  <h2>{Number(result?.salt_rejection || 0).toFixed(1)}%</h2>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: "bold",
      color:
        saltRejection < 95
          ? "red"
          : saltRejection < 98
          ? "orange"
          : "green"
    }}
  >
    {rejectionStatus}
  </p>
</div>

<div style={styles.metricCard}>
  <h4>Flux</h4>

  <h2>{flux.toFixed(2)}</h2>

  <p>LMH</p>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      color:
        flux > 45
          ? "red"
          : flux < 10
          ? "orange"
          : "green",
      fontWeight: "bold"
    }}
  >
    {designStatus}
  </p>
</div>

<div style={styles.metricCard}>
  <h4>Osmotic Pressure</h4>
  <h2>{osmoticPressure}</h2>
  <p>bar</p>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: "bold",
      color:
        Number(osmoticPressure) > 10
          ? "red"
          : Number(osmoticPressure) > 1
          ? "orange"
          : "green"
    }}
  >
    {osmoticStatus}
  </p>
</div>

<div style={styles.metricCard}>
  <h4>Feed Pressure</h4>
  <h2>{Number(result?.feed_pressure || 0).toFixed(2)}</h2>
  <p>bar</p>

  <p
    style={{
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: "bold",
      color:
        Number(feedPressure) > 55
          ? "red"
          : Number(feedPressure) > 25
          ? "orange"
          : "green"
    }}
  >
    {pressureStatus}
  </p>
</div>

</div>

</div>

)}

             {/* SAVED PROJECTS */}

        {
          activeMenu === "savedProjects" && (

            <div style={styles.panel}>

              <div style={styles.panelTitle}>
                Saved Projects
              </div>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.label}>
                      Project
                    </th>

                    <th style={styles.label}>
                      Company
                    </th>

                    <th style={styles.label}>
                      Engineer
                    </th>

                    <th style={styles.label}>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    savedProjects.map((project) => (

                      <tr key={project.id}>

                        <td style={styles.cell}>
                          {project.project_name}
                        </td>

                        <td style={styles.cell}>
                          {project.company_name}
                        </td>

                        <td style={styles.cell}>
                          {project.engineer_name}
                        </td>

                        <td style={styles.cell}>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px"
    }}
  >

    <button

      style={styles.primaryBtn}

      onClick={() => {

        console.log("Loaded project:", project);

        setProjectName(
          project.project_name
        );

        setCompanyName(
          project.company_name
        );

        setEngineerName(
          project.engineer_name
        );

        setNotes(
          project.notes || ""
        );

        setFeedTDS(
          project.feed_tds
        );

        setRecovery(
          project.recovery
        );

        setTemperature(
          project.temperature
        );

        setFeedFlow(
          project.feed_flow
        );

        setWaterType(
          project.water_type
        );

        setMembraneSize(project.membrane_size);

        const membraneNameMap = {
  "2.5 x 14": "SW30-2514",
  "2.5 x 21": "SW30-2521",
  "2.5 x 40": "SW30-2540",
  "4 x 40": "SW30-4040",
  "8 x 40": "SW30HRLE-400",
  "8 x 80": "SW30HRLE-440",
  "14 x 40": "SW30-1440",
  "14 x 80": "SW30-1480"
};

setSelectedMembrane(
  project.selected_membrane ||
  project.membrane ||
  membraneNameMap[project.membrane_size]
);



        setPH(project.pH || "");

        setCalcium(project.calcium || "");

        setMagnesium(project.magnesium || "");

        setSodium(project.sodium || "");

        setPotassium(project.potassium || "");

        setChloride(project.chloride || "");

        setSulfate(project.sulfate || "");

        setBicarbonate(project.bicarbonate || "");

        setSilica(project.silica || "");

        setAmmonium(project.ammonium || "");

        setStrontium(project.strontium || "");

        setBarium(project.barium || "");

        setCarbonate(project.carbonate || "");

        setNitrate(project.nitrate || "");

        setFluoride(project.fluoride || "");

        setBoron(project.boron || "");

        setStages(project.stages || 1);

setPressureVessels(
  project.pressure_vessels || 1
);

setElementsPerVessel(
  project.elements_per_vessel || 1
);

setPumpEfficiency(
  project.pump_efficiency || 80
);

setSystemFeedPressure(
  project.system_feed_pressure || 10
);

        setResult(
  project.result
    ? JSON.parse(project.result)
    : null
);

        setActiveMenu(
          "results"
        );

      }}

    >

      Load

    </button>

    <button

      style={styles.dangerBtn}

      onClick={() => {

        if (
          window.confirm(
            "Delete this project?"
          )
        ) {

          deleteProject(
            project.id
          );

        }

      }}

    >

      Delete

    </button>

  </div>

</td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          )
        }
        {
  activeMenu === "membranes" && (

    <div style={styles.page}>

      <div style={styles.panel}>

        <table style={styles.projectTable}>

          <thead>

            <tr>

              <th style={styles.tableHead}>
                Name
              </th>

              <th style={styles.tableHead}>
                Type
              </th>

              <th style={styles.tableHead}>
                Size
              </th>

              <th style={styles.tableHead}>
                Recovery
              </th>

              <th style={styles.tableHead}>
                Pressure
              </th>

              <th style={styles.tableHead}>
                Rejection
              </th>

              <th style={styles.tableHead}>
                Life
              </th>

              <th style={styles.tableHead}>
                Application
              </th>

            </tr>

          </thead>

          <tbody>

            {

              membranes.map((m, index) => (

                <tr key={index}>

                  <td style={styles.cell}>
                    {m.name}
                  </td>

                  <td style={styles.cell}>
                    {m.type}
                  </td>

                  <td style={styles.cell}>
                    {m.size}
                  </td>

                  <td style={styles.cell}>
                    {m.recovery_limit}%
                  </td>

                  <td style={styles.cell}>
                    {m.max_pressure} bar
                  </td>

                  <td style={styles.cell}>
                    {m.salt_rejection}%
                  </td>

                  <td style={styles.cell}>
                    {m.membrane_life}
                  </td>

                  <td style={styles.cell}>
                    {m.application}
                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  )
}

      </div>

    </div>

  );

}

const styles = {

  historyBox: {

  marginTop: "40px",

  paddingTop: "20px",

  borderTop:
    "1px solid rgba(255,255,255,0.1)",

  width: "100%"

},

  historyTitle: {
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "15px"
  },

  historyItem: {

  padding: "12px",

  marginBottom: "12px",

  borderRadius: "12px",

  background: "#1e293b",

  color: "white",

  cursor: "pointer",

  fontSize: "14px",

  fontWeight: "600",

  border: "1px solid rgba(255,255,255,0.1)"

},

  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "Segoe UI"
  },

  sidebar: {
    width: "260px",
    background:
      "linear-gradient(180deg,#111827,#1e293b)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  brandSection: {
    marginBottom: "20px"
  },

  brandTitle: {
    color: "white",
    fontSize: "28px",
    fontWeight: "700"
  },

  brandSub: {
    color: "#94a3b8",
    marginTop: "6px",
    fontSize: "13px"
  },

  menuButton: {
    background: "transparent",
    color: "#cbd5e1",
    border: "none",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px"
  },

  flowCard: {
  width: "120px",
  height: "160px",
  padding: "10px",
  textAlign: "center",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
},

  primaryButton: {
  background: "#0f766e",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  flex: 1,
  whiteSpace: "nowrap"
},

  activeButton: {
    background:
      "linear-gradient(135deg,#334155,#1e293b)",
    color: "white",
    border: "none",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700"
  },

  workspace: {
    flex: 1,
    padding: "24px",
    background:
      "linear-gradient(135deg,#f1f5f9,#e2e8f0)"
  },

  topbar: {
    background: "white",
    padding: "20px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  actionBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px"
  },

  primaryBtn: {
    background:
      "linear-gradient(135deg,#0f766e,#115e59)",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },

  secondaryBtn: {

  backgroundColor: "#ffffff",

  color: "#1f2937",

  border: "1px solid #d1d5db",

  padding: "10px 20px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "600",

  transition: "0.3s"

},

dangerBtn: {

  backgroundColor: "#dc3545",

  color: "white",

  border: "none",

  padding: "10px 15px",

  borderRadius: "5px",

  cursor: "pointer"

},

  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px,1fr))",
    gap: "18px"
  },

  kpiCard: {
    background: "white",
    padding: "24px",
    borderRadius: "18px"
  },

  kpiLabel: {
    color: "#64748b",
    fontSize: "14px"
  },

  kpiValue: {
    fontSize: "34px",
    fontWeight: "700",
    marginTop: "10px"
  },

  kpiUnit: {
    marginTop: "6px",
    color: "#64748b"
  },

  dashboardGrid: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr",
    gap: "20px",
    marginTop: "20px"
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
    marginTop: "25px"
  },

  panel: {
    background: "white",
    borderRadius: "20px",
    padding: "24px"
  },

  panelTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  resultCell: {
  textAlign: "center",
  fontWeight: "600",
  background: "#f8fafc",
  minWidth: "80px",
  padding: "10px"
},

metricCard: {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
},

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  label: {
    border: "1px solid #cbd5e1",
    padding: "14px",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    width: "30%"
  },

  cell: {
    border: "1px solid #cbd5e1",
    padding: "14px"
  },

  healthRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #e2e8f0"
  },

  good: {
    color: "#15803d",
    fontWeight: "700"
  },

  warning: {
    color: "#ca8a04",
    fontWeight: "700"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%"
  },

  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    backgroundColor: "white"
  },

  textarea: {
    width: "100%",
    height: "160px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    resize: "vertical",
    backgroundColor: "white"
  }

};

export default App;