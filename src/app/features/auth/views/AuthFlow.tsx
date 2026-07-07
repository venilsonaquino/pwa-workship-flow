import React, { useState } from 'react';
import WelcomeView from './WelcomeView';
import LeaderSignupView from './LeaderSignupView';
import PendingApprovalView from './PendingApprovalView';
import MemberSignupView from './MemberSignupView';
import LoginView from './LoginView';
import { type UserRole } from '@shared/hooks';

type AuthStep = 'welcome' | 'login' | 'signup-leader' | 'signup-member' | 'pending-approval';

export const AuthFlow: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('welcome');

  const handleSelectRole = (role: UserRole) => {
    if (role === 'Admin') {
      setStep('signup-leader');
    } else {
      setStep('signup-member');
    }
  };

  if (step === 'login') {
    return (
      <LoginView
        onBack={() => setStep('welcome')}
        onSignup={() => setStep('welcome')}
      />
    );
  }

  if (step === 'signup-leader') {
    return (
      <LeaderSignupView 
        onBack={() => setStep('welcome')} 
        onSuccess={() => setStep('pending-approval')}
        onLogin={() => setStep('login')}
      />
    );
  }

  if (step === 'signup-member') {
    return (
      <MemberSignupView 
        onBack={() => setStep('welcome')} 
        onLogin={() => setStep('login')}
      />
    );
  }

  if (step === 'pending-approval') {
    return <PendingApprovalView onBack={() => setStep('welcome')} />;
  }

  return (
    <WelcomeView 
      onSelectRole={handleSelectRole} 
      onLogin={() => setStep('login')}
    />
  );
};

export default AuthFlow;
