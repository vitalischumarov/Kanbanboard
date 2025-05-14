import { supabase } from "../App";
import { useState } from "react";

type iFetchUser = {
  fetchUser: () => void;
};

export default function Login({ fetchUser }: iFetchUser) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLogIn, setEmailLogIn] = useState("vschumarov@yahoo.com");
  const [passwordLogIn, setPasswordLogIn] = useState("vschumarov");

  function clickHandler(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "email": {
        setEmail(event.target.value);
        break;
      }
      case "password": {
        setPassword(event.target.value);
        break;
      }
      case "emailLogIn": {
        setEmailLogIn(event.target.value);
        break;
      }
      case "passwordLogIn": {
        setPasswordLogIn(event.target.value);
        break;
      }
    }
  }

  const signUp = async () => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log(`error: ${error}`);
      return;
    }
    if (data) {
      alert("erfolgreich registriert");
      setEmail("");
      setPassword("");
    }
  };

  const signIn = async () => {
    console.log("login started");
    //mit dieser Funktion wird ein User eingeloggt
    const { error } = await supabase.auth.signInWithPassword({
      email: emailLogIn,
      password: passwordLogIn,
    });
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    } else {
      fetchUser();
      return;
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col ml-2">
        <input
          className="w-80 border mt-3 mr-2"
          type="text"
          placeholder="email"
          value={email}
          onChange={clickHandler}
          name="email"
        />
        <input
          className="w-80 border mt-3"
          type="password"
          placeholder="password"
          value={password}
          onChange={clickHandler}
          name="password"
        />
        <button
          className="bg-gray-400 p-2 rounded-2xl w-30 mt-2"
          onClick={signUp}
        >
          sign up
        </button>
      </div>
      <div className="flex flex-col">
        <input
          className="w-80 border mt-3"
          type="text"
          value={emailLogIn}
          onChange={clickHandler}
          name="emailLogIn"
        />
        <input
          className="w-80 border mt-3"
          type="password"
          value={passwordLogIn}
          onChange={clickHandler}
          name="passwordLogIn"
        />
        <button
          className="bg-green-400 p-2 rounded-2xl w-30 mt-2"
          onClick={signIn}
        >
          sign in
        </button>
      </div>
    </div>
  );
}
