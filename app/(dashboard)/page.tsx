"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

interface DashboardProps {
  searchParams: {
    search?: string;
    favorites?: string;
    filtee?: string;
  };
}
const Dashboard = ({ searchParams }: DashboardProps) => {
  const store = useMutation(api.users.store);
  useEffect(() => {
    const usestore = async () => {
      store();
    };
    usestore();
  }, [store]);
  // return <GigList query = {searchParams} />
  return <div>hi</div>;
};

export default Dashboard;
