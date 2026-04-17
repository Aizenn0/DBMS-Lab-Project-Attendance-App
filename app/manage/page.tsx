'use client';
import { useState, useEffect } from 'react';

interface Teacher { id: number; name: string; email: string; }
interface ClassObj { id: number; name: string; teacher_name: string; }
interface Student { id: number; name: string; class_id: number; }

export default function Manage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassObj[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');

  const [newClassName, setNewClassName] = useState('');
  const [selectedTeacherForClass, setSelectedTeacherForClass] = useState('');

  const [newStudent, setNewStudent] = useState('');
  const [selectedClassForStudent, setSelectedClassForStudent] = useState('');

  const loadData = () => {
    fetch('/api/teachers').then(res => res.json()).then(data => Array.isArray(data) && setTeachers(data));
    fetch('/api/classes').then(res => res.json()).then(data => Array.isArray(data) && setClasses(data));
    fetch('/api/students').then(res => res.json()).then(data => Array.isArray(data) && setStudents(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/teachers', { 
      method: 'POST', 
      body: JSON.stringify({ name: newTeacherName, email: newTeacherEmail, password: newTeacherPassword }) 
    });
    setNewTeacherName(''); setNewTeacherEmail(''); setNewTeacherPassword('');
    loadData();
  };

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/classes', { method: 'POST', body: JSON.stringify({ name: newClassName, teacher_id: selectedTeacherForClass || null }) });
    setNewClassName('');
    loadData();
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/students', { method: 'POST', body: JSON.stringify({ name: newStudent, class_id: selectedClassForStudent }) });
    setNewStudent('');
    loadData();
  };

  const deleteRecord = async (endpoint: string, id: number) => {
    if(!confirm('Are you sure you want to delete this?')) return;
    await fetch(`/api/${endpoint}?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Classes */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
          <h2 className="text-xl font-bold mb-4">Classes / Subjects</h2>
          <form onSubmit={addClass} className="flex flex-col gap-3 mb-6">
            <input required placeholder="Class Name (e.g. Grade 10 Math)" className="border border-gray-300 p-2 rounded focus:ring focus:ring-purple-200" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
            <select className="border border-gray-300 p-2 rounded cursor-pointer" value={selectedTeacherForClass} onChange={e => setSelectedTeacherForClass(e.target.value)}>
              <option value="">Assign Teacher (Optional)...</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition">Add Class</button>
          </form>
          <ul className="border border-gray-200 rounded divide-y divide-gray-200 h-64 overflow-auto">
            {classes.map(c => (
              <li key={c.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">Teacher: {c.teacher_name || 'None'}</div>
                </div>
                <button type="button" onClick={() => deleteRecord('classes', c.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Students */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">Students</h2>
          <form onSubmit={addStudent} className="flex flex-col gap-3 mb-6">
            <input required placeholder="New Student Name" className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200" value={newStudent} onChange={e => setNewStudent(e.target.value)} />
            <select required className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200 cursor-pointer" value={selectedClassForStudent} onChange={e => setSelectedClassForStudent(e.target.value)}>
               <option value="">Assign to Class...</option>
               {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">Add Student</button>
          </form>
          <ul className="border border-gray-200 rounded divide-y divide-gray-200 h-64 overflow-auto">
            {students.map(s => {
               const c = classes.find(c => c.id === s.class_id);
               return (
                 <li key={s.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                   <div>
                     <div className="font-medium">{s.name}</div>
                     <div className="text-xs text-gray-500 mt-0.5">Class: {c?.name || 'Unknown'}</div>
                   </div>
                   <button type="button" onClick={() => deleteRecord('students', s.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                 </li>
               );
            })}
          </ul>
        </div>
      </div>

      {/* Teachers / Users */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-green-500 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Teachers (Users)</h2>
        <form onSubmit={addTeacher} className="flex flex-col gap-3 mb-6">
          <input required placeholder="Name" className="border border-gray-300 p-2 rounded focus:ring focus:ring-green-200" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)} />
          <input required type="email" placeholder="Email" className="border border-gray-300 p-2 rounded focus:ring focus:ring-green-200" value={newTeacherEmail} onChange={e => setNewTeacherEmail(e.target.value)} />
          <input required type="password" placeholder="Password" className="border border-gray-300 p-2 rounded focus:ring focus:ring-green-200" value={newTeacherPassword} onChange={e => setNewTeacherPassword(e.target.value)} />
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition">Add Teacher</button>
        </form>
        <ul className="border border-gray-200 rounded divide-y divide-gray-200 h-64 overflow-auto">
          {teachers.map(t => (
            <li key={t.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <span className="font-medium">{t.name}</span> <span className="text-sm text-gray-500 ml-2">({t.email})</span>
              </div>
              <button type="button" onClick={() => deleteRecord('teachers', t.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
