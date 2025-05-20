import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { taskType } from "../dataTypes/taskType";

type boardProps = {
  boardStatus: UniqueIdentifier;
  tasks: taskType[];
  deleteTask: (deleteTask: taskType) => void;
};

// let isOverElement: Boolean;

// const colorMap = {
//   "In Progress": {
//     boardColor: "bg-blue-300",
//     headerBoardColor: "bg-blue-500",
//     headerBoardColorHover: "bg-blue-400",
//   },
//   Done: {
//     boardColor: "bg-green-300",
//     headerBoardColor: "bg-green-500",
//     headerBoardColorHover: "bg-green-400",
//   },
//   Backlog: {
//     boardColor: "bg-blue-300",
//     headerBoardColor: "bg-blue-500",
//     headerBoardColorHover: "bg-blue-400",
//   },
// };

export default function Board({ boardStatus, tasks, deleteTask }: boardProps) {
  let boardColor: String = "";
  let headerBoardColor: String = "";
  let headerBoardColorHover: String = "";

  // let hoverEffect = headerBoardColor;
  const { isOver, setNodeRef } = useDroppable({
    id: boardStatus,
  });

  if (isOver) {
    // isOverElement = isOver;
    // hoverEffect = headerBoardColorHover;
  }

  if (boardStatus === "In Progress") {
    boardColor = "bg-blue-300";
    headerBoardColor = "bg-blue-500";
    headerBoardColorHover = "bg-blue-400";
  } else if (boardStatus === "Done") {
    boardColor = "bg-green-300";
    headerBoardColor = "bg-green-500";
    headerBoardColorHover = "bg-green-400";
  } else if (boardStatus === "Backlog") {
    boardColor = "bg-gray-300";
    headerBoardColor = "bg-gray-500";
    headerBoardColorHover = "bg-gray-400";
  }

  return (
    <div>
      <div className={`h-full mt-10 w-95 rounded-2xl`} ref={setNodeRef}>
        <h3
          className={`text-amber-50  ${
            isOver ? headerBoardColorHover : headerBoardColor
          }  p-3 text-center`}
        >
          {boardStatus}
        </h3>
        <div className={`${boardColor} p-5`}>
          {tasks.map((task) => {
            if (task.status === boardStatus) {
              return (
                <Task task={task} key={task.id} deleteProp={deleteTask}></Task>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
