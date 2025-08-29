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
    <div className="w-screen">
      <SelectedImageContext.Provider
        value={{ selectedImage, setSelectedImage }}
      >
        {selectedImage ? (
          <div className="min-h-screen max-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden gap-4">
            <Board></Board>
            <Sidebar></Sidebar>
          </div>
        ) : (
          <HomePage></HomePage>
        )}
      </SelectedImageContext.Provider>
    </div>
  );
}

export default App;
