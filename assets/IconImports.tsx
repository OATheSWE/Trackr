// Exporting Icons from IconImport.tsx
import { AntDesign, Feather  } from "@expo/vector-icons";

const IconImports = {
  Location: (props: any) => <Feather name="map-pin" {...props} />,
  Plus: (props: any) => <AntDesign name="plus" {...props} />,
  

};

export { IconImports };