import { useState, createContext } from "react";
// import axios from "axios";
import Board from "./components/Board/Board";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/Homepage/HomePage";
import "./App.css";

type ImageContextType = {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
};

export const SelectedImageContext = createContext<ImageContextType | null>(
  null
);

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <>
      <SelectedImageContext.Provider
        value={{ selectedImage, setSelectedImage }}
      >
        {selectedImage ? (
          <div className="w-full md:w-80 flex-shrink-0 space-y-2 sm:space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
            <Board></Board>
            <Sidebar></Sidebar>
          </div>
        ) : (
          <HomePage></HomePage>
        )}
      </SelectedImageContext.Provider>
    </>
  );
}

export default App;
