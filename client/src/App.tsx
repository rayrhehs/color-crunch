import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [uploadedImage, setUploadedImage] = useState();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(
    undefined
  );

  const onSubmit = () => {
    if (!uploadedImage) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();

    // find out what FORMDATA DOES and why its important
    formData.append("image", uploadedImage);

    axios
      .post("http://127.0.0.1:5000/generate", formData, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response);
        const imageUrl = URL.createObjectURL(response.data);
        setGeneratedImage(imageUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getImage = (e: any) => {
    setUploadedImage(e.target.files[0]);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        {generatedImage && <img src={generatedImage} alt="Generated" />}
        <input type="file" name="file" onChange={getImage}></input>
        <button onClick={onSubmit}>GENERATE</button>
      </div>
    </>
  );
}

export default App;
