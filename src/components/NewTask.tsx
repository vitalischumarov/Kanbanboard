import { useState } from "react";
import { taskType } from "../dataTypes/taskType";

type Prop = {
  addFunction: (item: taskType) => void;
  user: String;
};

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function NewTask({ addFunction, user }: Prop) {
  var newTask: taskType = {
    title: "",
    description: "",
    id: getRandomIntInclusive(1, 1000),
    status: "Backlog",
    owner: user,
  };

  const [input, setInput] = useState(newTask);

  function clickHandler(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "title": {
        setInput({ ...input, ...{ title: event.target.value } });
        break;
      }
      case "description": {
        setInput({ ...input, ...{ description: event.target.value } });
        break;
      }
    }
  }

  function addNewTask() {
    addFunction(input);
    setInput({
      title: "",
      description: "",
      id: getRandomIntInclusive(1, 1000),
      status: "Backlog",
      owner: "",
    });
    console.log("reseted input");
    console.table(input);
  }

  return (
    <div className="pt-10 flex gap-1 justify-center">
      <input
        type="text"
        className="bg-white text-black"
        name="title"
        value={String(input.title)}
        placeholder="title"
        onChange={clickHandler}
      />
      <input
        type="text"
        className="bg-white w-90 text-black"
        name="description"
        value={String(input.description)}
        placeholder="description"
        onChange={clickHandler}
      />
      <button className="bg-amber-400 p-2" onClick={addNewTask}>
        add
      </button>
    </div>
  );
}
