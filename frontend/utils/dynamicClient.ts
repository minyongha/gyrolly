import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { DYNAMIC_ENVIRONMENT_ID } from "@env";

console.log("DYNAMIC_ENVIRONMENT_ID:", DYNAMIC_ENVIRONMENT_ID);

if (!DYNAMIC_ENVIRONMENT_ID) {
  throw new Error("DYNAMIC_ENVIRONMENT_ID is not defined in .env file.");
}

export const dynamicClient = createClient({
  environmentId: DYNAMIC_ENVIRONMENT_ID,
}).extend(ReactNativeExtension());
