import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./employee.css";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    employee_Id: "",
    fullName: "",
    jobRole: "",
    shift: "",
    assignedMachineID: "",
    attendanceRecord: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/employee");
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!newEmployee.employee_Id.trim()) {
      tempErrors.employee_Id = "Employee ID is required";
      isValid = false;
    }
    if (!newEmployee.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!newEmployee.jobRole.trim()) {
      tempErrors.jobRole = "Job role is required";
      isValid = false;
    }
    if (!newEmployee.shift.trim()) {
      tempErrors.shift = "Shift is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const employeeData = {
        ...newEmployee,
        _id: newEmployee.employee_Id // Add _id matching employee_Id as per schema
      };
      await axios.post(
        "http://localhost:3001/employee_create",
        employeeData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchEmployees(); // Refresh the list
      setShowForm(false);
      setNewEmployee({
        employee_Id: "",
        fullName: "",
        jobRole: "",
        shift: "",
        assignedMachineID: "",
        attendanceRecord: "",
      });
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(`Failed to add employee. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/employee_delete/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(`Failed to delete employee. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployee || !editingEmployee._id) {
      alert("Invalid employee data");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        id: editingEmployee._id,
        fullName: editingEmployee.fullName,
        jobRole: editingEmployee.jobRole,
        shift: editingEmployee.shift,
        assignedMachineID: editingEmployee.assignedMachineID,
        attendanceRecord: editingEmployee.attendanceRecord,
      };

      await axios.put(
        "http://localhost:3001/employee_update",
        updatedData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      await fetchEmployees(); // Refresh the list
      setEditingEmployee(null);
      alert("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(`Failed to update employee. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Employee Report", 20, 10);
  
      if (employees.length === 0) {
        doc.text("No employee data available", 20, 20);
      } else {
        doc.autoTable({
          head: [
            ["ID", "Full Name", "Job Role", "Shift", "Machine ID", "Attendance"],
          ],
          body: employees.map((emp) => [
            emp.employee_Id || "N/A",
            emp.fullName || "N/A",
            emp.jobRole || "N/A",
            emp.shift || "N/A",
            emp.assignedMachineID || "N/A",
            emp.attendanceRecord || "N/A",
          ]),
          startY: 20,
        });
      }
      doc.save("Employee_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.fullName && emp.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (emp.employee_Id && emp.employee_Id.toString().includes(search))
  );

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h1>Employee Management</h1>
        <div className="header-buttons">
          <button
            className="generate-pdf-btn"
            onClick={generatePDF}
            disabled={employees.length === 0}
          >
            <i className="fas fa-file-pdf"></i> Generate PDF
          </button>
          <button
            className="machine-btn"
            onClick={() => navigate("/machines-details")}
          >
            <i className="fas fa-cogs"></i> Machine Details
          </button>
        </div>
      </div>

      <div className="search-add-container">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by Employee Name or ID"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="new-employee-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fas fa-user-plus"></i> {showForm ? "Cancel" : "New Employee"}
        </button>
      </div>

      {showForm && (
        <div className="employee-form-container">
          <h2>Add New Employee</h2>
          <form onSubmit={handleAddEmployee}>
            <div className="form-group">
              <label htmlFor="employee_Id">Employee ID*</label>
              <input
                type="text"
                id="employee_Id"
                name="employee_Id"
                placeholder="Enter employee ID"
                value={newEmployee.employee_Id}
                onChange={handleInputChange}
                className={errors.employee_Id ? "error-input" : ""}
              />
              {errors.employee_Id && <span className="error-text">{errors.employee_Id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name*</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={newEmployee.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? "error-input" : ""}
              />
              {errors.fullName && (
                <span className="error-text">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="jobRole">Job Role*</label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                placeholder="Enter job role"
                value={newEmployee.jobRole}
                onChange={handleInputChange}
                className={errors.jobRole ? "error-input" : ""}
              />
              {errors.jobRole && (
                <span className="error-text">{errors.jobRole}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="shift">Shift*</label>
              <select
                id="shift"
                name="shift"
                value={newEmployee.shift}
                onChange={handleInputChange}
                className={errors.shift ? "error-input" : ""}
              >
                <option value="">Select shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
                <option value="Day">Day</option>
              </select>
              {errors.shift && (
                <span className="error-text">{errors.shift}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="assignedMachineID">Assigned Machine ID</label>
              <input
                type="text"
                id="assignedMachineID"
                name="assignedMachineID"
                placeholder="Enter machine ID"
                value={newEmployee.assignedMachineID}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="attendanceRecord">Attendance Record</label>
              <select
                id="attendanceRecord"
                name="attendanceRecord"
                value={newEmployee.attendanceRecord}
                onChange={handleInputChange}
              >
                <option value="">Select attendance</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="add-btn" disabled={isLoading}>
                <i className="fas fa-save"></i> Save Employee
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingEmployee && (
        <div className="employee-form-container">
          <h2>Update Employee</h2>
          <form onSubmit={handleUpdateSubmit}>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                value={editingEmployee.employee_Id}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Full Name*</label>
              <input
                type="text"
                value={editingEmployee.fullName}
                onChange={(e) => setEditingEmployee({...editingEmployee, fullName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Job Role*</label>
              <input
                type="text"
                value={editingEmployee.jobRole}
                onChange={(e) => setEditingEmployee({...editingEmployee, jobRole: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Shift*</label>
              <select
                value={editingEmployee.shift}
                onChange={(e) => setEditingEmployee({...editingEmployee, shift: e.target.value})}
              >
                <option value="">Select shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
                <option value="Day">Day</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Machine ID</label>
              <input
                type="text"
                value={editingEmployee.assignedMachineID}
                onChange={(e) => setEditingEmployee({...editingEmployee, assignedMachineID: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Attendance Record</label>
              <select
                value={editingEmployee.attendanceRecord}
                onChange={(e) => setEditingEmployee({...editingEmployee, attendanceRecord: e.target.value})}
              >
                <option value="">Select attendance</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="add-btn" disabled={isLoading}>
                <i className="fas fa-save"></i> Update Employee
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditingEmployee(null)}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading employees...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="no-results">
          {employees.length === 0
            ? "No employees found. Add a new employee to get started."
            : "No matching employees found."}
        </div>
      ) : (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Job Role</th>
                <th>Shift</th>
                <th>Assigned Machine</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employee_Id || "N/A"}</td>
                  <td>{emp.fullName || "N/A"}</td>
                  <td>{emp.jobRole || "N/A"}</td>
                  <td>{emp.shift || "N/A"}</td>
                  <td>{emp.assignedMachineID || "N/A"}</td>
                  <td>{emp.attendanceRecord || "N/A"}</td>
                  <td className="actions">
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateEmployee(emp)}
                      disabled={isLoading}
                    >
                      <i className="fas fa-edit"></i> Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEmployee(emp._id)}
                      disabled={isLoading}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;