import { useDraggable } from "@dnd-kit/core";
import { taskType } from "../dataTypes/taskType";
import { CSS } from "@dnd-kit/utilities";

type Prop = {
  task: taskType;
  deleteProp: (deleteTask: taskType) => void;
};

export default function Task({ task, deleteProp }: Prop) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  async function deleteTask() {
    console.log("delete task");
    deleteProp(task);
  }

  return (
    <div className="bg-stone-200 p-3 mb-4 " ref={setNodeRef} style={style}>
      <div className="hover:cursor-pointer" {...listeners} {...attributes}>
        <h4 className="pb-3.5 font-bold">{task.title}</h4>
        <p>{task.desctiption}</p>
      </div>
      <button className="bg-red-300" onClick={deleteTask}>
        delete
      </button>
    </div>
  );
}
