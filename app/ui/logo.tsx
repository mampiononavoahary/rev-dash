
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            delay: 2,
            duration: 0.4,
            ease: "easeIn",
          },
        }}
        style={{
          position: "relative",
          width: "15vw",
          height: "15vw",
          maxWidth: "120px",
          maxHeight: "120px",
        }}
      >
        {/** Cercle SVG */}
        <motion.svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          fill="transparent"
          viewBox="0 0 506 506"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="253"
            cy="253"
            r="250"
            stroke="#FFC107"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: "24 10 0 0" }}
          />
        </motion.svg>

        {/** Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 2.4,
              duration: 0.4,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src="/micollecte.png"
            priority
            width={150}
            height={150}
            quality={100}
            style={{ objectFit: "cover" }}
            alt="Photo"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Logo;

