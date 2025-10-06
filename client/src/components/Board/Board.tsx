import { useState, useEffect, useContext } from "react";
import {
  SelectedImageContext,
  GeneratedImageContext,
  ImagePropsContext,
} from "@/App";

function Board() {
  const selectedImageContext = useContext(SelectedImageContext);
  const generatedImageContext = useContext(GeneratedImageContext);
  // const imagePropsContext = useContext(ImagePropsContext);

  // check to see if null -> by doing this, typescript will not complain!
  if (!selectedImageContext) {
    throw new Error("ImageContext must be used within a ImageContext.Provider");
  }

  if (!generatedImageContext) {
    throw new Error(
      "GeneratedImage must be within a GeneratedImageContext.Provider"
    );
  }

  // ts was complaining that in case ImagePropsContext is undefined
  // to fix this I check at run-time that if !context == undefined => throw error otherwise, keep moving
  function useImagePropsContext() {
    const context = useContext(ImagePropsContext);
    if (!context) {
      throw new Error(
        "useImagePropsContext must be used within an ImagePropsContext.Provider"
      );
    }
    return context;
  }

  const { selectedImage } = selectedImageContext;
  const { generatedImage } = generatedImageContext;
  const { imageProps, setImageProps } = useImagePropsContext();
  const currentImage = generatedImage ?? selectedImage ?? null;

  useEffect(() => {
    if (!currentImage) return;

    const img = new Image();
    img.onload = () => {
      setImageProps((prev) => ({
        ...prev,
        height: img.naturalHeight,
        width: img.naturalWidth,
        size: currentImage.size,
        pixels: img.naturalHeight * img.naturalWidth,
      }));

      // free memory
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(currentImage);
  }, [currentImage, setImageProps]);

  return (
    <div className="flex flex-col md:flex-row gap-2 sm:gap-4 h-full max-w-6xl max-h-full">
      <div className="w-full md:flex-1 flex-shrink-0">
        <div
          className="border-4 border-black bg-white h-full flex -center"
          style={{
            borderColor: imageProps.contrastedColor
              ? `rgb(${imageProps.contrastedColor.join(",")})`
              : "#000000ff",
          }}
        >
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
