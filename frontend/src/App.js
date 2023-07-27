import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" Component={Home} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
