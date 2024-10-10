import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost/api/member/read.php`)
      .then((res) => {
        setMembers(res.data.member);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Hello World</h1>
      <ul>
        {members.map((member) => (
          <li key={member.memberId}>{member.username}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
