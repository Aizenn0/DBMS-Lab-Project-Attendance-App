'use client';
import { useState, useEffect } from 'react';

interface Teacher { id: number; name: string; }
interface Student { id: number; name: string; teacher_id: number; }

export default function Manage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newTeacher, setNewTeacher] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [selectedTeacherForStudent, setSelectedTeacherForStudent] = useState('');

  const loadData = () => {
    fetch('/api/teachers').then(res => res.json()).then(data => Array.isArray(data) && setTeachers(data));
    fetch('/api/students').then(res => res.json()).then(data => Array.isArray(data) && setStudents(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/teachers', { method: 'POST', body: JSON.stringify({ name: newTeacher }) });
    setNewTeacher('');
    loadData();
  };

  const deleteTeacher = async (id: number) => {
    if(!confirm('Delete teacher and their students?')) return;
    await fetch(`/api/teachers?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/students', { method: 'POST', body: JSON.stringify({ name: newStudent, teacher_id: selectedTeacherForStudent }) });
    setNewStudent('');
    loadData();
  };

  const deleteStudent = async (id: number) => {
    if(!confirm('Delete student?')) return;
    await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Teachers */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Teachers</h2>
        <form onSubmit={addTeacher} className="flex gap-2 mb-6">
          <input required placeholder="New Teacher Name" className="border border-gray-300 p-2 flex-grow rounded focus:ring focus:ring-blue-200" value={newTeacher} onChange={e => setNewTeacher(e.target.value)} />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">Add</button>
        </form>
        <ul className="border border-gray-200 rounded divide-y divide-gray-200 h-96 overflow-auto">
          {teachers.map(t => (
            <li key={t.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
              <span className="font-medium">{t.name}</span>
              <button type="button" onClick={() => deleteTeacher(t.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
            </li>
          ))}
          {teachers.length === 0 && <li className="p-4 text-center text-gray-500">No teachers found.</li>}
        </ul>
      </div>

      {/* Students */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        <form onSubmit={addStudent} className="flex flex-col gap-3 mb-6">
          <input required placeholder="New Student Name" className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200" value={newStudent} onChange={e => setNewStudent(e.target.value)} />
          <select required className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200 cursor-pointer" value={selectedTeacherForStudent} onChange={e => setSelectedTeacherForStudent(e.target.value)}>
             <option value="">Assign to Teacher...</option>
             {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">Add Student</button>
        </form>
        <ul className="border border-gray-200 rounded divide-y divide-gray-200 h-96 overflow-auto">
          {students.map(s => {
             const t = teachers.find(t => t.id === s.teacher_id);
             return (
               <li key={s.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                 <div>
                   <div className="font-medium">{s.name}</div>
                   <div className="text-xs text-gray-500 mt-0.5">Teacher: {t?.name || 'Unknown'}</div>
                 </div>
                 <button type="button" onClick={() => deleteStudent(s.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
               </li>
             );
          })}
          {students.length === 0 && <li className="p-4 text-center text-gray-500">No students found.</li>}
        </ul>
      </div>
    </div>
  );
}
