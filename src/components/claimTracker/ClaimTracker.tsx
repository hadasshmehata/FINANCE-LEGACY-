import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  Building,
  FileText,
  CheckSquare,
  Square,
  ChevronRight,
  Shield,
  Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClaimStage, Claim } from '../../types';

export const ClaimTracker: React.FC = () => {
  const { claims, updateClaimStage, toggleClaimTask, addClaimTask, setActiveTab } = useApp();

  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || '');
  const activeClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const stages: ClaimStage[] = [
    'Asset Discovered',
    'Verification Complete',
    'Claim Submitted',
    'Under Verification',
    'Recovery Pending',
    'Recovered',
  ];

  const handleNextStage = () => {
    if (!activeClaim) return;
    const currentIndex = stages.indexOf(activeClaim.currentStage);
    if (currentIndex < stages.length - 1) {
      updateClaimStage(activeClaim.id, stages[currentIndex + 1]);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeClaim) return;
    addClaimTask(activeClaim.id, newTaskTitle.trim());
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Smart Claim Tracker
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Track Your Recovery Journey</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status updates, compliance deadlines, and verification audit trails.
          </p>
        </div>

        {/* Claim Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {claims.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClaimId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeClaim?.id === c.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'bg-[#061525] text-slate-300 border border-[#1E3A5F] hover:border-slate-500'
              }`}
            >
              {c.institution}
            </button>
          ))}
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-10 text-center shadow-card space-y-4">
          <FileCheck className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Active Claims in Progress</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once you discover potential assets, navigate to Claim Navigator to initiate a recovery claim and track statutory milestone stages here.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('assets')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
            >
              Explore Assets
            </button>
            <button
              onClick={() => setActiveTab('navigator')}
              className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-cyan-300 font-bold text-xs"
            >
              Open Claim Navigator
            </button>
          </div>
        </div>
      ) : activeClaim ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Vertical Timeline (Exact match with prototype: Apr 20, 21, 22 stages) */}
          <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Claim Ref: {activeClaim.claimReferenceNumber}
                  </span>
                  <h3 className="text-sm font-bold text-white">{activeClaim.assetName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-400">
                    ₹{activeClaim.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-semibold">{activeClaim.progressPercentage}% Done</span>
                </div>
              </div>

              {/* Interactive Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E3A5F]">
                {activeClaim.history.map((step, index) => {
                  const isCurrent = step.stage === activeClaim.currentStage;
                  const isPassed = step.completed;

                  return (
                    <div key={index} className="relative flex items-start gap-4 group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                            : isCurrent
                            ? 'bg-[#061525] border-2 border-cyan-400 text-cyan-400 animate-pulse'
                            : 'bg-[#0B1E32] border border-[#1E3A5F] text-slate-600'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-bold ${
                              isPassed
                                ? 'text-white'
                                : isCurrent
                                ? 'text-cyan-300 font-extrabold'
                                : 'text-slate-500'
                            }`}
                          >
                            {step.stage}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Advance Action */}
            <div className="pt-6 border-t border-[#1E3A5F] mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
              >
                <span>Advance Next Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Claim Tasks & Important Deadlines */}
          <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Action Tasks & Follow-up
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Follow-up: {activeClaim.followUpDate}</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 mb-4">
                {activeClaim.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleClaimTask(activeClaim.id, task.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                      task.completed
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                      <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {task.title}
                      </span>
                    </div>
                    {task.dueDate && (
                      <span className="text-[10px] text-slate-400 font-mono">{task.dueDate}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              {showAddTask ? (
                <form onSubmit={handleAddTaskSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Call nodal officer regarding signature verification"
                    className="flex-1 bg-[#061525] border border-cyan-500/50 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-2 py-1.5 text-slate-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTask(true)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Checklist Task</span>
                </button>
              )}

              {/* Notes Card */}
              {activeClaim.notes && (
                <div className="mt-5 p-3.5 rounded-2xl bg-[#061525]/70 border border-[#1E3A5F] text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Compliance & Officer Notes
                  </span>
                  <p className="text-slate-300 leading-relaxed">{activeClaim.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs">
              <span className="text-slate-400">Claim Letter ready for dispatch</span>
              <button
                onClick={() => setActiveTab('letters')}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>Open Claim Letter Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

