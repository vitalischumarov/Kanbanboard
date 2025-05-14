import "./App.css";
import Board from "./components/Board";
import NewTask from "./components/NewTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { taskType } from "./dataTypes/taskType";
import { createClient, Session } from "@supabase/supabase-js";
import Login from "./components/Login";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_TOKEN;

export const supabase = createClient(supabaseUrl, supabaseKey);

const boards: UniqueIdentifier[] = ["Backlog", "In Progress", "Done"];

function App() {
  const [tasks, setTasks] = useState<taskType[]>([]);
  const [user, setUser] = useState("");
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
    const { error, data } = await supabase.from("kanbanTasks").select("*");
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
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async () => {
    //hier mit werden die Daten des eingeloggten Usert gezogen
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
    console.log("das ist die aktuelle Session:");
    console.log(currentSession);
    setUser(String(currentSession.data.session?.user.email));
  };

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (session === null) {
    return <Login fetchUser={fetchUser}></Login>;
  } else {
    return (
      <div className="bg-stone-900 h-screen">
        <button className="bg-white" onClick={signOut}>
          Sign Out
        </button>
        <NewTask user={user} addFunction={addNewTask}></NewTask>
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
