import MyRoute from "../routes/MyRoute";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <MyRoute />
      <Toaster />
    </>
  );
}

export default App;
