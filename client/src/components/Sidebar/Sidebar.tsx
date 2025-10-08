import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import palettes from "./palettes.json";
import {
  SelectedImageContext,
  GeneratedImageContext,
  ImagePropsContext,
} from "@/App";

function Sidebar() {
  const selectedImageContext = useContext(SelectedImageContext);
  const generatedImageContext = useContext(GeneratedImageContext);
  const imagePropsContext = useContext(ImagePropsContext);

  if (!selectedImageContext) {
    throw new Error(
      "ImageContext must be used within an ImageContext.Provider"
    );
  }

  if (!generatedImageContext) {
    throw new Error(
      "GeneratedImageContext must be used within a GeneratedImageContext.Provider"
    );
  }

  if (!imagePropsContext) {
    throw new Error(
      "ImagePropsContext must be within an ImagePropsContext.Provider"
    );
  }

  const { selectedImage } = selectedImageContext;
  const { generatedImage, setGeneratedImage } = generatedImageContext;
  const { imageProps, setImageProps } = imagePropsContext;

  const paletteValues = [2, 4, 8, 12, 16];
  const [paletteIndex, setPaletteIndex] = useState<number>(2); // note: 2 is not the palette size, it is index pointing to palette size = 8

  const currentPaletteSize = paletteValues[paletteIndex];

  const [theme, setTheme] = useState<string>("red"); // use this for selecting the current theme during button creation

  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

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

  const handleGenerate = () => {
    startTimeRef.current = performance.now();
    setElapsedTime(0);
    setIsGenerating(true);

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedTime(performance.now() - startTimeRef.current);
      }
    }, 10); // updates every 10ms
  };

  useEffect(() => {
    if (generatedImage !== undefined && startTimeRef.current !== null) {
      // Stop the timer
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }

      // Record final elapsed time
      const total = performance.now() - startTimeRef.current;
      setElapsedTime(total);

      setIsGenerating(false);
    }
  }, [generatedImage]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const getStats = () => {
    if (!selectedImage) {
      console.error("No image selected!");
      return;
    }

    handleGenerate();
    const formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("theme", theme);
    formData.append("paletteSize", currentPaletteSize.toString());

    axios
      .post("http://127.0.0.1:5000/generate-modified", formData, {
        responseType: "json",
      })
      .then((response) => {
        const imageData = response.data;
        setGeneratedImage(base64ToBlob(imageData.data, imageData.mime));
        setImageProps((prev) => ({
          ...prev,
          name: imageData.filename,
          palette: imageData.palette,
          commonColor: imageData.most_common_color,
          contrastedColor: imageData.contrasted_color,
        }));
        console.log(imageData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-[var(--contrasted-color)] text-white">
          <div className="bg-[var(--contrasted-color)] text-[var(--common-color)] px-4 py-2 font-bold text-base md:text-lg">
            INFO
          </div>
          <div className="bg-[var(--common-color)] border-4 border-[var(--contrasted-color)] text-[var(--contrasted-color)] p-3 md:p-4 space-y-1 text-xs sm:text-sm font-mono">
            <div>{imageProps.name}</div>
            <div>{imageProps.size} kb</div>
            <div>
              <p> {imageProps.pixels} pixels</p>
            </div>
            <div>GENERATED IN {(elapsedTime / 1000).toFixed(2)} SECONDS</div>
          </div>
        </div>

        <div className="bg-[var(--contrasted-color)] text-white">
          <div className="bg-[var(--contrasted-color)] text-[var(--common-color)] px-4 py-2 font-bold text-base md:text-lg">
            THEMES
          </div>
          <div className="bg-[var(--common-color)] p-3 md:p-4 space-y-3 border-4 border-[var(--contrasted-color)] text-[var(--contrasted-color)]">
            <div className="space-y-2 cursor-pointer">
              {visiblePalettes.map(([name, colors]) => (
                <button
                  data-theme={name}
                  key={name}
                  className="flex h-6 sm:h-8 w-full transition-all duration-200 hover:scale-[1.02] border-3 border-[var(--contrasted-color)] cursor-pointer"
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

            <div className="flex gap-2">
              <Button
                onClick={handlePrevTheme}
                className="flex-1 rounded-none bg-[var(--contrasted-color)] text-[var(--common-color)] border-4 border-transparent hover:border-4 hover:text-[var(--contrasted-color)] hover:border-[var(--contrasted-color)] h-6 sm:h-8 cursor-pointer"
                size="sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={handleNextTheme}
                className="flex-1 rounded-none bg-[var(--contrasted-color)] text-[var(--common-color)] border-4 border-transparent hover:border-4 hover:text-[var(--contrasted-color)] hover:border-[var(--contrasted-color)] h-6 sm:h-8 cursor-pointer"
                size="sm"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--contrasted-color)] text-[var(--common-color)]">
          <div className="bg-[var(--contrasted-color)] text-[var(--common-color)] px-4 py-2 font-bold text-base md:text-lg">
            PALETTE SIZE
          </div>
          <div className="bg-[var(--common-color)] p-2 md:p-4 border-4 border-[var(--contrasted-color)]">
            <div className="space-y-3 md:space-y-4">
              <div className="flex px-1 justify-between text-[var(--contrasted-color)] font-mono text-xs sm:text-sm">
                <span>2</span>
                <span className="pl-2.5">4</span>
                <span className="pl-3">8</span>
                <span className="pl-2">12</span>
                <span>16</span>
              </div>

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

        <Button
          className="w-full rounded-none bg-[var(--contrasted-color)] text-[var(--common-color)] cursor-pointer border-4 border-transparent hover:border-4 hover:text-[var(--contrasted-color)] hover:border-[var(--contrasted-color)] h-12 sm:h-16 text-lg sm:text-xl font-bold"
          onClick={getStats}
          disabled={isGenerating}
        >
          {isGenerating ? "GENERATING" : "GENERATE"}
        </Button>
        {/* <p className="text-[var(--contrasted-color)]">
          {isGenerating
            ? `GENERATED IN ${(elapsedTime / 1000).toFixed(2)} SECONDS`
            : null}
        </p> */}
      </div>
    </>
  );
}

export default Sidebar;
