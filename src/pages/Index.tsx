
import React from "react";
import TransferForm from "@/components/TransferForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-purple to-black">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Purple Bank Transfer</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Easily transfer money domestically or internationally with our secure and fast banking service.
          </p>
        </header>
        
        <main>
          <TransferForm />
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© 2025 Purple Bank Transfer. All rights reserved.</p>
          <p className="mt-2">This is a demo application and does not process real transactions.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
