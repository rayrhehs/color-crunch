import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SelectedImageContext } from "@/App";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Board() {
  const imageContext = useContext(SelectedImageContext);

  // check to see if null -> by doing this, typescript will not complain!
  if (!imageContext) {
    throw new Error("ImageContext must be used within a ImageContext.Provider");
  }

  const { selectedImage } = imageContext;

  return (
    <div className="flex flex-col md:flex-row gap-2 sm:gap-4 h-full max-w-6xl max-h-full">
      {/* Image Section */}
      <div className="w-full md:flex-1 flex-shrink-0">
        <div className="border-4 border-black bg-white p-2 h-full flex -center">
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
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
