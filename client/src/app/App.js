import MyRoute from "../routes/MyRoute";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
function App() {
  return (
    <>
      <MyRoute />
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
