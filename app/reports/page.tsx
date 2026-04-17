'use client';
import { useState, useEffect } from 'react';

export default function Reports() {
  const [records, setRecords] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/attendance')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setRecords(data);
      });
  }, []);

  const counts = { present: 0, absent: 0, late: 0, excused: 0 };
  records.forEach(r => {
    if(counts[r.status as keyof typeof counts] !== undefined) {
      counts[r.status as keyof typeof counts]++;
    }
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>
      
      <div className="flex flex-wrap gap-4 mb-6 text-sm font-medium">
        <div className="border border-green-200 bg-green-50 text-green-800 px-4 py-3 rounded flex-grow shadow-sm text-center">
           <div className="text-2xl font-bold">{counts.present}</div>
           <div>Total Present</div>
        </div>
        <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded flex-grow shadow-sm text-center">
           <div className="text-2xl font-bold">{counts.absent}</div>
           <div>Total Absent</div>
        </div>
        <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 px-4 py-3 rounded flex-grow shadow-sm text-center">
           <div className="text-2xl font-bold">{counts.late}</div>
           <div>Total Late</div>
        </div>
        <div className="border border-purple-200 bg-purple-50 text-purple-800 px-4 py-3 rounded flex-grow shadow-sm text-center">
           <div className="text-2xl font-bold">{counts.excused}</div>
           <div>Total Excused</div>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Student</th>
              <th className="p-3 font-semibold">Class</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map(r => (
              <tr key={`${r.student_id}-${r.date}`} className="hover:bg-gray-50 transition">
                <td className="p-3 tabular-nums">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{r.student_name}</td>
                <td className="p-3 text-gray-600">{r.class_name}</td>
                <td className="p-3 capitalize">
                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
                     r.status === 'present' ? 'bg-green-100 text-green-800' :
                     r.status === 'absent' ? 'bg-red-100 text-red-800' :
                     r.status === 'excused' ? 'bg-purple-100 text-purple-800' :
                     'bg-yellow-100 text-yellow-800'
                   }`}>
                     {r.status}
                   </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
