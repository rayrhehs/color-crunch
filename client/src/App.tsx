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

export const SelectedImageContext = createContext<ImageContextType | null>(
  null
);

export const GeneratedImageContext =
  createContext<GeneratedImageContextType | null>(null);

function App() {
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [generatedImage, setGeneratedImage] = useState<Blob | null>(null);

  return (
    <div className="w-screen">
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
    </div>
  );
}

export default App;
