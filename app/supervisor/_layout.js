import { Slot } from "expo-router";
import { SPLinks } from "../../src/data/NavData";
import { Aside } from "../../src/components";

const App = () => {
  return (
    <div>
      <Aside asideLinks={SPLinks} />
      <Slot />
    </div>
  );
};

export default App;
