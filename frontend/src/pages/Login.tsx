export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-semibold mb-8">
          Sign in to save your progress
        </h2>
        <p className="text-zinc-400 mb-10 text-xs">
          Google and GitHub login coming soon
        </p>
        <div className="space-y-4">
          <button className="w-80 bg-white text-black py-3.5 rounded-2xl font-medium hover:bg-zinc-100 transition-colors border-2">
            Continue with Google
          </button>
          <button className="w-80 bg-zinc-800 py-3.5 rounded-2xl font-medium hover:bg-zinc-700 transition-colors">
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
