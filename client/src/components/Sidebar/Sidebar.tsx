import axios from "axios";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import palettes from "./palettes.json";
import { SelectedImageContext, GeneratedImageContext } from "@/App";

function Sidebar() {
  const imageContext = useContext(SelectedImageContext);
  const generatedImageContext = useContext(GeneratedImageContext);

  if (!imageContext) {
    throw new Error("ImageContext must be used within a ImageContext.Provider");
  }

  if (!generatedImageContext) {
    throw new Error(
      "GeneratedImageContext must be used within a GeneratedImageContext.Provider"
    );
  }

  const { selectedImage } = imageContext;
  const { setGeneratedImage } = generatedImageContext;

  const paletteValues = [2, 4, 8, 12, 16];
  const [paletteIndex, setPaletteIndex] = useState<number>(2); // note: 2 is not the palette size, it is index pointing to palette size = 8

  const currentPaletteSize = paletteValues[paletteIndex];

  const [theme, setTheme] = useState<string>("red"); // use this for selecting the current theme during button creation

  const [startIndex, setStartIndex] = useState<number>(0);
  const paletteEntries = Object.entries(palettes);
  const ITEMS_PER_PAGE = 3;

  const handleNextTheme = () => {
    setStartIndex((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, paletteEntries.length - ITEMS_PER_PAGE)
    );
    console.log(paletteEntries);
  };

  const handlePrevTheme = () => {
    setStartIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  // onClick -> change selected theme
  const changeSelectedTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const theme = e.currentTarget.dataset.theme;
    if (theme) {
      setTheme(theme);
      console.log(theme);
    }
  };

  const visiblePalettes = paletteEntries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function base64ToBlob(base64: string, mime: string): Blob {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const getStats = () => {
    if (!selectedImage) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("theme", theme);
    formData.append("paletteSize", currentPaletteSize.toString());

    axios
      .post("http://127.0.0.1:5000/generate-modified", formData, {
        responseType: "json",
      })
      .then((response) => {
        setGeneratedImage(base64ToBlob(response.data.data, response.data.mime));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const paletteSizeDefiner = () => {
  //   console.log(paletteIndex);
  //   console.log(currentPaletteSize);
  // };

  return (
    <>
      {/* INFO Section */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-2 sm:space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
        <div className="bg-black text-white">
          <div className="bg-black text-white px-4 py-2 font-bold text-base md:text-lg">
            INFO
          </div>
          <div className="bg-white border-4 border-black text-black p-3 md:p-4 space-y-1 text-xs sm:text-sm font-mono">
            <div>sourcefile.png</div>
            <div>250 kb</div>
            <div>2985736235 pixels</div>
          </div>
        </div>

        {/* THEMES Section */}
        <div className="bg-black text-white">
          <div className="bg-black text-white px-4 py-2 font-bold text-base md:text-lg">
            THEMES
          </div>
          <div className="bg-white p-3 md:p-4 space-y-3 border-4 border-black">
            <div className="space-y-2 cursor-pointer">
              {visiblePalettes.map(([name, colors]) => (
                <button
                  data-theme={name}
                  key={name}
                  className="flex h-6 sm:h-8 w-full transition-all duration-200 hover:scale-[1.02] border-2 border-black cursor-pointer"
                  onClick={changeSelectedTheme}
                >
                  {colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1"
                      style={{ backgroundColor: `rgb(${color.join(", ")})` }}
                    />
                  ))}
                </button>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-2">
              <Button
                onClick={handlePrevTheme}
                className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 h-6 sm:h-8 cursor-pointer"
                size="sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={handleNextTheme}
                className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 h-6 sm:h-8 cursor-pointer"
                size="sm"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* PALETTE SIZE Section */}
        <div className="bg-black text-white">
          <div className="bg-black text-white px-4 py-2 font-bold text-base md:text-lg">
            PALETTE SIZE
          </div>
          <div className="bg-white p-2 md:p-4 border-4 border-black">
            <div className="space-y-3 md:space-y-4">
              {/* Size labels */}
              <div className="flex px-1 justify-between text-black font-mono text-xs sm:text-sm">
                <span>2</span>
                <span className="pl-2.5">4</span>
                <span className="pl-3">8</span>
                <span className="pl-2">12</span>
                <span>16</span>
              </div>

              {/* Slider */}
              <div>
                <Slider
                  value={[paletteIndex]} // this has to be turned into an array because that is the way sliders work
                  onValueChange={(index) => setPaletteIndex(index[0])}
                  max={4}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GENERATE Button */}
        <Button
          className="w-full rounded-none bg-black text-white hover:bg-gray-800 h-12 sm:h-16 text-lg sm:text-xl font-bold"
          onClick={getStats}
        >
          GENERATE
        </Button>
      </div>
    </>
  );
}

export default Sidebar;
