'use client';

import { useState, useEffect } from 'react';
import WelcomeModal from '@/components/WelcomeModal';
import HeroSection from '@/components/HeroSection';
import TaskForm from '@/components/TaskForm';
import FeedbackWidget from '@/components/FeedbackWidget';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('llm-finder-visited');
    if (!visited) {
      setShowWelcome(true);
      localStorage.setItem('llm-finder-visited', 'true');
    }
  }, []);

  return (
    <main>
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <HeroSection />
      <div className="container">
        <TaskForm />
        <FeedbackWidget />
      </div>
      <footer className="footer">
        Built with ❤️ Perfect LLM Model Finder | Find your Perfect Match!
      </footer>
    </main>
  );
}
