
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

export const useOrdersPage = () => {
  const { user } = useAuth();
  const [pageTitle, setPageTitle] = useState("Meus Pedidos");
  
  useEffect(() => {
    // Personalize title with user name if available
    if (user?.name) {
      setPageTitle(`Pedidos de ${user.name.split(' ')[0]}`);
    } else {
      setPageTitle("Meus Pedidos");
    }
  }, [user]);
  
  return {
    pageTitle,
    historyTitle: "Histórico de Pedidos"
  };
};
