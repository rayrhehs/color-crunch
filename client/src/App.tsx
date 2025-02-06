import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // observe this object: {"members": ["Member1", "Member2", "Member3"]}
  // it has a key called members that = an array
  // when i initalize my object i need to make sure that this key exists, that way we won't get any errors
  const [userData, setUserData] = useState({ members: [] });

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/members").then((response) => {
      setUserData(response.data);
    });
  }, []);

  return (
    <>
      {/* A .map function was used because it modifies an array and returns a new one */}
      {userData.members.map((member, index) => (
        <div key={index}>{member}</div>
      ))}
    </>
  );
}

export default App;
