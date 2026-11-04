"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ScanTransfer = createContext<{
  ingredients: string;
  setIngredients: (text: string) => void;
} | null>(null);

export function ScanTransferProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState("");
  return <ScanTransfer.Provider value={{ ingredients, setIngredients }}>{children}</ScanTransfer.Provider>;
}

export function useScanTransfer() {
  const transfer = useContext(ScanTransfer);
  if (!transfer) throw new Error("Scan transfer requires the application shell.");
  return transfer;
}
