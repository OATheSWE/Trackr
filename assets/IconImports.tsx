// Exporting Icons from IconImport.tsx
import { AntDesign, Feather, MaterialIcons  } from "@expo/vector-icons";

const IconImports = {
  Location: (props: any) => <Feather name="map-pin" {...props} />,
  Plus: (props: any) => <AntDesign name="plus" {...props} />,
  RightArrow: (props: any) => <MaterialIcons name="arrow-forward-ios" {...props} />,
  

};

export { IconImports };