"use client";

import { useEffect } from "react";
import { useEmployeeContext } from "@/context/EmployeeContext";
import axios from "axios";
import EmployeeTable from "./EmployeeTable";

import { auth } from "@clerk/nextjs/server";

async function EmployeePage() {
  const { orgRole } = await auth();
  const canManage = orgRole === "admin" || orgRole === "hr";

  const { state, dispatch } = useEmployeeContext();

  useEffect(() => {
    async function fetchEmployees() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await axios.get("/api/employees");
        dispatch({ type: "SET_EMPLOYEES", payload: res.data.data });
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load employees" });
      }
    }

    fetchEmployees();
  }, [dispatch]);

  return (
    <div>
      <h1>Employees</h1>
      {state.loading && <p>Loading...</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}
      <EmployeeTable />
      {canManage && <button>Create Employee</button>}
    </div>
  );
}

export default EmployeePage;
