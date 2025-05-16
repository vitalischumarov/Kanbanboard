import "./App.css";
import Board from "./components/Board";
import NewTask from "./components/NewTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useState, useEffect, useRef } from "react";
import { taskType } from "./dataTypes/taskType";
import { createClient } from "@supabase/supabase-js";
import Login from "./components/Login";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_TOKEN;

export const supabase = createClient(supabaseUrl, supabaseKey);

const boards: UniqueIdentifier[] = ["Backlog", "In Progress", "Done"];

function App() {
  const [tasks, setTasks] = useState<taskType[]>([]);
  const user = useRef("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {});

  async function updateTask(task: taskType) {
    const { error } = await supabase
      .from("kanbanTasks")
      .update({ status: task.status })
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  }

  async function deleteTask(task: taskType) {
    deleteTaskFromState(task);
    const { error } = await supabase
      .from("kanbanTasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      console.log(error);
    }
  }

  function deleteTaskFromState(task: taskType) {
    const newList = tasks.filter((currentTask) => currentTask.id !== task.id);
    setTasks(newList);
  }

  async function loadDataFromDB() {
    const { error, data } = await supabase
      .from("kanbanTasks")
      .select("*")
      .eq("owner", user.current);
    if (error) {
      console.log(error);
      return [];
    }
    if (data) {
      return data as taskType[];
    }
    return [];
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    //Diese Aktion wird ausgefuehrt, wenn losgelassen wird!!!
    if (over && over.id === "Backlog") {
      let newArray = tasks.map((task) => {
        if (task.id === active.id) {
          task.status = "Backlog";
          updateTask(task);
          return { ...task };
        }
        return task;
      });
      setTasks(newArray);
    } else if (over && over.id === "Done") {
      let newArray = tasks.map((task) => {
        if (task.id === active.id) {
          task.status = "Done";
          updateTask(task);
          return { ...task };
        }
        return task;
      });
      setTasks(newArray);
    } else {
      let newArray = tasks.map((task) => {
        if (task.id === active.id) {
          task.status = "In Progress";
          updateTask(task);
          return { ...task };
        }
        return task;
      });
      setTasks(newArray);
    }
  }

  async function addNewTask(item: taskType) {
    const { error } = await supabase.from("kanbanTasks").insert(item);

    if (error) {
      console.log(`error: ${error}`);
    }
    console.table(item);
    setTasks((prev) => [...prev, item]);
  }

  useEffect(() => {
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        user.current = String(session?.user.email);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
    setTasks(await loadDataFromDB());
  };

  async function signOut() {
    await supabase.auth.signOut();
    user.current = "";
  }

  if (session === null) {
    return <Login fetchUser={fetchUser}></Login>;
  } else {
    return (
      <div className="bg-stone-900 h-screen">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            Eingeloggt als: {}
            <span className="font-medium text-white">{user.current}</span>
          </div>

          <button
            onClick={signOut}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200 border border-gray-600 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Abmelden
          </button>
        </div>
        <NewTask user={user.current} addFunction={addNewTask}></NewTask>
        <DndContext onDragEnd={handleDragEnd}>
          <div className=" flex justify-center gap-50">
            {boards.map((board) => {
              return (
                <Board
                  boardStatus={board}
                  tasks={tasks}
                  key={board}
                  deleteTask={deleteTask}
                ></Board>
              );
            })}
          </div>
        </DndContext>
      </div>
    );
  }
}

export default App;
