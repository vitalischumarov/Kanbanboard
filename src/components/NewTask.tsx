import { useState } from "react";
import { taskType } from "../dataTypes/taskType";

type Prop = {
  addFunction: (item: taskType) => void;
  user: string;
};

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function NewTask({ addFunction, user }: Prop) {
  const [input, setInput] = useState({
    title: "",
    description: "",
    id: getRandomIntInclusive(1, 1000),
    status: "Backlog",
    owner: user,
  });

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
    if (!input.title.trim()) return; // Verhindert leere Tasks

    addFunction(input);
    setInput({
      title: "",
      description: "",
      id: getRandomIntInclusive(1, 1000),
      status: "Backlog",
      owner: user,
    });
  }

  return (
    <div className="flex justify-center">
      <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-6 w-100">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Neue Aufgabe erstellen
        </h2>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Titel*
            </label>
            <input
              id="task-title"
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="title"
              value={input.title}
              placeholder="Titel der Aufgabe"
              onChange={clickHandler}
              required
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Beschreibung
            </label>
            <input
              id="task-description"
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              value={input.description}
              placeholder="Optionale Beschreibung"
              onChange={clickHandler}
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            onClick={addNewTask}
            disabled={!input.title.trim()}
          >
            Aufgabe hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
