const membranes = [

  {
  name: "SW30-2514",
  type: "Sea Water",
  size: "2.5 Inch",
  area: 6.5,
  recovery_limit: 35,
  max_pressure: 69,
  salt_rejection: 99.6,
  energy_saving: "Medium",
  membrane_life: "3-5 Years",
  application: "Small SWRO Systems"
},

{
  name: "SW30-2521",
  type: "Sea Water",
  size: "2.5 Inch",
  area: 12,
  recovery_limit: 35,
  max_pressure: 69,
  salt_rejection: 99.6,
  energy_saving: "Medium",
  membrane_life: "3-5 Years",
  application: "Small SWRO Systems"
},

{
  name: "SW30-4040",
  type: "Sea Water",
  size: "4 Inch",
  area: 85,
  recovery_limit: 35,
  max_pressure: 69,
  salt_rejection: 99.7,
  membrane_life: "3-5 Years",
  energy_saving: "Medium",
  application: "Sea Water Desalination"
},

{
  name: "SW30HRLE-440",
  type: "Sea Water",
  size: "8 Inch",
  area: 430,
  recovery_limit: 45,
  max_pressure: 69,
  salt_rejection: 99.8,
  energy_saving: "High",
  membrane_life: "3-5 Years",
  application: "Sea Water Desalination"
},

{
  name: "SW30-1480",
  type: "Sea Water",
  size: "14 Inch",
  area: 753,
  recovery_limit: 45,
  max_pressure: 69,
  salt_rejection: 99.8,
  energy_saving: "High",
  membrane_life: "4-5 Years",
  application: "Large SWRO Systems"
},

{
  name: "SW30-2540",
  type: "Sea Water",
  size: "2.5 Inch",
  area: 30.5,
  recovery_limit: 35,
  max_pressure: 69,
  salt_rejection: 99.8,
  energy_saving: "Medium",
  membrane_life: "3-5 Years",
  application: "Commercial SWRO"
},

  {
    name: "BW30XFR-400",
    type: "Brackish Water",
    size: "8 Inch",
    area: 400,
    recovery_limit: 85,
    max_pressure: 41,
    salt_rejection: 99.7,
    energy_saving: "High",
    membrane_life: "3-5 Years",
    application: "Industrial RO"
  },

  {
    name: "BW30PRO-440",
    type: "Brackish Water",
    size: "8 Inch",
    area: 440,
    recovery_limit: 86,
    max_pressure: 42,
    salt_rejection: 99.8,
    energy_saving: "High",
    membrane_life: "4-5 Years",
    application: "Municipal RO"
  },

  {
    name: "SW30HRLE-400",
    type: "Sea Water",
    size: "8 Inch",
    area: 400,
    recovery_limit: 42,
    max_pressure: 69,
    salt_rejection: 99.8,
    energy_saving: "Medium",
    membrane_life: "3-5 Years",
    application: "Sea Water Desalination"
  },

  {
    name: "SW30XLE-440",
    type: "Sea Water",
    size: "8 Inch",
    area: 440,
    recovery_limit: 50,
    max_pressure: 70,
    salt_rejection: 99.85,
    energy_saving: "Medium",
    membrane_life: "4-6 Years",
    application: "Marine RO"
  },

  {
    name: "LP21-4040",
    type: "Low Pressure",
    size: "4 Inch",
    area: 85,
    recovery_limit: 80,
    max_pressure: 20,
    salt_rejection: 99.2,
    energy_saving: "Very High",
    membrane_life: "2-4 Years",
    application: "Commercial RO"
  },

  {
    name: "ULP31-4040",
    type: "Ultra Low Pressure",
    size: "4 Inch",
    area: 85,
    recovery_limit: 82,
    max_pressure: 18,
    salt_rejection: 98.5,
    energy_saving: "Very High",
    membrane_life: "2-4 Years",
    application: "Low Energy Systems"
  },

  {
    name: "XLE-4040",
    type: "Extra Low Energy",
    size: "4 Inch",
    area: 85,
    recovery_limit: 85,
    max_pressure: 21,
    salt_rejection: 99.0,
    energy_saving: "Excellent",
    membrane_life: "3-5 Years",
    application: "Municipal Water"
  },

  {
    name: "CPA5-LD",
    type: "Anti Fouling",
    size: "8 Inch",
    area: 440,
    recovery_limit: 75,
    max_pressure: 30,
    salt_rejection: 99.7,
    energy_saving: "High",
    membrane_life: "4-6 Years",
    application: "Wastewater Treatment"
  },

  {
    name: "HYDRApro-4014",
    type: "High Flux",
    size: "4 Inch",
    area: 14,
    recovery_limit: 78,
    max_pressure: 35,
    salt_rejection: 99.6,
    energy_saving: "Medium",
    membrane_life: "3-4 Years",
    application: "Industrial Process Water"
  },

  {
    name: "ESPA2-LD",
    type: "Low Fouling",
    size: "8 Inch",
    area: 440,
    recovery_limit: 83,
    max_pressure: 25,
    salt_rejection: 99.5,
    energy_saving: "High",
    membrane_life: "3-5 Years",
    application: "Surface Water Treatment"
  },

  {
    name: "NF90-4040",
    type: "Nanofiltration",
    size: "4 Inch",
    area: 85,
    recovery_limit: 75,
    max_pressure: 15,
    salt_rejection: 97.0,
    energy_saving: "Excellent",
    membrane_life: "2-4 Years",
    application: "Softening & Organics Removal"
  },

  {
    name: "NF270-400",
    type: "Nanofiltration",
    size: "8 Inch",
    area: 400,
    recovery_limit: 88,
    max_pressure: 16,
    salt_rejection: 96.5,
    energy_saving: "Excellent",
    membrane_life: "3-4 Years",
    application: "Color Removal"
  },

  {
    name: "ROX-400",
    type: "High Rejection",
    size: "8 Inch",
    area: 400,
    recovery_limit: 70,
    max_pressure: 55,
    salt_rejection: 99.9,
    energy_saving: "Medium",
    membrane_life: "4-6 Years",
    application: "Pharmaceutical Water"
  },

  {
    name: "UF-2880",
    type: "Ultrafiltration",
    size: "8 Inch",
    area: 2880,
    recovery_limit: 95,
    max_pressure: 8,
    salt_rejection: "N/A",
    energy_saving: "Excellent",
    membrane_life: "5-7 Years",
    application: "Pretreatment Systems",
    particle_removal: "0.01 Micron"
  },

  {
    name: "MBR-500D",
    type: "Membrane Bioreactor",
    size: "14 Inch",
    area: 500,
    recovery_limit: 92,
    max_pressure: 12,
    salt_rejection: 94,
    energy_saving: "High",
    membrane_life: "5-8 Years",
    application: "Industrial Wastewater"
  },

  {
    name: "MegaFlow-14X",
    type: "High Capacity",
    size: "14 Inch",
    area: 1400,
    recovery_limit: 88,
    max_pressure: 50,
    salt_rejection: 99.6,
    energy_saving: "Medium",
    membrane_life: "4-7 Years",
    application: "Large Scale RO Plants"
  },

  {
    name: "AquaMax-14PRO",
    type: "Industrial RO",
    size: "14 Inch",
    area: 1400,
    recovery_limit: 90,
    max_pressure: 48,
    salt_rejection: 99.7,
    energy_saving: "High",
    membrane_life: "5-7 Years",
    application: "Mega Industrial Systems"
  }

];

export default membranes;