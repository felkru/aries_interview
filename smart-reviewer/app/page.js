export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 dark:bg-slate-900">
      <div className="max-w-3xl w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl ring-1 ring-slate-900/5 hover:scale-[1.01] transition-transform duration-300">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-4">
             <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Reviewer
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            AI-powered news sentiment analysis. Built with Next.js, Tailwind CSS, MongoDB, and OpenAI.
          </p>
        </div>
        
        <div className="pt-8">
          <form className="relative flex items-center max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for a topic (e.g., 'Artificial Intelligence')"
              className="w-full pl-5 pr-14 py-4 bg-slate-100 dark:bg-slate-900 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white dark:focus:bg-slate-800 shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
