import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { taskType } from "../dataTypes/taskType";

type boardProps = {
  boardStatus: UniqueIdentifier;
  tasks: taskType[];
  deleteTask: (deleteTask: taskType) => void;
};

let boardColor: String;

export default function Board({ boardStatus, tasks, deleteTask }: boardProps) {
  let hoverEffect = "bg-stone-600";
  const { isOver, setNodeRef } = useDroppable({
    id: boardStatus,
  });

  if (isOver) {
    hoverEffect = "bg-stone-500";
  }

  if (boardStatus === "In Progress") {
    boardColor = "bg-blue-300";
  } else if (boardStatus === "Done") {
    boardColor = "bg-green-300";
  } else if (boardStatus === "Backlog") {
    boardColor = "bg-gray-300";
  }

  return (
    <div>
      <div className={`h-full mt-10 w-62`} ref={setNodeRef}>
        <h3 className={`text-amber-50 ${hoverEffect} p-6 text-center`}>
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
