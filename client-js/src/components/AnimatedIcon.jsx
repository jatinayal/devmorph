import React from "react";

const AnimatedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="64"
      height="64"
      className="text-white overflow-visible"
    >
      <style>
        {`
        /* Arrows animation */
        .arrow-left {
          animation: leftArrow 0.8s ease-out forwards;
        }

        .arrow-right {
          animation: rightArrow 0.8s ease-out forwards;
        }

        /* Star animation */
        .star {
          opacity: 0;
          transform-origin: center;
          animation: starPop 0.5s ease-out forwards;
          animation-delay: 0.8s;
        }

        @keyframes leftArrow {
          from {
            transform: translate(6px, 10px);
            opacity: 0;
          }
          to {
            transform: translate(0, 0);
            opacity: 1;
          }
        }

        @keyframes rightArrow {
          from {
            transform: translate(-6px, 10px);
            opacity: 0;
          }
          to {
            transform: translate(0, 0);
            opacity: 1;
          }
        }

        @keyframes starPop {
          from {
            transform: scale(0.3);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        `}
      </style>

      {/* STAR */}
      <g className="star">
        <path
          fill="currentColor"
          d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251"
        />
      </g>

      {/* LEFT ARROW */}
      <g className="arrow-left">
        <path
          fill="currentColor"
          d="M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757z"
        />
      </g>

      {/* RIGHT ARROW */}
      <g className="arrow-right">
        <path
          fill="currentColor"
          d="M18.343 17.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z"
        />
      </g>
    </svg>
  );
};

export default AnimatedIcon;
