import { useEmployeeContext } from "@/context/EmployeeContext";

export default function EmployeeTable() {
  const { state } = useEmployeeContext();

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Position</th>
            <th className="p-2 text-left">Salary</th>
          </tr>
        </thead>
        <tbody>
          {state.employees.map((emp) => (
            <tr key={emp._id} className="border-t">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.position}</td>
              <td className="p-2">{emp.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
