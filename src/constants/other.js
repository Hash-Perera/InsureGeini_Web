export const obdCodes = [
  {
    code: "P0016",
    codeDescription:
      "Crankshaft Position Camshaft Position Correlation Bank 2 Sensor A",
    possibleResult: "Incorrect timing could cause engine misfires or stalling.",
  },
  {
    code: "P0017",
    codeDescription:
      "Crankshaft Position Camshaft Position Correlation Bank 2 Sensor B",
    possibleResult: "Similar to P0016, leading to loss of engine power.",
  },
  {
    code: "P0101",
    codeDescription:
      "Mass or Volume Air Flow Circuit Range/Performance Problem",
    possibleResult:
      "Poor air-fuel mixture may cause engine hesitation or sudden loss of power.",
  },
  {
    code: "P0107",
    codeDescription:
      "Manifold Absolute Pressure/Barometric Pressure Circuit Low Input",
    possibleResult:
      "Incorrect pressure readings can cause fuel mixture issues, affecting acceleration.",
  },
  {
    code: "P0113",
    codeDescription: "Intake Air Temperature Circuit High Input",
    possibleResult:
      "Faulty readings may cause incorrect fuel injection, leading to rough idling or stalling.",
  },
  {
    code: "P0121",
    codeDescription:
      "Throttle/Pedal Position Sensor/Switch A Circuit Range/Performance Problem",
    possibleResult:
      "Erratic throttle response may lead to sudden acceleration or power loss.",
  },
  {
    code: "P0122",
    codeDescription:
      "Throttle/Pedal Position Sensor/Switch A Circuit Low Input",
    possibleResult:
      "Can cause unpredictable throttle response, leading to loss of control.",
  },
  {
    code: "P0171",
    codeDescription: "System Too Lean (Bank 2)",
    possibleResult:
      "Can cause misfires, hesitation, and potential loss of power.",
  },
  {
    code: "P0172",
    codeDescription: "System Too Rich (Bank 2)",
    possibleResult:
      "Excessive fuel could lead to engine flooding and stalling.",
  },
  {
    code: "P0193",
    codeDescription: "Fuel Rail Pressure Sensor Circuit High Input",
    possibleResult:
      "Incorrect fuel pressure can cause sudden acceleration or stalling.",
  },
  {
    code: "P0220",
    codeDescription:
      "Throttle/Pedal Position Sensor/Switch B Circuit Malfunction",
    possibleResult: "Causes unpredictable acceleration or deceleration.",
  },
  {
    code: "P0221",
    codeDescription:
      "Throttle/Pedal Position Sensor/Switch B Circuit Range/Performance Problem",
    possibleResult:
      "Inaccurate readings may result in unexpected vehicle movements.",
  },
  {
    code: "P0300",
    codeDescription: "Random/Multiple Cylinder Misfire Detected",
    possibleResult:
      "Engine misfires could cause sudden power loss, making driving unsafe.",
  },
  {
    code: "P0301",
    codeDescription: "Cylinder 1 Misfire Detected",
    possibleResult:
      "A misfire in a specific cylinder could cause vibrations and engine instability.",
  },
  {
    code: "P0302",
    codeDescription: "Cylinder 2 Misfire Detected",
    possibleResult: "Leads to loss of power and rough idling.",
  },
  {
    code: "P0303",
    codeDescription: "Cylinder 3 Misfire Detected",
    possibleResult:
      "Can make the engine unresponsive, leading to dangerous situations.",
  },
  {
    code: "P0321",
    codeDescription:
      "Ignition/Distributor Engine Speed Input Circuit Range/Performance",
    possibleResult:
      "Affecting RPM readings, leading to sudden power loss or excessive acceleration.",
  },
  {
    code: "P0322",
    codeDescription:
      "Ignition/Distributor Engine Speed Input Circuit No Signal",
    possibleResult: "Engine may stall unexpectedly, increasing accident risk.",
  },
  {
    code: "P0335",
    codeDescription: "Crankshaft Position Sensor A Circuit Malfunction",
    possibleResult: "Causes misfiring or stalling, especially at high speeds.",
  },
  {
    code: "P0340",
    codeDescription: "Camshaft Position Sensor Circuit Malfunction",
    possibleResult:
      "Can lead to incorrect ignition timing and possible engine shutdown.",
  },
  {
    code: "P0400",
    codeDescription: "Exhaust Gas Recirculation Flow Malfunction",
    possibleResult:
      "May lead to performance loss, poor acceleration, and rough idling.",
  },
  {
    code: "P0420",
    codeDescription: "Catalyst System Efficiency Below Threshold (Bank 1)",
    possibleResult:
      "A clogged catalytic converter could cause power loss and overheating.",
  },
  {
    code: "P0430",
    codeDescription: "Catalyst System Efficiency Below Threshold (Bank 2)",
    possibleResult:
      "Similar to P0420, affecting performance and potentially stalling the vehicle.",
  },
  {
    code: "P0442",
    codeDescription:
      "Evaporative Emission Control System Leak Detected (small leak)",
    possibleResult:
      "Fuel vapor leaks may cause an unsafe environment inside the vehicle.",
  },
  {
    code: "P0460",
    codeDescription: "Fuel Level Sensor Circuit Malfunction",
    possibleResult:
      "Incorrect fuel readings could cause the driver to run out of fuel unexpectedly.",
  },
  {
    code: "P0470",
    codeDescription: "Exhaust Pressure Sensor Malfunction",
    possibleResult:
      "Incorrect readings may lead to turbo failures or excessive backpressure.",
  },
  {
    code: "P0480",
    codeDescription: "Cooling Fan 1 Control Circuit Malfunction",
    possibleResult: "Could cause engine overheating and breakdown.",
  },
  {
    code: "P0500",
    codeDescription: "Vehicle Speed Sensor Malfunction",
    possibleResult:
      "May cause speedometer failure and incorrect speed control.",
  },
  {
    code: "P0505",
    codeDescription: "Idle Control System Malfunction",
    possibleResult:
      "Could lead to engine stalling, especially in stop-and-go traffic.",
  },
  {
    code: "P0513",
    codeDescription: "Incorrect Immobilizer Key",
    possibleResult:
      "Prevents engine start, potentially stranding the driver in unsafe locations.",
  },
  {
    code: "P0520",
    codeDescription: "Engine Oil Pressure Sensor/Switch Circuit Malfunction",
    possibleResult:
      "Incorrect readings can lead to engine damage and sudden failures.",
  },
  {
    code: "P0562",
    codeDescription: "System Voltage Low",
    possibleResult: "Low voltage may cause power steering and braking issues.",
  },
  {
    code: "P0563",
    codeDescription: "System Voltage High",
    possibleResult:
      "High voltage can cause electrical malfunctions, including brake and steering failure.",
  },
  {
    code: "P0571",
    codeDescription: "Cruise Control/Brake Switch A Circuit Malfunction",
    possibleResult:
      "May cause unresponsive braking while cruise control is active.",
  },
  {
    code: "P0606",
    codeDescription: "ECM/PCM Processor Fault",
    possibleResult:
      "A failing ECU can cause multiple electronic failures in a vehicle.",
  },
  {
    code: "P0700",
    codeDescription: "Transmission Control System Malfunction",
    possibleResult:
      "May cause erratic shifting, loss of power, or sudden stops.",
  },
];
