import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GetStarted } from './pages/onboarding/GetStarted';
import { GuardianSetup } from './pages/onboarding/GuardianSetup';
import { ChildSetup } from './pages/onboarding/ChildSetup';
import { SetupComplete } from './pages/onboarding/SetupComplete';
import { EntryGate } from './pages/auth/EntryGate';
import { PinEntry } from './pages/auth/PinEntry';
import { ExplorerDashboard } from './pages/explorer/Dashboard';
import { PathPage } from './pages/explorer/PathPage';
import { ZenMode } from './pages/explorer/ZenMode';
import { Vault } from './pages/explorer/Vault';
import { BadgeGallery } from './pages/explorer/BadgeGallery';
import { GuardianDashboard } from './pages/guardian/Dashboard';
import { ClaimedHistory } from './pages/guardian/History';
import { ExplorerProfile } from './pages/explorer/ExplorerProfile';
import { FindFriends } from './pages/explorer/FindFriends';
import { Login } from './pages/auth/Login';
import { SleepGuard } from './components/SleepGuard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<EntryGate />} />

        {/* Onboarding */}
        <Route path="/setup" element={<GetStarted />} />
        <Route path="/setup/guardian" element={<GuardianSetup />} />
        <Route path="/setup/child" element={<ChildSetup />} />
        <Route path="/setup/complete" element={<SetupComplete />} />

        {/* Auth */}
        <Route path="/auth/pin" element={<PinEntry />} />

        {/* Explorer Flow */}
        <Route path="/explorer/*" element={
          <SleepGuard>
            <Routes>
              <Route path="dashboard" element={<ExplorerDashboard />} />
              <Route path="path" element={<PathPage />} />
              <Route path="profile" element={<ExplorerProfile />} />
              <Route path="profile/:userId" element={<ExplorerProfile />} />
              <Route path="friends/find" element={<FindFriends />} />
              <Route path="zen" element={<ZenMode />} />
              <Route path="vault" element={<Vault />} />
            </Routes>
          </SleepGuard>
        } />
        <Route path="/badge-gallery" element={<SleepGuard><BadgeGallery /></SleepGuard>} />
        <Route path="/badge-gallery/:userId" element={<SleepGuard><BadgeGallery /></SleepGuard>} />

        {/* Guardian Flow */}
        <Route path="/guardian/dashboard" element={<GuardianDashboard />} />
        <Route path="/guardian/history" element={<ClaimedHistory />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
