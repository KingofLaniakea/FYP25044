/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Dna,
  GitMerge,
  Microscope,
  ShieldCheck,
} from 'lucide-react';

// --- INTERACTIVE PHASING DEMO ---
export const AsmPhasingDemo: React.FC = () => {
  const [showMethylation, setShowMethylation] = useState(false);

  const fullSeq = 'ATCGATCGATCGATCGATCGATCGATC';
  const mSites = [6, 14, 23, 24];

  const RenderSequence = ({
    seq,
    offset = 0,
    highlight = false,
    haplotype = 1,
    isRead = false,
    label,
  }: {
    seq: string;
    offset?: number;
    highlight?: boolean;
    haplotype: 1 | 2;
    isRead?: boolean;
    label?: string;
  }) => {
    return (
      <div className="mb-4 flex flex-col">
        {label && (
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-stone-400">
            {label}
          </div>
        )}
        <div
          className={`relative flex h-12 items-center rounded-md border px-1 transition-colors duration-300 ${
            highlight
              ? haplotype === 1
                ? 'border-blue-300 bg-blue-50'
                : 'border-amber-300 bg-amber-50'
              : 'border-stone-200 bg-white'
          }`}
          style={{ marginLeft: `${offset * 2}rem`, width: 'fit-content' }}
        >
          {seq.split('').map((char, i) => {
            const absIndex = i + offset;
            const isMethylated = haplotype === 1 && mSites.includes(absIndex);

            return (
              <div key={i} className="relative flex w-8 justify-center">
                <span className="font-mono text-sm font-bold text-stone-600">{char}</span>
                {showMethylation && isMethylated && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-rose-500 shadow-sm"
                  >
                    <span className="font-sans text-[9px] font-extrabold text-white">M</span>
                  </motion.div>
                )}
              </div>
            );
          })}

          {isRead && (
            <div className="absolute right-2 top-1/2 ml-4 -translate-y-1/2">
              {showMethylation ? (
                <span
                  className={`whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold ${
                    haplotype === 1 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {haplotype === 1 ? 'Matches Hap 1' : 'Matches Hap 2'}
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
    <div className="my-6 flex w-full max-w-4xl flex-col items-center rounded-xl border border-stone-200 bg-white p-6 shadow-lg">
      <div className="mb-5 flex w-full flex-col gap-4 border-b border-stone-100 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-serif text-xl md:text-2xl text-stone-800">Visualizing the Logic</h3>
          <p className="mt-1 max-w-md text-sm text-stone-500">
            How methylation patterns (red dots) allow us to distinguish between identical DNA
            sequences.
          </p>
        </div>
        <button
          onClick={() => setShowMethylation(!showMethylation)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-all duration-200 ${
            showMethylation
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'
          }`}
        >
          {showMethylation ? <Activity size={16} /> : <Dna size={16} />}
          {showMethylation ? 'Hide Signals' : 'Reveal Signals'}
        </button>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          <RenderSequence seq={fullSeq} haplotype={1} label="Haplotype 1 (Maternal)" highlight />

          <div className="my-6 ml-4 border-l-2 border-dashed border-stone-200 pl-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-400">
              Sequencing Reads (The Data)
            </div>
            <RenderSequence
              seq={fullSeq.slice(0, 18)}
              offset={0}
              haplotype={1}
              isRead
              highlight={showMethylation}
            />
            <RenderSequence
              seq={fullSeq.slice(4, 22)}
              offset={4}
              haplotype={2}
              isRead
              highlight={showMethylation}
            />
          </div>

          <RenderSequence seq={fullSeq} haplotype={2} label="Haplotype 2 (Paternal)" highlight />
        </div>
      </div>
    </div>
  );
};

export type ResultPanelKey =
  | 'read-recovery'
  | 'phase-continuity'
  | 'variant-calling'
  | 'difficult-regions';

type ResultsCarouselProps = {
  activePanel: ResultPanelKey;
  onNext: () => void;
  onPrev: () => void;
};

export const ResultsCarousel: React.FC<ResultsCarouselProps> = ({
  activePanel,
  onNext,
  onPrev,
}) => {
  const renderPanel = () => {
    if (activePanel === 'phase-continuity') {
      return (
        <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-stone-200 bg-white p-5 text-stone-900 shadow-lg md:flex-row">
          <div className="w-full min-w-0 flex-1 md:min-w-[240px]">
            <h3 className="mb-2 font-serif text-xl md:text-2xl text-[#007D69]">Haplotype Contiguity (N50)</h3>
            <p className="text-sm leading-relaxed text-stone-600">
              Broad chromosome-wise N50 gains are observed after HapBam augmentation.
            </p>
          </div>

          <div className="grid w-full gap-3 md:max-w-sm">
            <div className="rounded-xl border border-[#007D69]/20 bg-[#007D69] p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                50x exemplar
              </div>
              <div className="mt-2 font-serif text-3xl">+1,419,073 bp</div>
              <div className="mt-1 text-sm text-emerald-50">chr12 phase-set N50 increase</div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Error control
              </div>
              <div className="mt-2 font-serif text-lg text-stone-900">Near baseline</div>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                Switch error and block-wise Hamming distance stay close to baseline.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activePanel === 'read-recovery') {
      return (
      <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-stone-200 bg-white p-5 text-stone-900 shadow-lg md:flex-row">
          <div className="w-full min-w-0 flex-1 md:min-w-[240px]">
            <h3 className="mb-2 font-serif text-xl md:text-2xl text-[#007D69]">Read Rescue</h3>
            <p className="text-sm leading-relaxed text-stone-600">
              HapBam rescues reads that remain untagged under SNP-only phasing.
            </p>
          </div>

          <div className="w-full rounded-xl border border-stone-200 bg-stone-50 p-4 md:max-w-sm">
            <div className="mb-5 text-xs font-mono uppercase tracking-wider text-stone-500">
              Haplotagged-read recovery
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <span>Typical chromosome gain</span>
                  <span>+2-5%</span>
                </div>
                <div className="h-3 rounded-full bg-stone-200">
                  <div className="h-3 w-[78%] rounded-full bg-[#007D69]" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <span>Max HP0 reduction</span>
                  <span>15.16%</span>
                </div>
                <div className="h-3 rounded-full bg-stone-200">
                  <div className="h-3 w-[62%] rounded-full bg-[#0f766e]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activePanel === 'variant-calling') {
      return (
        <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-stone-200 bg-white p-5 text-stone-900 shadow-lg md:flex-row">
          <div className="w-full min-w-0 flex-1 md:min-w-[240px]">
            <h3 className="mb-2 font-serif text-xl md:text-2xl text-[#007D69]">Downstream Variant Calling</h3>
            <p className="text-sm leading-relaxed text-stone-600">
              The strongest downstream effect is improved recall at 10x coverage.
            </p>
          </div>

          <div className="grid w-full gap-3 md:max-w-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                  Baseline Clair3
                </div>
                <div className="font-serif text-[1.7rem] text-stone-900">0.9366</div>
                <div className="mt-1 text-sm text-stone-500">10x total F1</div>
                <div className="mt-4 text-xl font-semibold text-stone-700">294,917</div>
                <div className="text-sm text-stone-500">False negatives</div>
              </div>
              <div className="rounded-xl border border-[#007D69]/20 bg-[#007D69] p-4 text-white">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
                  HapBam + Clair3
                </div>
                <div className="font-serif text-[1.7rem]">0.9371</div>
                <div className="mt-1 text-sm text-emerald-50">10x total F1</div>
                <div className="mt-4 text-xl font-semibold">294,172</div>
                <div className="text-sm text-emerald-50">False negatives</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-stone-200 bg-white p-5 text-stone-900 shadow-lg md:flex-row">
        <div className="w-full min-w-0 flex-1 md:min-w-[240px]">
          <h3 className="mb-2 font-serif text-xl md:text-2xl text-[#007D69]">Difficult Genomic Regions</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            The clearest positive deltas are concentrated in repeat-associated intervals.
          </p>
        </div>

        <div className="w-full rounded-xl border border-stone-200 bg-stone-50 p-4 md:max-w-sm">
          <div className="mb-4 text-xs font-mono uppercase tracking-wider text-stone-500">
            Strongest positive strata
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {['Homopol_gt11bp', 'TR_gt100bp', 'TR201-10kbp'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#007D69]/20 bg-[#007D69]/10 px-3 py-1 text-xs font-semibold text-[#007D69]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Runtime</div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              51 min 57 s for a 50x whole-genome run.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[920px] overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -60) {
                onNext();
              }
              if (info.offset.x >= 60) {
                onPrev();
              }
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={onPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-500 shadow-sm transition-colors hover:border-[#007D69]/40 hover:text-[#007D69]"
          aria-label="Previous result"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onNext}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-500 shadow-sm transition-colors hover:border-[#007D69]/40 hover:text-[#007D69]"
          aria-label="Next result"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// --- WORKFLOW DIAGRAM ---
export const WorkflowDiagram: React.FC = () => {
  const steps = [
    {
      title: 'Input BAM / VCF',
      icon: <Dna size={22} />,
      desc: 'ONT reads, methylation tags, and an SNP-phased backbone.',
    },
    {
      title: 'Strict ASM Anchors',
      icon: <Microscope size={22} />,
      desc: "Fisher's exact test selects high-confidence allele-specific loci.",
    },
    {
      title: 'Rescue Anchors',
      icon: <BarChart size={22} />,
      desc: 'Weak but bimodal methylation sites are retained at lower priority.',
    },
    {
      title: 'Local Blocks',
      icon: <GitMerge size={22} className="rotate-90" />,
      desc: 'Nearby CpGs are aggregated when single-site evidence is too sparse.',
    },
    {
      title: 'LLR Assignment',
      icon: <Activity size={22} />,
      desc: 'Anchor and block evidence accumulate into read-level haplotype scores.',
    },
    {
      title: 'Conservative Output',
      icon: <ShieldCheck size={22} />,
      desc: 'BAM tags are enriched first, while VCF updates require confirmed support.',
    },
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className="mx-auto flex w-full max-w-[252px] min-h-[144px] flex-col rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#007D69]/10 text-[#007D69]">
            {step.icon}
          </div>
          <h4 className="mb-2 text-center text-sm font-bold text-stone-800">{step.title}</h4>
          <p className="flex-grow text-center text-xs leading-relaxed text-stone-500">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
};
