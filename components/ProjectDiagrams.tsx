
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dna, BarChart, ArrowRight, GitMerge, Microscope, Activity } from 'lucide-react';

// --- INTERACTIVE PHASING DEMO ---
export const AsmPhasingDemo: React.FC = () => {
  const [showMethylation, setShowMethylation] = useState(false);
  
  // Sequence Definition
  // Indices: 012345678901234567890123
  // Seq:     ATCGATCGATCGATCGATCGATCG
  // Sites:         ^       ^ 
  // Indices: 6, 14
  
  const fullSeq = "ATCGATCGATCGATCGATCGATCG";
  const mSites = [6, 14];

  // Render helper
  const RenderSequence = ({ 
    seq, 
    offset = 0, 
    highlight = false, 
    haplotype = 1, // 1 for Maternal (Methylated), 2 for Paternal (Unmethylated)
    isRead = false,
    label
  }: { seq: string, offset?: number, highlight?: boolean, haplotype: 1 | 2, isRead?: boolean, label?: string }) => {
    
    return (
      <div className="flex flex-col mb-4">
        {label && <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</div>}
        <div 
          className={`flex items-center h-12 px-1 rounded-md border transition-colors duration-300 relative ${
            highlight 
              ? (haplotype === 1 ? 'bg-blue-50 border-blue-300' : 'bg-amber-50 border-amber-300') 
              : 'bg-white border-stone-200'
          }`}
          style={{ marginLeft: `${offset * 2}rem`, width: 'fit-content' }} // 2rem per char
        >
          {seq.split('').map((char, i) => {
            const absIndex = i + offset;
            const isMethylated = haplotype === 1 && mSites.includes(absIndex);
            
            return (
              <div key={i} className="w-8 flex justify-center relative">
                <span className="font-mono text-sm font-bold text-stone-600">{char}</span>
                {showMethylation && isMethylated && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10"
                  >
                     <span className="text-[9px] text-white font-extrabold font-sans">M</span>
                  </motion.div>
                )}
              </div>
            );
          })}
          
          {/* Legend/Info tag inside the bar */}
          {isRead && (
             <div className="absolute right-2 top-1/2 -translate-y-1/2 ml-4">
                 {showMethylation ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${haplotype === 1 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {haplotype === 1 ? "Matches Hap 1" : "Matches Hap 2"}
                    </span>
                 ) : (
                    <span className="text-[10px] font-bold text-stone-400">?</span>
                 )}
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-stone-200 my-8 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-end w-full mb-6 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-2xl text-stone-800">Visualizing the Logic</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-md">
                How methylation patterns (red dots) allow us to distinguish between identical DNA sequences.
            </p>
          </div>
          <button 
            onClick={() => setShowMethylation(!showMethylation)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-2 border ${showMethylation ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-400'}`}
          >
            {showMethylation ? <Activity size={16}/> : <Dna size={16}/>}
            {showMethylation ? "Hide Signals" : "Reveal Signals"}
          </button>
      </div>

      <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[600px]">
             {/* Reference Hap 1 */}
             <RenderSequence seq={fullSeq} haplotype={1} label="Haplotype 1 (Maternal)" highlight={true} />
             
             <div className="my-6 pl-4 border-l-2 border-dashed border-stone-200 ml-4">
                 <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Sequencing Reads (The Data)</div>
                 
                 {/* Read A: Matches Hap 1. Starts index 0. Length 18. */}
                 <RenderSequence 
                    seq={fullSeq.slice(0, 18)} 
                    offset={0} 
                    haplotype={1} 
                    isRead={true} 
                    highlight={showMethylation} 
                 />

                 {/* Read B: Matches Hap 2. Starts index 4. Length 18. */}
                 {/* Haplotype 2 is defined as unmethylated in this simplified model, or distinct. 
                     If Hap 2 is unmethylated, haplotype={2} (logic inside handles no M) */}
                 <RenderSequence 
                    seq={fullSeq.slice(4, 22)} 
                    offset={4} 
                    haplotype={2} 
                    isRead={true} 
                    highlight={showMethylation} 
                 />
             </div>

             {/* Reference Hap 2 */}
             <RenderSequence seq={fullSeq} haplotype={2} label="Haplotype 2 (Paternal)" highlight={true} />
          </div>
      </div>
    </div>
  );
};

// --- N50 RESULTS CHART ---
export const N50Chart: React.FC = () => {
    // Data approx from Fig A.4 in PDF (Chr 20)
    // 10x: ~0.5Mb
    // 50x: ~33Mb
    const [coverage, setCoverage] = useState<'10x' | '50x'>('10x');

    const data = {
        '10x': { baseline: 0.5, ours: 2.1, improvement: '4x' },
        '50x': { baseline: 0.9, ours: 33.0, improvement: '36x' },
    };

    const current = data[coverage];
    const maxVal = 35; // Mb

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-white text-stone-900 rounded-xl my-8 border border-stone-200 shadow-lg">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-2xl mb-2 text-[#007D69]">Haplotype Contiguity (N50)</h3>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                    N50 represents the length of continuous phased blocks. By bridging gaps with methylation signals, we achieve a massive increase in contiguity, especially at higher coverages.
                </p>
                
                <div className="flex gap-2 mb-8">
                    <button onClick={() => setCoverage('10x')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${coverage === '10x' ? 'bg-[#007D69] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>10x Coverage</button>
                    <button onClick={() => setCoverage('50x')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${coverage === '50x' ? 'bg-[#007D69] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>50x Coverage</button>
                </div>

                <div className="flex items-center gap-3 text-[#007D69]">
                    <BarChart size={20} />
                    <span className="font-mono text-sm uppercase font-bold">Result: {current.improvement} Improvement</span>
                </div>
            </div>
            
            <div className="relative w-full max-w-sm h-80 bg-stone-50 rounded-xl border border-stone-200 p-6 flex justify-around items-end">
                <div className="absolute left-2 top-2 text-xs text-stone-500 font-mono">Phase Set N50 (Mb)</div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-5">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-stone-900"></div>)}
                </div>

                <div className="w-24 flex flex-col justify-end items-center h-full z-10 group">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-8 w-full text-center text-sm font-mono text-stone-500 font-bold opacity-100 transition-opacity bg-white px-2 py-1 rounded border border-stone-200 shadow-sm">
                            {current.baseline} Mb
                        </div>
                        <motion.div 
                            className="w-full bg-stone-300 rounded-t-md border-t border-x border-stone-200"
                            initial={{ height: 0 }}
                            animate={{ height: `${(current.baseline / maxVal) * 100}%` }}
                            transition={{ type: "spring", stiffness: 60 }}
                        />
                    </div>
                    <div className="h-8 flex items-center text-xs font-bold text-stone-500 uppercase tracking-wider text-center">Baseline<br/>(SNP Only)</div>
                </div>

                <div className="w-24 flex flex-col justify-end items-center h-full z-10 group">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-8 w-full text-center text-sm font-mono text-white font-bold opacity-100 transition-opacity bg-[#007D69] px-2 py-1 rounded shadow-md">
                            {current.ours} Mb
                        </div>
                        <motion.div 
                            className="w-full bg-[#007D69] rounded-t-md shadow-lg relative overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: `${(current.ours / maxVal) * 100}%` }}
                            transition={{ type: "spring", stiffness: 60, delay: 0.1 }}
                        >
                             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </motion.div>
                    </div>
                     <div className="h-8 flex items-center text-xs font-bold text-[#007D69] uppercase tracking-wider text-center">Clair3 +<br/>Methylation</div>
                </div>
            </div>
        </div>
    );
}

// --- WORKFLOW DIAGRAM ---
export const WorkflowDiagram: React.FC = () => {
    const steps = [
        { title: "Input BAM", icon: <Dna size={24}/>, desc: "Reads with SNPs & Methylation tags" },
        { title: "ASM Site ID", icon: <Microscope size={24}/>, desc: "Fisher's Exact Test finds allele-specific patterns" },
        { title: "Haplotype Assign", icon: <GitMerge size={24} className="rotate-90"/>, desc: "Use ASM to phase 'dark' reads" },
        { title: "Concatenation", icon: <ArrowRight size={24}/>, desc: "Merge phase sets for long contiguity" },
    ];

    return (
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 w-full my-8">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg border border-stone-200 shadow-sm flex-1 max-w-xs min-h-[180px]">
                        <div className="w-12 h-12 rounded-full bg-[#007D69]/10 flex items-center justify-center text-[#007D69] mb-4 flex-shrink-0">
                            {step.icon}
                        </div>
                        <h4 className="font-bold text-stone-800 mb-2 text-center">{step.title}</h4>
                        <p className="text-xs text-stone-500 text-center leading-relaxed flex-grow">{step.desc}</p>
                    </div>
                    {i < 3 && (
                        <div className="hidden md:flex items-center justify-center text-stone-400 px-2 flex-shrink-0">
                            <ArrowRight size={20} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
