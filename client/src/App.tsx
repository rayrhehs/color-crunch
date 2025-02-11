import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // observe this object: {"members": ["Member1", "Member2", "Member3"]}
  // it has a key called members has a value of an array
  // i must include an empty array including the key I will be retrieving in userData {members: []}
  // without the key, the data will not be assigned properly in userData object
  const [userData, setUserData] = useState({ members: [] });
  const [uploadedImage, setUploadedImage] = useState();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(
    undefined
  );

  // useEffect(() => {
  //   axios.get("http://127.0.0.1:5000/members").then((response) => {
  //     setUserData(response.data);
  //   });
  // }, []);

  // // test
  // const onTest = () => {
  //   axios
  //     .post("http://127.0.0.1:5000/test", { message: "Hello World" })
  //     .then((response) => {
  //       console.log(JSON.stringify(response));
  //       console.log(
  //         "Post request sent! This is the response: " + response.data
  //       );
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

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
      {/* A .map function was used because it modifies an array and returns a new one */}
      {/* {userData.members.map((member, index) => (
        <div key={index}>{member}</div>
      ))} */}
      {/* <button onClick={onTest}>TEST</button> */}
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
