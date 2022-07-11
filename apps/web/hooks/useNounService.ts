import { useContext } from "react";
import { ServiceContext } from "../services/ServiceContext";
import { NounService } from "../services/interfaces/noun.service";

export function useNounService(): NounService {
  const ctx = useContext(ServiceContext);
  return ctx.service;
}
