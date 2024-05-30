import MyRoute from "../routes/MyRoute";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div>
      <Toaster />
      <MyRoute />
    </div>
  );
}

export default App;
