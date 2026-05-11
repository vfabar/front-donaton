import React from 'react';
import NavBar from '../organisms/NavBar';

function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      <main className="mt-4">
        {children}
      </main>
      <footer className="text-center p-4">© 2024 Donation Project</footer>
    </>
  );
}

export default MainLayout;