import { useState } from "react";
import Login from "./pages/Login";
import Productos from "./pages/Productos";

function App() {
  const [logged, setLogged] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogged(false);
  };

  return (
    <div>
      {logged ? (
        <Productos onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => setLogged(true)} />
      )}
    </div>
  );
}

export default App;
