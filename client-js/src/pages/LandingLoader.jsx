import React, { useEffect, useState } from "react";
import AnimatedIcon from "../components/AnimatedIcon";

const LandingLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setVisible(true);

      // duration = animation time
      const timer = setTimeout(() => {
        setVisible(false);
        localStorage.setItem("hasVisited", "true");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
   <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-fadeOut">

      <AnimatedIcon />
    </div>
  );
};

export default LandingLoader;
