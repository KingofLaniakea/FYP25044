
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AsmPhasingDemo, N50Chart, WorkflowDiagram } from './components/ProjectDiagrams';
import { ArrowDown, Menu, X, FileText, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load 3D scene to improve initial load
const BioHeroScene = lazy(() => import('./components/BioScene').then(m => ({ default: m.BioHeroScene })));

const SceneFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9F8] to-[#E8F0EE]" />
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9F8] text-stone-800 selection:bg-[#007D69] selection:text-white font-sans">

      {/* Navigation */}
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
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Suspense fallback={<SceneFallback />}>
            <BioHeroScene />
          </Suspense>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,249,248,0.85)_0%,rgba(245,249,248,0.5)_50%,rgba(245,249,248,0.2)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-8 px-4 py-2 border border-[#007D69] text-[#007D69] text-xs tracking-[0.2em] uppercase font-bold rounded-sm backdrop-blur-sm bg-white/60">
            The University of Hong Kong
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-relaxed mb-8 text-stone-900 drop-shadow-sm max-w-4xl mx-auto">
            Aggregating Epigenetic Methylation Signals for Improved Long-Read <span className="text-[#007D69] italic">Genetic Variant Calling</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-stone-600 font-light leading-relaxed mb-12">
            A novel Clair3-Methylation workflow that leverages Allele-Specific Methylation (ASM) signals to bridge genomic gaps left by SNP-only methods.
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-bold text-stone-900 font-serif">LI Junzhe</div>
            <div className="text-xs text-stone-500 uppercase tracking-widest">UID: 3035973854</div>
          </div>

          <div className="flex justify-center mt-16">
            <a href="#abstract" onClick={scrollToSection('abstract')} className="group flex flex-col items-center gap-2 text-sm font-medium text-stone-400 hover:text-[#007D69] transition-colors cursor-pointer animate-bounce">
              <span>SCROLL</span>
              <span className="p-2 border border-stone-300 rounded-full group-hover:border-[#007D69] transition-colors bg-white/50">
                <ArrowDown size={16} />
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-[#F5F9F8]">
        {/* Abstract / Problem */}
        <section id="abstract" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">The Challenge</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">The "Dark" Genome</h2>
              <div className="w-16 h-1 bg-[#007D69] mb-6"></div>
              <p className="text-stone-500 italic font-serif">
                "Contemporary haplotype-aware variant callers predominantly rely on heterozygous SNPs... compromising phasing continuity in homozygous regions."
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                Modern genetics relies on <strong>Phasing</strong>—distinguishing between the maternal and paternal copies of a chromosome. Traditionally, tools look for <strong>SNPs</strong> (single letter differences) to tell them apart.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed mb-6">
                But what happens in <strong>homozygous regions</strong> where both copies are identical? Or in repetitive regions? The tools fail, the "phase blocks" break, and variant calling accuracy plummets. This project introduces a solution using an orthogonal data source: <strong>DNA Methylation</strong>.
              </p>

              <AsmPhasingDemo />
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="py-24 bg-[#F0F5F4] border-t border-stone-200">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-[#007D69] uppercase">Our Solution</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">Clair3-Methylation Pipeline</h2>
              <p className="text-lg text-stone-600">
                We augment the industry-standard Clair3 pipeline with a new module: <strong>Variant-ASM Joint Haplotagging</strong>.
              </p>
            </div>

            <WorkflowDiagram />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 items-stretch">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 flex flex-col">
                <h3 className="font-serif text-2xl mb-4 text-stone-800">1. Fisher's Exact Test</h3>
                <p className="text-stone-600 leading-relaxed flex-grow">
                  We don't just guess which sites are methylated. We systematically scan for CpG dinucleotides exhibiting a <strong>bimodal methylation pattern</strong>. A 2x2 contingency table is constructed for each site, and Fisher's Exact Test (p &lt; 0.05) determines if methylation status is a statistically significant proxy for haplotype identity.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 flex flex-col">
                <h3 className="font-serif text-2xl mb-4 text-stone-800">2. Phase Set Concatenation</h3>
                <p className="text-stone-600 leading-relaxed flex-grow">
                  Standard tools leave gaps between phase sets. Our algorithm inspects the boundaries. If overlapping reads share a consistent ASM signature across the gap, we <strong>merge</strong> them. This is what drives the massive increase in N50 length.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section id="results" className="py-24 bg-stone-50 text-stone-900">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#007D69]/10 text-[#007D69] text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-[#007D69]/20">
                  Preliminary Results
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">Bridging the Gap</h2>
                <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                  Benchmarking on the Genome in a Bottle (GIAB) dataset demonstrates substantial improvements.
                </p>
                <ul className="space-y-4 text-stone-600">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#007D69]"></div>
                    <span><strong>Haplotagged Reads:</strong> Increased by 5-12% across chromosomes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#007D69]"></div>
                    <span><strong>False Negatives:</strong> Reduced from 118,193 to 108,171.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#007D69]"></div>
                    <span><strong>F1 Score:</strong> Consistent improvement in difficult genomic regions (Low Complexity, Homopolymers).</span>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-7">
                <N50Chart />
              </div>
            </div>
          </div>
        </section>

        {/* Future Work / Conclusion */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="font-serif text-3xl mb-6 text-stone-900">Conclusion & Future Work</h2>
            <p className="text-lg text-stone-600 mb-12 leading-relaxed">
              This project establishes a proof-of-concept for "multi-omic" variant calling. By computationally harvesting biological signals beyond the DNA sequence, we improve the resolution of the human genome. Future work will focus on a fully "Epigenome-Aware" deep learning model.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left items-stretch">
              <div className="p-6 bg-[#F5F9F8] rounded-lg border border-stone-200 flex flex-col">
                <h4 className="font-bold text-[#007D69] mb-2 uppercase text-xs tracking-wider">Completed (Phase 1 & 2)</h4>
                <ul className="list-disc list-inside text-sm text-stone-600 space-y-2 flex-grow">
                  <li>Literature Review & Tool Selection</li>
                  <li>ASM Site Identification Algorithm</li>
                  <li>Phase Set Concatenation Module</li>
                  <li>Preliminary Benchmarking (Chr 20)</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-lg border border-stone-200 dashed-border flex flex-col">
                <h4 className="font-bold text-stone-400 mb-2 uppercase text-xs tracking-wider">Upcoming (Phase 3)</h4>
                <ul className="list-disc list-inside text-sm text-stone-600 space-y-2 flex-grow">
                  <li>Full-Scale Benchmarking (All Chromosomes)</li>
                  <li>Refine ASM filtering for CDS regions</li>
                  <li>Final Report Submission</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team/Authors */}
        <section id="team" className="py-24 bg-[#F5F9F8] border-t border-stone-300">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">Acknowledgement</div>
              <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">Project Team</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch flex-wrap">
              <div className="flex flex-col items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm w-full max-w-xs min-h-[280px]">
                <div className="w-20 h-20 rounded-full bg-stone-200 mb-4 overflow-hidden flex-shrink-0">
                  {/* Placeholder for avatar */}
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

        {/* Resources Section */}
        <section id="resources" className="py-20 bg-white border-t border-stone-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                Project Documents
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">Downloads & Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <a href={`${import.meta.env.BASE_URL}docs/Detailed Project Plan.pdf`} download className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Detailed Proposal</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Original project scope and timeline.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • 478 KB</div>
              </a>
              <a href={`${import.meta.env.BASE_URL}docs/interim-report.pdf`} download className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Interim Report</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Phase 1 progress and initial benchmarks.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • Coming Soon</div>
              </a>
              <a href={`${import.meta.env.BASE_URL}docs/final-report.pdf`} download className="bg-[#F5F9F8] p-6 rounded-xl border border-stone-200 hover:border-[#007D69] transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col min-h-[200px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-[#007D69]/10 transition-colors flex-shrink-0">
                    <FileText className="text-stone-600 group-hover:text-[#007D69]" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 mb-1 font-serif">Final Report</h3>
                <p className="text-xs text-stone-500 mb-4 flex-grow">Complete methodology and results analysis.</p>
                <div className="text-[10px] font-mono text-stone-400">PDF • Coming Soon</div>
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-2xl mb-2">Clair3-Methylation</div>
            <p className="text-sm text-stone-500">FYP25044 Final Year Project</p>
            <p className="text-xs text-stone-600 mt-2">November 28, 2025</p>
          </div>
          <div className="flex gap-4">
            <Github className="hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
