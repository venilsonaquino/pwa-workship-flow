import React, { useState } from 'react';
import WelcomeView from './WelcomeView';
import LeaderSignupView from './LeaderSignupView';
import PendingApprovalView from './PendingApprovalView';
import MemberSignupView from './MemberSignupView';
import { type UserRole } from '@shared/hooks';

export const AuthFlow: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'signup-leader' | 'signup-member' | 'pending-approval'>('welcome');

  const handleSelectRole = (role: UserRole) => {
    if (role === 'Líder de Louvor') {
      setStep('signup-leader');
    } else {
      setStep('signup-member');
    }
  };

  if (step === 'signup-leader') {
    return (
      <LeaderSignupView 
        onBack={() => setStep('welcome')} 
        onSuccess={() => setStep('pending-approval')}
      />
    );
  }

  if (step === 'signup-member') {
    return <MemberSignupView onBack={() => setStep('welcome')} />;
  }

  if (step === 'pending-approval') {
    return <PendingApprovalView onBack={() => setStep('welcome')} />;
  }

  return <WelcomeView onSelectRole={handleSelectRole} />;
};

export default AuthFlow;
