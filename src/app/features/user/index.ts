// ── User Domain Public API ────────────────────────────────────────────────────
// This is the ONLY import boundary for the user domain.
// External modules MUST import from here — never from sub-paths.

// Export Types
export * from './types';

// Export Views
export { default as UserListView } from './views/UserListView';
export { default as UserCreateView } from './views/UserCreateView';
export { default as UserEditView } from './views/UserEditView';
export { default as UserAvatar } from './components/UserAvatar';
