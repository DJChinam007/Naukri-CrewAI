"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type InputSectionProps = {
  title: string;
  placeholder: string;
  data: string[];
  setData: Dispatch<SetStateAction<string[]>>;
};

export default function InputSection({
  title,
  placeholder,
  setData,
  data,
}: InputSectionProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddClick = () => {
    if (inputValue.trim() !== "") {
      setData((prevItems) => [...prevItems, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center mt-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className=" border-2 rounded-md px-1"
        />
        <Button
          onClick={handleAddClick}
          className="text-white bg-primary py-1"
        >
          Add
        </Button>
      </div>
      <ul className="mt-2">
        {data.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-300"
          >
            <span>{item}</span>
            <Button
              onClick={() => handleRemoveItem(index)}
              className="text-purple-500 hover:text-purple-700"
            >
              X
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
