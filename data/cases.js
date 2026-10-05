// Case studies: one record per project, shared by the homepage (featured cases, register, case sheet),
// the case-studies list, each case page and the sector pages. Words and figures are the old site's.
// TODO(owner): the workplan figures come from the old site's diagrams. Confirm whether they were achieved
// or projected (Emicool's is labelled "Recommended").
// Order is the old site's; scope lines are separated by a line break.
export const CASES = [
  {
    key: "dubai-medical",
    slug: "dubai-medical-university-hospital-dubai",
    client: "Dubai Medical University Hospital",
    place: "Dubai",
    year: "2022",
    scope: ["Harmonics Mitigation Solutions", "Active Harmonic Filters (AHF) Installation"],
    photo: { src: "/assets/img/case-dubai-medical-453.webp", width: 453, height: 330, alt: "Dubai Medical University Hospital building" },
    findings: [
      { title: "Key findings", items: [
        "Non-compliance to utility regulations",
        "High harmonic distortion within the electrical system",
      ] },
      { title: "Advantages of AHF", items: [
        "Reduce the harmonics within the system",
        "Low losses within the connected loads",
        "Improves the overall efficiency of the electrical system",
      ] },
    ],
    // TODO(owner): THD before/after and savings were left as "Xx THD" and "% Savings" on the old site.
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "PQ losses, resonance", values: ["0.98 PF", { todo: "THD to be confirmed" }] },
        { label: "Harmonic mitigation" },
        { kind: "end", label: "Compliance & reliability", values: ["0.99 PF", { todo: "THD and savings to be confirmed" }] },
      ],
    },
    register: { year: "2022", name: "Dubai Medical University Hospital, Dubai",
      scope: "Harmonics mitigation · Active Harmonic Filters (AHF) installation",
      result: "PF 0.98 → 0.99" },
  },
  {
    key: "emicool",
    slug: "emicool-in-motor-city-dubai-2021",
    client: "Emicool",
    place: "Motor City, Dubai",
    year: "2021",
    scope: ["Power Quality Analysis of chillers and pump units", "Efficiency under SCADA Network"],
    photo: { src: "/assets/img/case-emicool-960.webp",
      srcSet: "/assets/img/case-emicool-480.webp 480w, /assets/img/case-emicool-960.webp 960w, /assets/img/case-emicool-1440.webp 1440w",
      sizes: "(min-width: 960px) 460px, 100vw",
      width: 1440, height: 1080, alt: "Chilled water plant room with large insulated pipework" },
    findings: [
      { title: "Key findings", items: [
        "VFDs, chillers T/P, cooling tower pumps and fans are controlled manually (not PLC-controlled)",
        "Overall system COP ≤\u00a03.1",
        "30% of temperature sensors defective (inconsistent readings)",
        "BTU meters reading only the main supply line",
        "Inconsistent BMS connections to the chillers",
        "Existing control system (Siemens S7 Industrial PLC) partially out of service",
        "Critical power quality parameters (low PF, high harmonics, failing capacitors)",
      ] },
    ],
    workplan: {
      caption: "Recommended improvement workplan",
      steps: [
        { kind: "start", label: "COP ≤\u00a03.1" },
        { label: "Maintenance of assets" },
        { label: "Power quality correction", values: ["9% savings"] },
        { label: "Flow control (pumps)", values: ["45% savings"] },
        { label: "SCADA optimization", values: ["46% savings"] },
        { kind: "end", label: "COP ≥\u00a03.8", values: ["13–18% savings"] },
      ],
    },
    register: { year: "2021", name: "Emicool in Motor City, Dubai",
      scope: "Power quality analysis of chillers and pump units · Efficiency under SCADA network",
      result: "COP ≤\u00a03.1 → ≥\u00a03.8 · 13–18% savings" },
  },
  {
    key: "bid-factory",
    slug: "bid-factory-al-quoz-dubai-2021",
    client: "BID Factory",
    place: "Al Quoz, Dubai",
    year: "2021",
    scope: ["Harmonics & Reactive Power Solutions", "Installation of SVG/AHF Hybrid Rack-Mounted Panel"],
    photo: { src: "/assets/img/case-bid-factory-453.webp", width: 453, height: 329, alt: "Loading bay of the BID factory in Al Quoz, Dubai" },
    findings: [
      { title: "Key findings", items: [
        "Critical power quality parameters (low PF & high harmonics)",
        "Existing contactor switched capacitor bank",
      ] },
      { title: "Limitation of existing capacitor banks", items: [
        "Insufficient response time to variable speed VFD motor loads, with consequent loss of efficiency and shorter lifespan",
        "Reduced power factor",
        "Higher current load on incomers and downstream site grid, reducing available connected load capacity",
        "High phase load unbalance",
      ] },
    ],
    // TODO(owner): THD before/after and savings were left as placeholders on the old site.
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "PQ losses, resonance", values: ["0.98 PF", { todo: "THD to be confirmed" }] },
        { label: "Power factor corrector" },
        { label: "Harmonic mitigation" },
        { kind: "end", label: "Compliance & reliability", values: ["0.99 PF", { todo: "THD and savings to be confirmed" }] },
      ],
    },
    register: { year: "2021", name: "BID Factory, Al Quoz, Dubai",
      scope: "Harmonics & reactive power solutions · SVG/AHF hybrid rack-mounted panel",
      result: "PF 0.98 → 0.99" },
  },
  {
    key: "dp-world",
    slug: "dp-world-dubai-2021",
    client: "DP World",
    place: "Dubai",
    year: "2021",
    scope: ["Harmonics & Power Factor Solutions", "Installation of SVG/AHF Hybrid Rack-Mounted Panel"],
    photo: { src: "/assets/img/case-dp-world-960.webp",
      srcSet: "/assets/img/case-dp-world-480.webp 480w, /assets/img/case-dp-world-960.webp 960w, /assets/img/case-dp-world-1440.webp 1440w",
      sizes: "(min-width: 960px) 460px, 100vw",
      width: 1440, height: 960, alt: "Container terminal at night, with ship-to-shore cranes" },
    findings: [
      { title: "Key findings", items: [
        "Non-compliance to utility regulations",
        "Critical power quality parameters (low PF & high harmonics)",
      ] },
    ],
    // TODO(owner): the old site reused BID Factory's workplan image for DP World. Confirm DP World's own figures.
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "PQ losses, resonance", values: ["0.98 PF", { todo: "THD to be confirmed" }] },
        { label: "Power factor corrector" },
        { label: "Harmonic mitigation" },
        { kind: "end", label: "Compliance & reliability", values: ["0.99 PF", { todo: "THD and savings to be confirmed" }] },
      ],
    },
    register: { year: "2021", name: "DP World, Dubai",
      scope: "Harmonics & power factor solutions · SVG/AHF hybrid rack-mounted panel",
      result: "PF 0.98 → 0.99" },
  },
  {
    key: "burj-al-arab",
    slug: "burj-al-arab-jumeirah-group-dubai-2021",
    client: "Burj Al Arab, Jumeirah Group",
    place: "Dubai",
    year: "2021",
    scope: ["Migration & Upgrade of Existing Pool Control to Simatic WinCC"],
    photo: { src: "/assets/img/case-burj-al-arab-960.webp",
      srcSet: "/assets/img/case-burj-al-arab-480.webp 480w, /assets/img/case-burj-al-arab-960.webp 960w, /assets/img/case-burj-al-arab-1440.webp 1440w",
      sizes: "(min-width: 960px) 460px, 100vw",
      width: 1440, height: 960, alt: "Burj Al Arab, Dubai" },
    findings: [
      { title: "Key findings", items: [
        "Existing control system (Honeywell, Wago) is defective and allows manual control only",
        "No automatic function for filter backwash and filter pumps (duty and standby)",
        "50% of all sensors are defective and/or providing inconsistent readings",
        "Actual control provided by HMI panels with limited functionality and no SCADA integration",
      ] },
    ],
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "Manual operation" },
        { label: "Maintenance of assets" },
        { label: "Flow control (pumps)" },
        { label: "SCADA optimization" },
        { kind: "end", label: "100% optimized auto mode", values: ["20–25% savings"] },
      ],
    },
    register: { year: "2021", name: "Burj Al Arab, Jumeirah Group, Dubai",
      scope: "Migration & upgrade of existing pool control to Simatic WinCC",
      result: "100% optimized auto mode · 20–25% savings" },
  },
  {
    key: "wild-wadi",
    slug: "wild-wadi-jumeirah-group-dubai-2021",
    client: "Wild Wadi, Jumeirah Group",
    place: "Dubai",
    year: "2021",
    scope: ["Migration & Upgrade of Siemens Desigo to Simatic WinCC"],
    photo: { src: "/assets/img/case-wild-wadi-960.webp",
      srcSet: "/assets/img/case-wild-wadi-480.webp 480w, /assets/img/case-wild-wadi-960.webp 960w, /assets/img/case-wild-wadi-1440.webp 1440w",
      sizes: "(min-width: 960px) 460px, 100vw",
      width: 1440, height: 955, alt: "Wild Wadi Waterpark with the Burj Al Arab behind, Dubai" },
    findings: [
      { title: "Key findings", items: [
        "Outdated existing PLCs (25~30 years old)",
        "Almost 50% of sensors out of service, many not configured",
        "System performance limited by the existing Building Automation System (BAS), instead of a more appropriate industrial-based automation system",
      ] },
      { title: "Key solutions", items: [
        "Replacement and upgrade of all CPUs",
        "Repairing/replacement of sensors and actuators",
        "Migration of old system to industrial-based BMS (Simatic WinCC)",
      ] },
    ],
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "Obsolete architecture" },
        { label: "Maintenance of assets" },
        { label: "Motor control (VFD)", values: ["25% savings (motor control system)"] },
        { label: "SCADA optimization", values: ["10% savings (overall)"] },
        { kind: "end", label: "Latest industrial automation", values: ["20–25% savings"] },
      ],
    },
    register: { year: "2021", name: "Wild Wadi, Jumeirah Group, Dubai",
      scope: "Migration & upgrade of Siemens Desigo to Simatic WinCC",
      result: "20–25% savings" },
  },
  {
    key: "mina-asalam",
    slug: "mina-asalam-jumeirah-group-dubai-2021",
    client: "Mina A’Salam, Jumeirah Group",
    place: "Dubai",
    year: "2021",
    scope: ["Supply, Installation & Commissioning of Water Source Heat Pump Plant"],
    photo: { src: "/assets/img/case-mina-asalam-960.webp",
      srcSet: "/assets/img/case-mina-asalam-480.webp 480w, /assets/img/case-mina-asalam-960.webp 960w, /assets/img/case-mina-asalam-1440.webp 1440w",
      sizes: "(min-width: 960px) 460px, 100vw",
      width: 1440, height: 981, alt: "Mina A’Salam hotel on the Madinat Jumeirah waterway, Dubai" },
    findings: [
      { title: "Key findings", items: [
        "Hot water generation through 8 x 105kW electric calorifiers",
        "60 m³ daily hot water consumption",
        "High energy consumption for domestic water generation",
        "Cold water generation through heat exchanger from chilled water system",
      ] },
      { title: "Key solutions", items: [
        "Removal of 1 calorifier, replaced by 2 water source heat pumps",
        "Integration of calorifiers and heat pumps with BMS for optimized use rate",
        "Domestic hot water generation alongside cold water generation integrated in the chilled water circuit",
      ] },
    ],
    workplan: {
      caption: "Improvement workplan",
      steps: [
        { kind: "start", label: "COP ≤\u00a01", values: ["Hot water generation only"] },
        { label: "Energy analysis of existing calorifier" },
        { label: "Heat pump installation" },
        { label: "Hot water & cold water generation" },
        { kind: "end", label: "COP hot side ≥\u00a04; COP cold side ≥\u00a03", values: ["16% savings · 22 months ROI"] },
      ],
    },
    register: { year: "2021", name: "Mina A’Salam, Jumeirah Group, Dubai",
      scope: "Supply, installation & commissioning of water source heat pump plant",
      result: "16% savings · 22 months ROI" },
  },
];

export const caseByKey = key => CASES.find(c => c.key === key);

// Featured on the homepage; the rest open from the register in the case sheet.
export const FEATURED = ['emicool', 'mina-asalam', 'wild-wadi'];
