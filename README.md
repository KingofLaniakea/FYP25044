# FYP25044 — Clair3-Methylation

> Aggregating Epigenetic Methylation Signals for Improved Long-Read Genetic Variant Calling

An interactive research showcase website for the Final Year Project at The University of Hong Kong, Department of Computer Science.

## About

This project introduces **Clair3-Methylation**, a novel pipeline that augments the industry-standard Clair3 variant caller with Allele-Specific Methylation (ASM) signals. By leveraging DNA methylation as an orthogonal data source, we bridge phasing gaps in homozygous genomic regions, achieving significant improvements in haplotype contiguity (N50) and variant calling accuracy.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **React Three Fiber** + **drei** — 3D DNA helix visualization
- **Framer Motion** — animations
- **Tailwind CSS** — styling

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

```bash
npm run deploy
```

## Author

**LI Junzhe** — The University of Hong Kong

Supervised by Prof. Luo Ruibang & Dr. Zheng Zhenxian
