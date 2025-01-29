import React, { useState, useEffect } from "react";
import axios from "axios";
import './StudentForm.css';


const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", rollNumber: "", class: "", marks: "", grade: "" });
  const [searchQuery, setSearchQuery] = useState({ grade: "", marks: "" });

  const fetchStudents = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/students");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/students/${formData._id}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/students`, formData);
      }
      setFormData({ name: "", rollNumber: "", class: "", marks: "", grade: "" }); // Clear form
      fetchStudents();
    } catch (error) {
      console.error("Error submitting student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery.grade) queryParams.append("grade", searchQuery.grade);
      if (searchQuery.marks) queryParams.append("marks", searchQuery.marks);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students?${queryParams.toString()}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  const handleUpdate = (id) => {
    const student = students.find((student) => student._id === id);
    setFormData(student);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <h1>Student Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="rollNumber"
          placeholder="Roll Number"
          value={formData.rollNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="marks"
          placeholder="Marks"
          value={formData.marks}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleInputChange}
        />
        <button type="submit">{formData._id ? "Update" : "Add"} Student</button>
      </form>

      <h2>Search Students</h2>
      <input
        type="text"
        name="grade"
        placeholder="Grade"
        value={searchQuery.grade}
        onChange={handleSearchChange}
      />
      <input
        type="number"
        name="marks"
        placeholder="Marks (greater than or equal)"
        value={searchQuery.marks}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Search</button>

      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Class</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.class}</td>
              <td>{student.marks}</td>
              <td>{student.grade}</td>
              <td>
                <button onClick={() => handleUpdate(student._id)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default StudentForm;
