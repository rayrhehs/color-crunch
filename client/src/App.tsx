import { useState, createContext } from "react";
// import axios from "axios";
import Board from "./components/Board/Board";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/HomePage/HomePage";
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
            {selectedImage ? (
              <div className="min-h-screen max-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden gap-4">
                <Board></Board>
                <Sidebar></Sidebar>
              </div>
            ) : (
              <HomePage></HomePage>
            )}
          </GeneratedImageContext.Provider>
        </SelectedImageContext.Provider>
      </ImagePropsContext.Provider>
    </div>
  );
}

export default App;
