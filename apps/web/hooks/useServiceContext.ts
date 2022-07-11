import { ServiceContext } from "../services/ServiceContext";
import { useContext } from "react";

export function useServiceContext() {
  return useContext(ServiceContext);
}
