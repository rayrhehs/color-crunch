import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // observe this object: {"members": ["Member1", "Member2", "Member3"]}
  // it has a key called members has a value of an array
  // i must include an empty array including the key I will be retrieving in userData {members: []}
  // without the key, the data will not be assigned properly in userData object
  const [userData, setUserData] = useState({ members: [] });

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/members").then((response) => {
      setUserData(response.data);
    });
  }, []);

  // test
  const onTest = () => {
    axios
      .post("http://127.0.0.1:5000/test", { message: "Hello World" })
      .then((response) => {
        console.log(JSON.stringify(response));
        console.log(
          "Post request sent! This is the response: " + response.data
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {/* A .map function was used because it modifies an array and returns a new one */}
      {userData.members.map((member, index) => (
        <div key={index}>{member}</div>
      ))}
      <button onClick={onTest}>GENERATE</button>
    </>
  );
}

export default App;
