import { useState, useEffect, useContext } from "react";
import { SelectedImageContext, GeneratedImageContext } from "@/App";

function Board() {
  const imageContext = useContext(SelectedImageContext);
  const generatedImageContext = useContext(GeneratedImageContext);

  // check to see if null -> by doing this, typescript will not complain!
  if (!imageContext) {
    throw new Error("ImageContext must be used within a ImageContext.Provider");
  }

  if (!generatedImageContext) {
    throw new Error(
      "GeneratedImage must be within a GeneratedImageContext.Provider"
    );
  }

  const { selectedImage } = imageContext;
  const { generatedImage } = generatedImageContext;
  const currentImage = generatedImage ?? selectedImage ?? null;

  return (
    <div className="flex flex-col md:flex-row gap-2 sm:gap-4 h-full max-w-6xl max-h-full">
      <div className="w-full md:flex-1 flex-shrink-0">
        <div className="border-4 border-black bg-white p-2 h-full flex -center">
          {currentImage && (
            <img
              src={URL.createObjectURL(currentImage)}
              alt="Portrait placeholder"
              className="w-full h-[40vh] sm:h-[50vh] md:h-[70vh] max-h-[600px] object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
