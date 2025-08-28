import type React from "react";

import { useContext } from "react";
import { SelectedImageContext } from "@/App";

function HomePage() {
  const imageContext = useContext(SelectedImageContext);

  // check to see if null -> by doing this, typescript will not complain!
  if (!imageContext) {
    throw new Error("ImageContext must be used within a ImageContext.Provider");
  }

  const { selectedImage, setSelectedImage } = imageContext;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        alert("File size must be less than 15MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a JPG, PNG, or GIF file");
        return;
      }

      setSelectedImage(file);

      console.log("[v0] File selected:", file.name, file.size, file.type);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xs sm:max-w-md lg:max-w-lg mx-auto text-center">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 relative">
          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-light text-gray-800 mb-4 text-balance leading-tight">
            WELCOME
            <br />
            TO
          </h1>

          <div className="inline-block transform rotate-12 bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
            <div className="font-bold text-base sm:text-lg tracking-wider">
              COLORCRUNCH
            </div>
            <div className="text-xs opacity-90">made by shehryar</div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Hidden file input */}
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileChange}
          />

          {/* Styled upload button */}
          <div className="w-fit border-3 sm:border-4 border-black p-1 sm:p-1 flex justify-self-center">
            <label
              htmlFor="file-upload"
              className="w-fit bg-black text-white py-3 px-4 sm:py-6 sm:px-8 cursor-pointer hover:bg-gray-900 transition-colors duration-200 focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2"
            >
              <span className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wider">
                UPLOAD IMAGE
              </span>
            </label>
          </div>

          {/* Support text */}
          <p className="text-gray-500 text-xs sm:text-sm px-2">
            supports JPG, PNG, GIF up to 15MB
          </p>

          {/* Selected file display */}
          {selectedImage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm">
                Selected: {selectedImage.name} (
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
