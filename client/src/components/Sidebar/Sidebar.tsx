import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import palettes from "./palettes.json";

function Sidebar() {
  const [uploadedImage, setUploadedImage] = useState();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(
    undefined
  );
  const [paletteSize, setPaletteSize] = useState([8]);
  const [currentTheme, setCurrentTheme] = useState(0);

  const nextTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % palettes.length);
  };

  const prevTheme = () => {
    setCurrentTheme((prev) => (prev - 1 + palettes.length) % palettes.length);
  };

  // get image from user
  const getImage = (e: any) => {
    setUploadedImage(e.target.files[0]);
  };

  // submit image to back-end and retrieve response
  const onSubmit = () => {
    if (!uploadedImage) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();

    formData.append("image", uploadedImage);

    axios
      .post("http://127.0.0.1:5000/generate", formData, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response); // blob is returned
        const imageUrl = URL.createObjectURL(response.data); // turns blob into a URL that img tag can use (img can only use URLs for source)
        // window.open(imageUrl, "_blank"); // open image in new url OR inspect element the outputted image to see the URL
        setGeneratedImage(imageUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getStats = () => {
    if (!uploadedImage) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();

    formData.append("image", uploadedImage);

    axios
      .post("http://127.0.0.1:5000/generate-modified", formData, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response);
        const imageUrl = URL.createObjectURL(response.data); // turns blob into a URL that img tag can use (img can only use URLs for source)
        // window.open(imageUrl, "_blank"); // open image in new url OR inspect element the outputted image to see the URL
        setGeneratedImage(imageUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    // <div className="flex flex-col justify-center items-center gap-10">
    //   {generatedImage && <img src={generatedImage} alt="Generated" />}
    //   <div className="bg-black w-lg h-32 flex justify-center">
    //     <input type="file" name="file" onChange={getImage} id="upload" hidden />
    //     <label htmlFor="upload" className="border-4 p-8 text-white h-fit">
    //       UPLOAD IMAGE
    //     </label>
    //   </div>
    //   <Button variant={"mint"} size={"lg"} onClick={onSubmit}>
    //     MINT
    //   </Button>
    //   <Button
    //     variant={"mint"}
    //     size={"lg"}
    //     onClick={getStats}
    //     className="bg-red-300"
    //   >
    //     MINT
    //   </Button>
    // </div>
    <>
      {/* Control Panel */}
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
            {/* Theme strips */}
            <div className="space-y-2">
              {Object.entries(palettes).map(([name, colors]) => (
                <div
                  key={name}
                  className="flex h-6 sm:h-8 border-2 border-black"
                >
                  {colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1"
                      style={{ backgroundColor: `rgb(${color})` }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-2">
              <Button
                onClick={prevTheme}
                className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 h-6 sm:h-8"
                size="sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={nextTheme}
                className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 h-6 sm:h-8"
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
          <div className="bg-white p-3 md:p-4 border-4 border-black">
            <div className="space-y-3 md:space-y-4">
              {/* Size labels */}
              <div className="flex justify-between text-black font-mono text-xs sm:text-sm">
                <span>2</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>

              {/* Slider */}
              <div className="px-2">
                <Slider
                  value={paletteSize}
                  onValueChange={setPaletteSize}
                  max={20}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GENERATE Button */}
        <Button className="w-full rounded-none bg-black text-white hover:bg-gray-800 h-12 sm:h-16 text-lg sm:text-xl font-bold">
          GENERATE
        </Button>
      </div>
    </>
  );
}

export default Sidebar;
