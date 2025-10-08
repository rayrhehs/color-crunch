import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
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

  const { selectedImage, setSelectedImage } = selectedImageContext;
  const { generatedImage, setGeneratedImage } = generatedImageContext;
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

  const returnToHomePage = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <Button
          className="rounded-none bg-[var(--contrasted-color)] text-[var(--common-color)] cursor-pointer border-4 border-transparent hover:border-4 hover:text-[var(--contrasted-color)] hover:border-[var(--contrasted-color)] h-12 sm:h-16 text-lg sm:text-xl font-bold"
          onClick={returnToHomePage}
        >
          BACK
        </Button>
      </div>
      <div className="flex items-center justify-center">
        {currentImage && (
          <img
            src={URL.createObjectURL(currentImage)}
            alt="Image Placeholder"
            className="h-[600px] w-full object-contain border-4 border-black bg-white"
            style={{
              borderColor: imageProps.contrastedColor
                ? `rgb(${imageProps.contrastedColor.join(",")})`
                : "#000000ff",
            }}
          />
        )}
      </div>
    </>
  );
}

export default Board;
