import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const oAuthTypes = [
  {
    name: "Google",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_6_18758)">
          <path
            d="M15.04 8.1665C15.04 7.6465 14.9933 7.1465 14.9067 6.6665H8V9.5065H11.9467C11.7733 10.4198 11.2533 11.1932 10.4733 11.7132V13.5598H12.8533C14.24 12.2798 15.04 10.3998 15.04 8.1665Z"
            fill="#4285F4"
          />
          <path
            d="M7.99979 15.3332C9.97979 15.3332 11.6398 14.6799 12.8531 13.5599L10.4731 11.7132C9.81979 12.1532 8.98646 12.4199 7.99979 12.4199C6.09312 12.4199 4.47313 11.1332 3.89313 9.3999H1.45312V11.2932C2.65979 13.6866 5.13312 15.3332 7.99979 15.3332Z"
            fill="#34A853"
          />
          <path
            d="M3.89317 9.39338C3.7465 8.95338 3.65984 8.48671 3.65984 8.00005C3.65984 7.51338 3.7465 7.04671 3.89317 6.60671V4.71338H1.45317C0.953171 5.70005 0.666504 6.81338 0.666504 8.00005C0.666504 9.18671 0.953171 10.3 1.45317 11.2867L3.35317 9.80671L3.89317 9.39338Z"
            fill="#FBBC05"
          />
          <path
            d="M7.99979 3.5865C9.07979 3.5865 10.0398 3.95984 10.8065 4.67984L12.9065 2.57984C11.6331 1.39317 9.97979 0.666504 7.99979 0.666504C5.13312 0.666504 2.65979 2.31317 1.45312 4.71317L3.89313 6.6065C4.47313 4.87317 6.09312 3.5865 7.99979 3.5865Z"
            fill="#EA4335"
          />
        </g>
        <defs>
          <clipPath id="clip0_6_18758">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    strategy: "oauth_google",
  },
  {
    name: "Microsoft",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_62_2909)">
          <path d="M0 0H7.61905V7.61905H0V0Z" fill="#F35325" />
          <path d="M8.3811 0H16.0002V7.61905H8.3811V0Z" fill="#81BC06" />
          <path d="M0 8.38086H7.61905V15.9999H0V8.38086Z" fill="#05A6F0" />
          <path
            d="M8.3811 8.38086H16.0002V15.9999H8.3811V8.38086Z"
            fill="#FFBA08"
          />
        </g>
        <defs>
          <clipPath id="clip0_62_2909">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    strategy: "oauth_microsoft",
  },
];

const OAuthSignIn = () => {
  const navigate = useNavigate();
  const [error, setError] = "";

  return (
    <div className="grid w-full grid-cols-2 gap-2 mt-6 mb-4 ">
      {oAuthTypes.map((type) => (
        <button
          key={type.strategy}
          className="flex items-center justify-center font-semibold gap-1 w-full h-[36px] px-3 py-2 text-sm transition duration-150 bg-white border rounded-md border-[#D1D1D6] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 "
          onClick={() => handleSignIn(type.strategy)}
        >
          {type.icon}
          {type.name}
        </button>
      ))}
    </div>
  );
};

export default OAuthSignIn;
