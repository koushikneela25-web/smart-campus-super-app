import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/dashboardApi';
import { Classroom, Department, Section, Subject } from '../../types';
import {
  GraduationCap,
  Building2,
  BookOpen,
  DoorOpen,
  Layers,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminAcademicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DEPARTMENTS' | 'SUBJECTS' | 'CLASSROOMS' | 'SECTIONS'>('DEPARTMENTS');
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Form states
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });
  const [subForm, setSubForm] = useState({ code: '', name: '', departmentId: '', credits: 3, semester: 1 });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', building: '', capacity: 60 });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [depts, subs, rooms, secs] = await Promise.all([
        adminApi.getDepartments(),
        adminApi.getSubjects(),
        adminApi.getClassrooms(),
        adminApi.getSections(),
      ]);
      setDepartments(depts);
      setSubjects(subs);
      setClassrooms(rooms);
      setSections(secs);

      if (depts.length > 0 && !subForm.departmentId) {
        setSubForm((prev) => ({ ...prev, departmentId: String(depts[0].id) }));
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch academic records',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createDepartment({
        code: deptForm.code.trim().toUpperCase(),
        name: deptForm.name.trim(),
        description: deptForm.description.trim() || undefined,
      });
      setIsDeptModalOpen(false);
      setDeptForm({ code: '', name: '', description: '' });
      setFeedback({ type: 'success', message: 'Department registered successfully!' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create department');
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createSubject({
        code: subForm.code.trim().toUpperCase(),
        name: subForm.name.trim(),
        departmentId: Number(subForm.departmentId),
        credits: Number(subForm.credits),
        semester: Number(subForm.semester),
      });
      setIsSubModalOpen(false);
      setSubForm({ code: '', name: '', departmentId: departments[0]?.id ? String(departments[0].id) : '', credits: 3, semester: 1 });
      setFeedback({ type: 'success', message: 'Subject created successfully!' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create subject');
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createClassroom({
        roomNumber: roomForm.roomNumber.trim(),
        building: roomForm.building.trim(),
        capacity: Number(roomForm.capacity),
      });
      setIsRoomModalOpen(false);
      setRoomForm({ roomNumber: '', building: '', capacity: 60 });
      setFeedback({ type: 'success', message: 'Classroom registered successfully!' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create classroom');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-purple-400" />
            Academics, Curriculum & Facilities
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain college departments, academic subject catalogs, lecture halls, and section cohorts
          </p>
        </div>

        {/* Action Button depending on tab */}
        {activeTab === 'DEPARTMENTS' && (
          <Button
            variant="primary"
            onClick={() => setIsDeptModalOpen(true)}
            className="shadow-lg shadow-purple-600/30 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        )}
        {activeTab === 'SUBJECTS' && (
          <Button
            variant="primary"
            onClick={() => setIsSubModalOpen(true)}
            className="shadow-lg shadow-purple-600/30 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        )}
        {activeTab === 'CLASSROOMS' && (
          <Button
            variant="primary"
            onClick={() => setIsRoomModalOpen(true)}
            className="shadow-lg shadow-purple-600/30 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Classroom
          </Button>
        )}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DEPARTMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'DEPARTMENTS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('SUBJECTS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'SUBJECTS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Subjects ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('CLASSROOMS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'CLASSROOMS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DoorOpen className="w-4 h-4" /> Classrooms ({classrooms.length})
        </button>

        <button
          onClick={() => setActiveTab('SECTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'SECTIONS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Sections ({sections.length})
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton height="300px" />
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          {/* DEPARTMENTS TABLE */}
          {activeTab === 'DEPARTMENTS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Code</th>
                    <th className="px-5 py-3.5 font-semibold">Department Name</th>
                    <th className="px-5 py-3.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {departments.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-mono font-bold text-teal-300">{d.code}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{d.name}</td>
                      <td className="px-5 py-3.5 text-slate-400">{d.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SUBJECTS TABLE */}
          {activeTab === 'SUBJECTS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Code</th>
                    <th className="px-5 py-3.5 font-semibold">Subject Title</th>
                    <th className="px-5 py-3.5 font-semibold">Department</th>
                    <th className="px-5 py-3.5 font-semibold">Semester</th>
                    <th className="px-5 py-3.5 font-semibold">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {subjects.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-400">{s.code}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{s.name}</td>
                      <td className="px-5 py-3.5 text-slate-300">{s.departmentName || `Dept #${s.departmentId}`}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">Sem {s.semester}</td>
                      <td className="px-5 py-3.5 font-mono text-teal-300">{s.credits} Credits</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CLASSROOMS TABLE */}
          {activeTab === 'CLASSROOMS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Room Number</th>
                    <th className="px-5 py-3.5 font-semibold">Building Complex</th>
                    <th className="px-5 py-3.5 font-semibold">Seating Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {classrooms.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-mono font-bold text-purple-300">Room {c.roomNumber}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{c.building}</td>
                      <td className="px-5 py-3.5 font-mono text-teal-300">{c.capacity} Students</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SECTIONS TABLE */}
          {activeTab === 'SECTIONS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Section Name</th>
                    <th className="px-5 py-3.5 font-semibold">Course</th>
                    <th className="px-5 py-3.5 font-semibold">Semester</th>
                    <th className="px-5 py-3.5 font-semibold">Academic Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {sections.map((sec) => (
                    <tr key={sec.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-bold text-teal-300">Section {sec.name}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">{sec.courseName || `Course #${sec.courseId}`}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">Semester {sec.semester}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">{sec.academicYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Department Modal */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title="Add Academic Department">
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. CSE, ECE, MECH"
              value={deptForm.code}
              onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono uppercase focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science and Engineering"
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Short description..."
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Subject Modal */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Add Academic Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS601"
                value={subForm.code}
                onChange={(e) => setSubForm({ ...subForm, code: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono uppercase focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department *</label>
              <select
                required
                value={subForm.departmentId}
                onChange={(e) => setSubForm({ ...subForm, departmentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Cloud Systems"
              value={subForm.name}
              onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Semester *</label>
              <input
                type="number"
                required
                min={1}
                max={8}
                value={subForm.semester}
                onChange={(e) => setSubForm({ ...subForm, semester: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Credits *</label>
              <input
                type="number"
                required
                min={1}
                max={10}
                value={subForm.credits}
                onChange={(e) => setSubForm({ ...subForm, credits: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsSubModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Classroom Modal */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="Add Classroom / Hall">
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 401 or Lab-2"
                value={roomForm.roomNumber}
                onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity *</label>
              <input
                type="number"
                required
                min={10}
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Building Complex *</label>
            <input
              type="text"
              required
              placeholder="e.g. Turing Engineering Block"
              value={roomForm.building}
              onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsRoomModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Classroom
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
