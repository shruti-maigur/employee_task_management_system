import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/Employees.css';

const Employees = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const { default: api } = await import('../services/api');
      const { data } = await api.get('/users');
      setEmployees(data.users || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Employees</h2>

          {loading ? (
            <p>Loading employees...</p>
          ) : employees.length === 0 ? (
            <p>No employees found</p>
          ) : (
            <div className="employees-table-container">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.first_name} {emp.last_name}</td>
                      <td>{emp.email}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{emp.role}</td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Employees;
