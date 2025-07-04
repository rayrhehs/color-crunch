import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

function Sidebar() {
  const [uploadedImage, setUploadedImage] = useState();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(
    undefined
  );

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

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      {generatedImage && <img src={generatedImage} alt="Generated" />}
      <input type="file" name="file" onChange={getImage}></input>
      <button onClick={onSubmit}>GENERATE</button>
      <Button className="text-black">Click me</Button>
    </div>
  );
}

export default Sidebar;
