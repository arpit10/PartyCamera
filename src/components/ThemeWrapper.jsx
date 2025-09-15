// components/ThemeWrapper.jsx
export default function ThemeWrapper({
  children,
  title = "Welcome!",
  colors = { primary: "#fbb6ce", secondary: "#93c5fd" },
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 50%, ${colors.secondary} 50%)`,
      }}
    >
      {/* Banner */}
      <div className="w-full max-w-md text-center mb-6 p-4 rounded-xl shadow-lg bg-white/70">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 drop-shadow-lg">
          {title}
        </h1>
      </div>

      {/* Children content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
