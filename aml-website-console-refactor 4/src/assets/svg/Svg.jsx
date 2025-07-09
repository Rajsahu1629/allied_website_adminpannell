import { motion, AnimatePresence } from "framer-motion";


const BellIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-red-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
    transition={{ duration: 0.5 }}
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </motion.svg>
);

export {BellIcon}