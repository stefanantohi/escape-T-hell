export default function Landing() {
  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50">
      <div className="max-w-lg text-center px-6">
        <h1 className="text-3xl tracking-tighter mb-6 text-amber-100">
          Escape Tutorial Hell
        </h1>
        <p className="text-zinc-500 mb-10">
          Log every tutorial, video, and article you finish.
          <br />
          Build consistency with a beautiful activity heatmap.
        </p>
        <a
          href="/login"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 transition-colors px-12 py-3 rounded-2xl text-lg font-semibold m-3"
        >
          Start logging today
        </a>
        <p className="text-xs text-zinc-500 mt-8">
          No account needed — data saved locally in your browser
        </p>
      </div>
    </div>
  );
}
