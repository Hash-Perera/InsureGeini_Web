import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4 ">
      <h1 className="text-4xl font-semibold">Dashboard</h1>
      <Steps />
    </div>
  );
};

export default Dashboard;

const FraudeGif = () => {
  return (
    <img src="/lottieFiles/fraude.gif" alt="fraude" className=" size-16" />
  );
};

const DamageGif = () => {
  return (
    <img src="/lottieFiles/damage.gif" alt="damage" className=" size-16" />
  );
};

const PolicyGif = () => {
  return (
    <img src="/lottieFiles/policy.gif" alt="policy" className=" size-16" />
  );
};

const steps = [
  {
    icon: DamageGif,
    title: "Damage Detection",
    description: "Detecting damage parts and estimating the damage",
  },
  {
    icon: FraudeGif,
    title: "Fraud Detection",
    description: "Detecting fraudulent activities ",
  },
  {
    icon: PolicyGif,
    title: "Policy Mapping",
    description: "Generating Incident Profile and Mapping the policy",
  },
];

const Steps = () => {
  return (
    <div className="px-4  sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Current Process
          </h2>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center text-white rounded-full bg-gradient-to-r from-blue-200 to-blue-400 size-28">
                    <step.icon className=" size-16" />
                  </div>
                  <div className="flex flex-col justify-center mt-2 px-1.5 rounded-xl min-w-[377px] bg-gray-50">
                    <h3 className="mt-6 text-lg font-medium text-center text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-center text-gray-600">
                      {step.description}
                    </p>
                    <p className="flex items-center justify-center gap-2 mt-2 text-xs text-center ">
                      <span>Current Process in : </span>
                      <span className="font-semibold text-blue-600 ">
                        60d0fe4f5311236168a109cb{" "}
                      </span>
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute hidden w-12 transform translate-x-4 lg:block top-12 left-full">
                    <div className="h-0.5 w-full  bg-black" />
                    <div className="absolute right-0 transform translate-x-1/2 -translate-y-1/2 top-1/2">
                      <img
                        src="/lottieFiles/arraow.gif"
                        alt="arrow"
                        className=""
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
