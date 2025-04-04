export default function Nav() {
  return (
    <>
      <nav className="w-full bg-green-600 text-white p-4 fixed top-0 left-0 shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h2 className="text-xl font-bold hover:scale-105 transform transition-transform duration-200">
            Dashboard
          </h2>
          <ul className="flex gap-4">
            <li>
              <a
                href="/app"
                className="hover:underline hover:text-green-300 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/app/calendar"
                className="hover:underline hover:text-green-300 transition-colors duration-200"
              >
                Calendar
              </a>
            </li>
            <li>
              <a
                href="/app/events"
                className="hover:underline hover:text-green-300 transition-colors duration-200"
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="/app/profile"
                className="hover:underline hover:text-green-300 transition-colors duration-200"
              >
                Profile
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
