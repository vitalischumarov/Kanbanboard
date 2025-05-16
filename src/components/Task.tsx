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
    <div
      className="bg-gray-800 p-4 mb-3 rounded-lg shadow-md border border-gray-700 hover:border-gray-600 transition-colors duration-200"
      ref={setNodeRef}
      style={style}
    >
      <div
        className="hover:cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <h4 className="text-lg font-semibold text-white pb-2 truncate">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask();
          }}
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
