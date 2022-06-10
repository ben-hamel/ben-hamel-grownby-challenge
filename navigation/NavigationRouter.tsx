import { useAuthentication } from "../utils/hooks/useAuthentication";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

export const NavigationRouter = () => {
  const { user } = useAuthentication();

  return user ? <AppStack /> : <AuthStack />;
};
