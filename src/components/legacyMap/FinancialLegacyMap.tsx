import React, { useState } from 'react';
import {
  GitFork,
  User,
  Building,
  Coins,
  Shield,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MapNode {
  id: string;
  label: string;
  category: 'user' | 'employer' | 'bank' | 'asset' | 'nominee' | 'claim';
  detail: string;
  value?: string;
  status?: string;
  x: number;
  y: number;
  icon: any;
  color: string;
}

interface MapEdge {
  from: string;
  to: string;
  label?: string;
}

export const FinancialLegacyMap: React.FC = () => {
  const { assets, claims, currentUser, footprint, familyMembers, nomineeRequest, totalPotentialAssetsValue, setActiveTab } = useApp();

  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  // Dynamically generate nodes based on active user context
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];

  // 1. Center Node: Current User
  nodes.push({
    id: 'n_user',
    label: currentUser.name,
    category: 'user',
    detail: 'Primary Account Holder & Legacy Origin',
    value: `₹${totalPotentialAssetsValue.toLocaleString('en-IN')} Total Portfolio`,
    status: 'Active',
    x: 350,
    y: 190,
    icon: User,
    color: '#10B981',
  });

  // 2. Employer Node (from footprint)
  const primaryEmployer = footprint.previousEmployers[0] || (currentUser.occupation ? currentUser.occupation.split('(')[0].trim() : 'Employer Record');
  if (primaryEmployer && primaryEmployer !== 'None') {
    nodes.push({
      id: 'n_emp1',
      label: primaryEmployer,
      category: 'employer',
      detail: 'Career Milestone & PF Establishment',
      value: 'Service Record',
      status: 'Verified',
      x: 180,
      y: 80,
      icon: Building,
      color: '#22D3EE',
    });
    edges.push({ from: 'n_user', to: 'n_emp1', label: 'Career Link' });
  }

  // 3. EPF Asset Node (if exists)
  const epfAsset = assets.find((a) => a.category === 'EPF');
  if (epfAsset) {
    nodes.push({
      id: 'n_epf',
      label: epfAsset.name,
      category: 'asset',
      detail: `${epfAsset.institution} Accumulation`,
      value: `₹${epfAsset.estimatedValue.toLocaleString('en-IN')}`,
      status: epfAsset.verificationStatus,
      x: 60,
      y: 80,
      icon: Coins,
      color: '#38BDF8',
    });
    edges.push({ from: 'n_emp1', to: 'n_epf', label: 'EPF Deduction' });
  }

  // 4. Banking & Deposit Nodes
  const bankingAssets = assets.filter((a) => a.category === 'Banking' || a.category === 'Investments' || a.category === 'Mutual Funds');
  if (bankingAssets.length > 0) {
    // Bank 1
    const b1 = bankingAssets[0];
    nodes.push({
      id: 'n_bank1',
      label: b1.institution,
      category: 'bank',
      detail: 'Commercial Banking Institution',
      value: b1.maskedAccountRef,
      status: 'Verified',
      x: 520,
      y: 80,
      icon: Building,
      color: '#22D3EE',
    });
    edges.push({ from: 'n_user', to: 'n_bank1', label: 'Banking Mandate' });

    nodes.push({
      id: 'n_asset1',
      label: b1.name,
      category: 'asset',
      detail: b1.evidenceSource,
      value: `₹${b1.estimatedValue.toLocaleString('en-IN')}`,
      status: b1.verificationStatus,
      x: 640,
      y: 80,
      icon: Coins,
      color: '#10B981',
    });
    edges.push({ from: 'n_bank1', to: 'n_asset1', label: 'Dormant Deposit' });

    // Bank 2 (if available)
    if (bankingAssets.length > 1) {
      const b2 = bankingAssets[1];
      nodes.push({
        id: 'n_bank2',
        label: b2.institution,
        category: 'bank',
        detail: 'Deposit & Term Holdings',
        value: b2.maskedAccountRef,
        status: b2.verificationStatus,
        x: 180,
        y: 300,
        icon: Building,
        color: '#F59E0B',
      });
      edges.push({ from: 'n_user', to: 'n_bank2', label: 'Tax Deductions' });

      nodes.push({
        id: 'n_asset2',
        label: b2.name,
        category: 'asset',
        detail: b2.evidenceSource,
        value: `₹${b2.estimatedValue.toLocaleString('en-IN')}`,
        status: b2.verificationStatus,
        x: 60,
        y: 300,
        icon: Coins,
        color: '#F59E0B',
      });
      edges.push({ from: 'n_bank2', to: 'n_asset2', label: 'Term Asset' });
    }
  }

  // 5. Insurance or Other Asset Node
  const insuranceAsset = assets.find((a) => a.category === 'Insurance' || a.category === 'Pension');
  if (insuranceAsset) {
    nodes.push({
      id: 'n_ins',
      label: insuranceAsset.name,
      category: 'asset',
      detail: `${insuranceAsset.institution} Policy Record`,
      value: `₹${insuranceAsset.estimatedValue.toLocaleString('en-IN')}`,
      status: insuranceAsset.verificationStatus,
      x: 520,
      y: 300,
      icon: Shield,
      color: '#A855F7',
    });
    edges.push({ from: 'n_user', to: 'n_ins', label: 'Policy Coverage' });
  }

  // 6. Nominee Node
  const nomineeName = nomineeRequest.nomineeName || familyMembers.find((m) => m.isNominee)?.name || 'Designated Nominee';
  const nomineeRelation = nomineeRequest.relationship || familyMembers.find((m) => m.isNominee)?.relationship || 'Successor';
  nodes.push({
    id: 'n_nom',
    label: `${nomineeName} (${nomineeRelation})`,
    category: 'nominee',
    detail: 'Authorized Succession Beneficiary',
    value: nomineeRequest.status,
    status: nomineeRequest.status,
    x: 350,
    y: 330,
    icon: Users,
    color: '#EC4899',
  });
  edges.push({ from: 'n_user', to: 'n_nom', label: 'Succession Authorization' });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Financial Legacy Map
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Visual Financial Relationship Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive map visualizing how {currentUser.name.split(' ')[0]}'s career milestones, banks, assets, and nominees are interconnected.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-2 rounded-2xl">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Click any node to explore evidence & linked claims</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Canvas */}
        <div className="lg:col-span-8 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 sm:p-6 shadow-card relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              Interactive Entity Graph
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {nodes.length} Nodes • {edges.length} Connected Ties
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-[380px] sm:h-[440px] bg-[#061525]/90 rounded-2xl border border-[#1E3A5F] overflow-hidden flex items-center justify-center p-2">
            <div className="absolute inset-0 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            <svg viewBox="0 0 700 400" className="w-full h-full">
              {/* Edges */}
              {edges.map((edge, i) => {
                const source = nodes.find((n) => n.id === edge.from);
                const target = nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isConnectedToSelected =
                  selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

                return (
                  <g key={i}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isConnectedToSelected ? '#10B981' : '#1E3A5F'}
                      strokeWidth={isConnectedToSelected ? '2.5' : '1.5'}
                      strokeDasharray={isConnectedToSelected ? undefined : '3 3'}
                      className="transition-all duration-300"
                    />
                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 6}
                        fill="#64748B"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedNode?.id === node.id;
                const isUser = node.category === 'user';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isUser ? 36 : 28}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="2"
                        className="animate-ping opacity-50"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isUser ? 28 : 22}
                      fill="#0B1E32"
                      stroke={isSelected ? '#FFFFFF' : node.color}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="transition-all"
                    />

                    {/* Icon Container */}
                    <foreignObject
                      x={node.x - (isUser ? 14 : 11)}
                      y={node.y - (isUser ? 14 : 11)}
                      width={isUser ? 28 : 22}
                      height={isUser ? 28 : 22}
                    >
                      <div className="w-full h-full flex items-center justify-center" style={{ color: node.color }}>
                        <Icon className={isUser ? 'w-5 h-5' : 'w-4 h-4'} />
                      </div>
                    </foreignObject>

                    {/* Node Text Label below */}
                    <text
                      x={node.x}
                      y={node.y + (isUser ? 42 : 34)}
                      fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                      fontSize={isUser ? '11' : '10'}
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {node.label}
                    </text>

                    {/* Value Badge below label */}
                    {node.value && (
                      <text
                        x={node.x}
                        y={node.y + (isUser ? 54 : 45)}
                        fill="#10B981"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {node.value}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Graph updates dynamically as you discover assets and add nominees.</span>
            <button onClick={() => setActiveTab('assets')} className="text-cyan-400 hover:text-cyan-300 font-bold">
              View Asset Inventory →
            </button>
          </div>
        </div>

        {/* Right Column: Node Details Panel */}
        <div className="lg:col-span-4 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Node Intelligence Inspector
              </h3>
              <span className="text-[10px] text-slate-400">Contextual Audit</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
                    >
                      <selectedNode.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {selectedNode.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2">{selectedNode.detail}</p>

                  {selectedNode.value && (
                    <div className="pt-2 border-t border-[#1E3A5F] flex justify-between text-xs">
                      <span className="text-slate-400">Estimated Value:</span>
                      <strong className="text-emerald-400 font-bold">{selectedNode.value}</strong>
                    </div>
                  )}

                  {selectedNode.status && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Verification Status:</span>
                      <span className="text-cyan-300 font-semibold">{selectedNode.status}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Deductive tie verified against {currentUser.name}'s financial footprint.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <GitFork className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs">Click on any node in the relationship graph to inspect details and linked claims.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1E3A5F] mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">{currentUser.name}'s Profile</span>
            <button onClick={() => setActiveTab('navigator')} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
              <span>Go to Claim Navigator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
