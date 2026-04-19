/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Menu, X } from 'lucide-react';
import {
  AsmPhasingDemo,
  ResultsCarousel,
  WorkflowDiagram,
} from './components/ProjectDiagrams';
import type { ResultPanelKey } from './components/ProjectDiagrams';

const BioHeroScene = lazy(() =>
  import('./components/BioScene').then((module) => ({ default: module.BioHeroScene })),
);

const SceneFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9F8] to-[#E8F0EE]" />
);

const SectionHeading: React.FC<{ title: string; description?: React.ReactNode; className?: string }> = ({
  title,
  description,
  className = '',
}) => (
  <div className={`mx-auto max-w-3xl text-center ${className}`.trim()}>
    <h2 className="font-serif text-3xl mb-6 text-stone-900">{title}</h2>
    {description ? (
      <p className="text-base md:text-lg text-stone-600 leading-relaxed">{description}</p>
    ) : null}
  </div>
);

const resultSlides: Array<{
  key: ResultPanelKey;
  label: string;
  title: string;
  description: string;
  bullets: string[];
}> = [
  {
    key: 'phase-continuity',
    label: 'Phase continuity',
    title: 'Longer phase sets without aggressive rephasing',
    description:
      'HapBam reconnects fragmented SNP-defined blocks while keeping phase error close to baseline.',
    bullets: [
      'At 50x coverage, chromosome 12 shows an N50 increase of 1,419,073 bp.',
      'Switch error and block-wise Hamming distance stay near baseline.',
    ],
  },
  {
    key: 'read-recovery',
    label: 'Read rescue',
    title: 'More reads receive haplotype tags',
    description:
      'Methylation evidence rescues reads that remain unresolved under SNP-only phasing.',
    bullets: [
      'Typical chromosome-level gain is approximately 2-5%.',
      'Maximum HP0 reduction reaches 15.16% on chromosome 21 at 50x coverage.',
    ],
  },
  {
    key: 'variant-calling',
    label: 'Variant calling',
    title: 'Downstream gains come mainly from recall',
    description:
      'The downstream effect is modest, but consistent and recall-led at low-to-moderate coverage.',
    bullets: [
      'At 10x coverage, total F1 rises from 0.9366 to 0.9371.',
      'False negatives drop from 294,917 to 294,172 at 10x coverage.',
    ],
  },
  {
    key: 'difficult-regions',
    label: 'Difficult regions',
    title: 'The clearest benefit is in hard genomic contexts',
    description:
      'Positive deltas concentrate in low-complexity and repeat-associated regions.',
    bullets: [
      'Strong positive strata include homopolymer and tandem-repeat categories.',
      'Whole-genome runtime remains practical at 51 min 57 s for a 50x run.',
    ],
  },
];

const futureWork = [
  'Build native methylation-aware variant callers.',
  'Calibrate ML thresholds, anchor filters, and local methylation-block criteria more systematically.',
  'Validate ASM-guided haplotagging across tissues, biological contexts, and additional sequencing settings.',
];

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<ResultPanelKey>('phase-continuity');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const activeResultIndex = resultSlides.findIndex((slide) => slide.key === activeResult);
  const activeResultSlide = resultSlides[activeResultIndex];

  const showPrevResult = () => {
    const nextIndex = (activeResultIndex - 1 + resultSlides.length) % resultSlides.length;
    setActiveResult(resultSlides[nextIndex].key);
  };

  const showNextResult = () => {
    const nextIndex = (activeResultIndex + 1) % resultSlides.length;
    setActiveResult(resultSlides[nextIndex].key);
  };

  return (
    <div className="min-h-screen bg-[#F5F9F8] font-sans text-stone-800 selection:bg-[#007D69] selection:text-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-[#007D69] rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl shadow-md border-b-4 border-[#005c4d]">
              T
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-lg tracking-wide leading-none transition-colors ${scrolled ? 'text-stone-900' : 'text-stone-900'}`}>
                FYP25044
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Final Year Project</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            <a href="#resources" onClick={scrollToSection('resources')} className="hover:text-[#007D69] transition-colors cursor-pointer uppercase">Resources</a>
            <a href="#abstract" onClick={scrollToSection('abstract')} className="hover:text-[#007D69] transition-colors cursor-pointer uppercase">Abstract</a>
            <a href="#methodology" onClick={scrollToSection('methodology')} className="hover:text-[#007D69] transition-colors cursor-pointer uppercase">Methodology</a>
            <a href="#results" onClick={scrollToSection('results')} className="hover:text-[#007D69] transition-colors cursor-pointer uppercase">Results</a>
            <a href="#team" onClick={scrollToSection('team')} className="hover:text-[#007D69] transition-colors cursor-pointer uppercase">Team</a>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="mx-4 mt-3 rounded-xl border border-stone-200 bg-white/95 p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium tracking-wide text-stone-600">
              <a href="#resources" onClick={scrollToSection('resources')} className="uppercase">Resources</a>
              <a href="#abstract" onClick={scrollToSection('abstract')} className="uppercase">Abstract</a>
              <a href="#methodology" onClick={scrollToSection('methodology')} className="uppercase">Methodology</a>
              <a href="#results" onClick={scrollToSection('results')} className="uppercase">Results</a>
              <a href="#team" onClick={scrollToSection('team')} className="uppercase">Team</a>
            </div>
          </div>
        )}
      </nav>

      <header className="relative flex min-h-screen items-center justify-center overflow-hidden py-28 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <Suspense fallback={<SceneFallback />}>
            <BioHeroScene />
          </Suspense>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,249,248,0.85)_0%,rgba(245,249,248,0.5)_50%,rgba(245,249,248,0.2)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="mx-auto mb-6 max-w-4xl font-serif text-[1.95rem] font-bold tracking-tight leading-[1.26] text-stone-900 drop-shadow-sm sm:text-[2.15rem] md:mb-8 md:text-[3.05rem] md:leading-[1.22]">
            Aggregating Epigenetic Methylation Signals for Improved Long-Read <span className="text-[#007D69] italic">Genetic Variant Calling</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-stone-600 sm:text-lg md:mb-12">
            A novel Clair3-Methylation workflow that leverages Allele-Specific Methylation (ASM) signals to bridge genomic gaps left by SNP-only methods.
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-bold text-stone-900 font-serif">LI Junzhe</div>
            <div className="text-xs text-stone-500 uppercase tracking-widest">UID: 3035973854</div>
          </div>

          <div className="mt-10 flex justify-center sm:mt-16">
            <a href="#abstract" onClick={scrollToSection('abstract')} className="group flex flex-col items-center gap-2 text-xs font-medium text-stone-400 transition-colors hover:text-[#007D69] sm:text-sm cursor-pointer animate-bounce">
              <span>SCROLL</span>
              <span className="p-2 border border-stone-300 rounded-full group-hover:border-[#007D69] transition-colors bg-white/50">
                <ArrowDown size={16} />
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-[#F5F9F8]">
        <section id="abstract" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">The Challenge</div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight text-stone-900">The "Dark" Genome</h2>
              <div className="w-16 h-1 bg-[#007D69] mb-6"></div>
              <p className="text-stone-500 italic font-serif">
                "Haplotype-aware variant callers remain strongly dependent on heterozygous single-nucleotide polymorphisms (SNPs), leaving weak-marker regions underphased."
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="text-base md:text-lg text-stone-700 leading-relaxed mb-6">
                Modern long-read variant calling relies on <strong>phasing</strong>, separating
                reads into maternal and paternal haplotypes before downstream realignment and
                genotyping. Most pipelines infer those haplotypes from <strong>heterozygous single-nucleotide polymorphisms (SNPs)</strong>.
              </p>
              <p className="text-base md:text-lg text-stone-700 leading-relaxed mb-6">
                In <strong>low-complexity, repetitive, and weak-SNP regions</strong>, that signal
                becomes sparse. Many reads remain untagged, phase blocks fragment, and downstream
                calling loses evidence. HapBam introduces an orthogonal cue:
                <strong> DNA methylation</strong>.
              </p>

              <AsmPhasingDemo />
            </div>
          </div>
        </section>

        <section id="methodology" className="py-24 bg-[#F0F5F4] border-t border-stone-200">
          <div className="container mx-auto px-6 md:px-12">
            <SectionHeading
              title="HapBam & Clair3-Methylation Workflow"
              description={
                <>
                  HapBam sits between SNP-based phasing and Clair3 full-alignment calling,
                  using six steps to rescue reads and update phase structure conservatively.
                </>
              }
              className="mb-16"
            />

            <div className="mx-auto max-w-5xl px-2 md:px-4">
              <WorkflowDiagram />
            </div>
          </div>
        </section>

        <section id="results" className="py-16 bg-stone-50 text-stone-900">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mx-auto mb-6 max-w-3xl text-center">
              <h2 className="font-serif text-3xl mb-3 text-stone-900">Experiments and Results</h2>
              <motion.div
                key={`${activeResultSlide.key}-heading`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <p className="text-base md:text-lg text-stone-600 leading-relaxed">
                  {activeResultSlide.title}
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 items-center lg:grid-cols-12 xl:px-4">
              <div className="lg:col-span-5 lg:pr-6">
                <motion.div
                  key={activeResultSlide.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="max-w-md"
                >
                  <p className="text-sm md:text-base text-stone-600 leading-relaxed mb-6">{activeResultSlide.description}</p>
                  <ul className="space-y-4 text-sm md:text-base text-stone-600">
                    {activeResultSlide.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#007D69]"></div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
              <div className="lg:col-span-7">
                <ResultsCarousel
                  activePanel={activeResult}
                  onPrev={showPrevResult}
                  onNext={showNextResult}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-3">
                {resultSlides.map((slide) => (
                  <button
                    key={slide.key}
                    onClick={() => setActiveResult(slide.key)}
                    className={`h-2.5 rounded-full transition-all ${
                      slide.key === activeResult ? 'w-8 bg-[#007D69]' : 'w-2.5 bg-stone-300'
                    }`}
                    aria-label={slide.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6 text-stone-900">Conclusion & Future Work</h2>
            <p className="text-lg text-stone-600 mb-12 leading-relaxed">
              HapBam shows that methylation can be used as a practical augmentation layer for
              long-read variant calling: rescuing more haplotagged reads, extending phase
              continuity, and improving recall where SNP-only phasing is weak.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-stretch">
              {futureWork.map((item) => (
                <div key={item} className="p-6 bg-[#F5F9F8] rounded-lg border border-stone-200 flex flex-col">
                  <h4 className="font-bold text-[#007D69] mb-3 uppercase text-xs tracking-wider">Future Work</h4>
                  <p className="text-sm text-stone-600 leading-relaxed flex-grow">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="py-24 bg-[#F5F9F8] border-t border-stone-300">
          <div className="container mx-auto px-6">
            <SectionHeading title="Project Team" className="mb-16" />

            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch flex-wrap">
              <div className="flex flex-col items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm w-full max-w-xs min-h-[280px]">
                <div className="w-20 h-20 rounded-full bg-stone-200 mb-4 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-2xl font-serif">L</div>
                </div>
                <h3 className="font-serif text-2xl text-stone-900 text-center mb-1">LI Junzhe</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center mb-4">Student Author</p>
                <p className="text-sm text-stone-600 text-center flex-grow">Dept of Computer Science<br />The University of Hong Kong</p>
              </div>

              <div className="flex flex-col items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm w-full max-w-xs opacity-80 min-h-[280px]">
                <div className="w-20 h-20 rounded-full bg-stone-200 mb-4 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-2xl font-serif">L</div>
                </div>
                <h3 className="font-serif text-xl text-stone-800 text-center mb-1">Prof. Luo Ruibang</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center mb-4">Supervisor</p>
                <p className="text-sm text-stone-600 text-center flex-grow">Dept of Computer Science<br />The University of Hong Kong</p>
              </div>

              <div className="flex flex-col items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm w-full max-w-xs opacity-80 min-h-[280px]">
                <div className="w-20 h-20 rounded-full bg-stone-200 mb-4 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-2xl font-serif">Z</div>
                </div>
                <h3 className="font-serif text-xl text-stone-800 text-center mb-1">Dr. Zheng Zhenxian</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center mb-4">Supervisor</p>
                <p className="text-sm text-stone-600 text-center flex-grow">Dept of Computer Science<br />The University of Hong Kong</p>
              </div>
            </div>

            <div className="text-center mt-12 text-sm text-stone-500 max-w-2xl mx-auto">
              Portions of this report have been submitted for publication to the <strong>GIW/ISCB-Asia 2025</strong> Poster Presentation.
            </div>
          </div>
        </section>

        <section id="resources" className="py-20 bg-white border-t border-stone-200">
          <div className="container mx-auto px-6">
            <SectionHeading title="Downloads & Resources" className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <a href={`${import.meta.env.BASE_URL}docs/Detailed%20Project%20Plan.pdf`} target="_blank" rel="noreferrer" className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Detailed Proposal</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Original project scope and timeline.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • 478 KB</div>
              </a>
              <a href={`${import.meta.env.BASE_URL}docs/Interim%20Report.pdf`} target="_blank" rel="noreferrer" className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Interim Report</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Phase 1 progress and initial benchmarks.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • 1.56 MB</div>
              </a>
              <a href={`${import.meta.env.BASE_URL}docs/Final%20Report.pdf`} target="_blank" rel="noreferrer" className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Final Report</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Complete methodology and results analysis.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • 5.85 MB</div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-2xl mb-2">Clair3-Methylation</div>
            <p className="text-sm text-stone-500">FYP25044 Final Year Project</p>
            <p className="text-xs text-stone-600 mt-2">April 19, 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
