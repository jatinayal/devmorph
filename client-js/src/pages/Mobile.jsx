import React from "react";

const Mobile = () => {
  return (
    <div className="fixed inset-0 z-51 flex flex-col items-center justify-center bg-white md:hidden">
      
      {/* SVG Animation */}
      <div className="w-48 h-40">
        <svg
          viewBox="0 0 200 160"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <style>{`
            .draw-line {
              fill: none;
              stroke: #222;
              stroke-width: 3;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: 600;
              stroke-dashoffset: 600;
              animation: drawIcon 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            @keyframes drawIcon {
              0% {
                stroke-dashoffset: 600;
              }
              65% {
                stroke-dashoffset: 0;
              }
              85% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: 600;
              }
            }
          `}</style>

          <path
            className="draw-line"
            d="
              M 100 150
              L 100 120
              L 40 120
              L 40 50
              L 160 50
              L 160 120
              L 100 120
              L 100 135
              L 70 135
              M 100 135
              L 130 135
            "
          />
        </svg>
      </div>

      {/* Text */}
      <p className="mt-6 text-center text-gray-700 text-sm px-6 max-w-xs">
        This experience is not available on mobile devices.
        <br />
        Please open on a desktop or larger screen.
      </p>
    </div>
  );
};

export default Mobile;
