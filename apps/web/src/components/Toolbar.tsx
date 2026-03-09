import React from 'react';

export const Toolbar: React.FC = () => (
  <header
    className="flex h-12 items-center bg-slate-800 px-4 text-lg font-semibold shadow"
    data-testid="toolbar"
  >
    Story Mapper
  </header>
);
