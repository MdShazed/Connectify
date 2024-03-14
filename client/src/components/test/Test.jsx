import React, { useRef, useState } from "react";

const Test = () => {
  // Create a ref for the array
  const [items, setItems] = useState([]);

  const myArrayRef = useRef([]);

  // Function to update the array
  const updateArray = () => {
    myArrayRef.current.push("new item");
    setItems([...myArrayRef.current]); // Update state with a new copy of the array
  };

  console.log(items);

  return (
    <>
      <div>
        <button onClick={updateArray}>Update Array</button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Test;
