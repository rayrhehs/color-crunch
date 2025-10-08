import { useState, createContext } from "react";
import Board from "./components/Board/Board";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/HomePage/HomePage";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

type ImageContextType = {
  selectedImage: Blob | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<Blob | null>>;
};

type GeneratedImageContextType = {
  generatedImage: Blob | null;
  setGeneratedImage: React.Dispatch<React.SetStateAction<Blob | null>>;
};

type Color = { r: number; g: number; b: number };

interface ImagePropsTypes {
  name: string;
  height: number;
  width: number;
  size: number;
  pixels: number;
  time: number;
  palette: Color[];
  commonColor: number[];
  contrastedColor: number[];
}

interface ImagePropsContextType {
  imageProps: ImagePropsTypes;
  setImageProps: React.Dispatch<React.SetStateAction<ImagePropsTypes>>;
}

export const SelectedImageContext = createContext<ImageContextType | null>(
  null
);

export const GeneratedImageContext =
  createContext<GeneratedImageContextType | null>(null);

export const ImagePropsContext = createContext<
  ImagePropsContextType | undefined
>(undefined);

function App() {
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [generatedImage, setGeneratedImage] = useState<Blob | null>(null);
  const [imageProps, setImageProps] = useState<ImagePropsTypes>({
    name: "",
    height: 0,
    width: 0,
    size: 0,
    pixels: 0,
    time: 0,
    palette: [],
    commonColor: [255, 255, 255],
    contrastedColor: [0, 0, 0],
  });

  return (
    <div className="w-screen">
      <ImagePropsContext.Provider value={{ imageProps, setImageProps }}>
        <SelectedImageContext.Provider
          value={{ selectedImage, setSelectedImage }}
        >
          <GeneratedImageContext.Provider
            value={{ generatedImage, setGeneratedImage }}
          >
            <AnimatePresence mode="wait">
              {selectedImage ? (
                <motion.div
                  key="board-view"
                  initial={{ x: "100%" }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{
                    x: {
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      mass: 0.8,
                    },
                    opacity: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  className="min-h-screen max-h-screen bg-[var(--common-color)] flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden gap-4 transition-colors duration-250 ease-in-out"
                  style={
                    {
                      "--common-color": `rgb(${imageProps.commonColor.join(
                        ","
                      )})`,
                      "--contrasted-color": `rgb(${imageProps.contrastedColor.join(
                        ","
                      )})`,
                    } as React.CSSProperties
                  }
                >
                  <motion.div
                    className="flex justify-center gap-4 w-full max-h-[80vh]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <Board></Board>
                    <Sidebar></Sidebar>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="homepage"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.8,
                  }}
                >
                  <HomePage></HomePage>
                </motion.div>
              )}
            </AnimatePresence>
          </GeneratedImageContext.Provider>
        </SelectedImageContext.Provider>
      </ImagePropsContext.Provider>
    </div>
  );
}

export default App;
