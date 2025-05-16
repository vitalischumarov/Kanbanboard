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
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

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
      alert("Erfolgreich registriert");
      setEmail("");
      setPassword("");
      setActiveTab("login");
    }
  };

  const signIn = async () => {
    console.log("login started");
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "login"
                ? "text-white bg-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Anmelden
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "register"
                ? "text-white bg-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Registrieren
          </button>
        </div>

        <div className="p-6">
          {activeTab === "login" ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Willkommen zurück
              </h2>
              <p className="text-gray-400">Bitte melden Sie sich an</p>

              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  E-Mail
                </label>
                <input
                  id="login-email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  value={emailLogIn}
                  onChange={clickHandler}
                  name="emailLogIn"
                  placeholder="Ihre E-Mail-Adresse"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Passwort
                </label>
                <input
                  id="login-password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  value={passwordLogIn}
                  onChange={clickHandler}
                  name="passwordLogIn"
                  placeholder="Ihr Passwort"
                />
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                onClick={signIn}
              >
                Anmelden
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Neues Konto erstellen
              </h2>
              <p className="text-gray-400">Bitte füllen Sie das Formular aus</p>

              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  E-Mail
                </label>
                <input
                  id="register-email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  value={email}
                  onChange={clickHandler}
                  name="email"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Passwort
                </label>
                <input
                  id="register-password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Ihr Passwort"
                  value={password}
                  onChange={clickHandler}
                  name="password"
                />
              </div>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
                onClick={signUp}
              >
                Registrieren
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
