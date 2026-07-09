import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Perfect LLM Model Finder 🔍',
  description:
    'Find your perfect open-source LLM match based on Open LLM Benchmarks. Describe your task, set your size preference, and get AI-powered recommendations.',
  keywords: [
    'LLM',
    'AI',
    'model finder',
    'benchmark',
    'open source',
    'machine learning',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
