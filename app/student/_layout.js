import { Slot } from "expo-router";
import { STLinks } from "../../src/data/NavData";
import { Aside } from "@/src/components";

const App = () => {
  return (
    <div>
      <Aside asideLinks={STLinks} />
      <Slot />
    </div>
  );
};

export default App;
