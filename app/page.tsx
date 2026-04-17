'use client';

import { useState, useEffect } from 'react';

interface ClassObj { id: number; name: string; teacher_name: string; }
interface Student { id: number; name: string; class_id: number; }

export default function Dashboard() {
  const [classes, setClasses] = useState<ClassObj[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/classes').then(res => res.json()).then(data => {
      if(Array.isArray(data)) setClasses(data);
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/students?class_id=${selectedClass}`).then(res => res.json()).then(data => {
        if(Array.isArray(data)) setStudents(data);
      });
      fetch(`/api/attendance?class_id=${selectedClass}&date=${date}`)
        .then(res => res.json())
        .then((data: any[]) => {
            const att: Record<number, string> = {};
            if (Array.isArray(data)) {
              data.forEach(r => att[r.student_id] = r.status);
            }
            setAttendance(att);
        });
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClass, date]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    if (!selectedClass) return;
    setLoading(true);
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: parseInt(studentId),
      class_id: parseInt(selectedClass),
      date,
      status
    }));

    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records })
    });
    
    setLoading(false);
    if(res.ok) alert('Saved successfully!');
    else alert('Error: You may need to login first!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard (Take Attendance)</h1>
      <div className="flex gap-4 mb-6">
        <select 
          className="border p-2 rounded cursor-pointer"
          value={selectedClass} 
          onChange={e => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class / Subject</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.teacher_name ? `(${c.teacher_name})` : ''}</option>)}
        </select>
        <input 
          type="date" 
          className="border p-2 rounded cursor-pointer"
          value={date} 
          onChange={e => setDate(e.target.value)} 
        />
      </div>

      {selectedClass && (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Student Name</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">No students found in this class.</td>
                </tr>
              ) : students.map(s => (
                <tr key={s.id} className="border-b transition hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 flex justify-center gap-2">
                    {['present', 'absent', 'late', 'excused'].map(status => (
                      <button
                        key={status}
                        className={`px-4 py-1.5 rounded-full capitalize font-medium transition-colors ${
                          attendance[s.id] === status 
                            ? status === 'present' ? 'bg-green-600 text-white' 
                            : status === 'absent' ? 'bg-red-600 text-white'
                            : status === 'excused' ? 'bg-purple-600 text-white'
                            : 'bg-yellow-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => handleStatusChange(s.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-end">
            <button 
              disabled={loading || students.length === 0}
              className="px-6 py-2.5 bg-blue-600 font-semibold text-white rounded shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition"
              onClick={saveAttendance}
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
