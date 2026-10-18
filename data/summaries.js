// Product pages: the page head shows a short summary and the key points, so the important things read at
// a glance (the owner found the long texts "an entire essay"). Both are the page's own words:
// - lede: how many sentences of the first paragraph to show (0: none, the key points say it). Without
//   an entry, lib/pages.jsx takes the first one or two sentences of a long first paragraph.
// - points: phrases picked word for word from anywhere in the page's text. lib/pages.jsx checks each one
//   against the text at build time, and only capitalises the first letter.
// The full original text stays on the page, in the closed "Full description" fold under the head.
export const SUMMARIES = {
  ahf: {
    lede: 1,
    points: [
      'detect and then neutralize harmonic current distortion',
      'improve system power quality, reduce power losses, reduce energy costs, and improve equipment reliability',
      'Intelligent Fast Fourier Transform',
      'Plug cabinet, no wiring, easy for integration and unit replacement',
    ],
  },
  'static-var-generator': {
    lede: 1,
    points: [
      'rapidly injecting or absorbing reactive power in order to maintain system voltage within desired limits',
      'power factor correction, harmonic filtering, and voltage regulation',
      'improving PF value to 0.99 within 15ms',
      'It can be used in both new and existing power systems',
    ],
  },
  'voltage-optimizers': {
    lede: 1,
    points: [
      'reduce peak demand',
      'monitor, control, and adjust voltage levels as needed, with minimal manual intervention',
      'set alarms to alert them if the voltage falls outside of predetermined levels',
      'detailed reporting on energy consumption and demand',
    ],
  },
  'uninterrupted-power-supply': {
    lede: 1,
    points: [
      'protection against power outages and power surges',
      'supplies a continuous source of power to a connected device',
      'the battery can last from a few minutes to several hours',
      '97% high efficiency on-line mode',
    ],
  },
  'power-quality-mobile-anlayser': {
    lede: 2,
    points: [
      'identify and solve power quality problems caused by harmonics, spikes, surges, and other disturbances',
      'small, lightweight, and portable',
      'Permanent recording of frequencies up to 170 kHz',
      'Free analysis software WinPQ mobile',
    ],
  },
  'heat-pumps': {
    lede: 2,
    points: [
      'Heat pumps can be used to cool as well as heat a space',
      'used in a variety of applications, including residential, commercial and industrial settings',
      'increased energy efficiency and lower operating costs',
    ],
  },
  'adsorption-chiller': {
    lede: 1,
    points: [
      'This process requires no electrical power',
      'Electricity savings of up to 80 % for the entire system are possible',
      'Only pure water is used as refrigerant',
      'Cooling capacity up to 100.0 kW',
    ],
  },
  'air-purifiers-smoke-filters': {
    lede: 1,
    points: [
      'activated carbon, HEPA filters, ozone generators, and ionizers',
      'capture particles of 0.3 microns or larger',
      'reduce the effects of indoor air pollution and improve air quality',
    ],
  },
  'bms-servers-controllers': {
    lede: 1,
    points: [
      'heating, ventilation, air conditioning, lighting, security, and access control systems',
      'integrated with other building management technologies such as energy management systems, fire detection systems, and security systems',
      'integrated with cloud-based systems, allowing users to monitor and control their building from any location',
    ],
  },
  sensors: {
    lede: 1,
    points: [
      'temperature, pressure, humidity, flow, light, and vibration sensors',
      'connected to a PLC or RTU',
      'detect any potential problems and take corrective action',
    ],
  },
  'power-supply': {
    lede: 1,
    points: [
      'surge protection and adequate backup power in case of power outages',
      'overvoltage protection and ground fault protection',
      'voltage regulation and load balancing',
      'remote monitoring and control',
    ],
  },
  'smart-meters': {
    lede: 1,
    points: [
      'two-way communication between the meter and the central system',
      'detect and diagnose problems with appliances and other home systems',
      'an essential component of smart grid technology',
    ],
  },
  '360480kw-distributed-charger': {
    lede: 0,
    points: [
      'capacity from 360 to 480kW',
      '10 minutes charging',
      'Any connector can call any kW power to charge EV from 40kW-480kW',
      'The noise of liquid cooled user terminal is <55dB',
    ],
  },
  'sec-200-240kw-integrated-charger': {
    lede: 1,
    points: [
      '0% to 80% SOC within 20 minutes',
      'peak efficiency of 96%',
      'Output voltage 200-1000V',
      'IP55, IK10 rating enclosure',
    ],
  },
  'sec-series': {
    points: [
      'Compatible with the vast majority of voltage platforms and vehicle charging',
      '300V-1000V constant power dual output segment',
      'Customize the EV Charger power configuration for power range 60-160kW',
    ],
  },
  'sec-40-80kw-integrated-charger': {
    lede: 1,
    points: [
      'Output voltage 200-1000V, Constant output voltage 300-1000V',
      'peak efficiency of 96%',
      'supports customization and seamless upgrades by adding additional power modules',
      'Compatible with all EVs in the market and meet future demands',
    ],
  },
  'interstellar-ac-charger': {
    points: [
      '7kW/ 11kW / 22kW three power rating configurations',
      'IP65 dustproof and waterproof technology',
      'Charge an electric vehicle up to 3 times faster than a conventional 3-pin plug',
      'DLM is a system to supervise and manage electricity distribution',
    ],
  },
  'mira-ac-charger': {
    lede: 1,
    points: [
      '7kW level 2 AC charger, with 32A output(single phase)',
      'Compatible with all electric vehicles and plug-in hybrid vehicles',
      'Schedule the charging to charge your EV at off-peak hours and save electricity costs',
    ],
  },
  'ser-series': {
    points: [
      'Peak efficiency ≥96%',
      'supporting hot plug',
      'Support remote fault detection and recovery',
      '20kW Power module can be applied to DC Charger or AC/DC Power Cabinet',
    ],
  },
  'ser-series-40kw-power-module': {
    points: [
      '3rd Generation SiC Mosfet',
      'Support CCS1, CCS2, CHAdeMO, GB/T and energy storage system',
      'High current output of 133A',
      'replace or install power modules without having a shut down',
    ],
  },
};
