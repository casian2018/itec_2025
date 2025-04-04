export default function Home() {
  return (
    <div className="w-screen h-full flex flex-col pt-20"> {/* Added padding-top to account for fixed navbar height */}
      <nav className="bg-white border-gray-200 py-2 w-full fixed top-0 left-0 z-10 shadow-md">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <a href="#" className="flex items-center">
            <img
              src="./images/logo.png"
              className="h-16 w-16 mr-3"
              alt="Academix Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-black">
              Academix
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <div className="hidden mt-2 mr-4 sm:inline-block"></div>
          </div>
        </div>
      </nav>
      
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold uppercase">
          Collaborate, Learn, Succeed
        </h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto">
          Welcome to Academix! With Academix, you can take your group learning
          experience to the next level. Host interactive study sessions,
          collaborate on curricula, and stay organized with seamless event
          scheduling. Whether you're preparing for exams, working on projects,
          or exploring new subjects, Academix provides the tools you need to
          learn efficiently—anytime, anywhere. Ready to elevate your study game?
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="bg-white text-black font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Is Online School for You?
          </a>
        </div>
      </div>
      
      <div className="py-8">
        {/* Replaced "ffff" with proper spacing */}
      </div>
      
      <div className="bg-green-700 text-white p-8 max-w-md w-full rounded-lg shadow-lg"> {/* Removed mx-auto to keep it left-aligned */}
        <h2 className="text-xl font-semibold mb-4">
          Want to know how online learning can work for you?
        </h2>
        <p className="text-sm mb-4">
          Fill out the form below to download all the information about our programs and students, take a virtual tour, and get an opportunity to discuss your individual case with our expert advisors.
        </p>
        <p className="font-medium mb-2">Are you a student or a guardian?</p>
        <div className="flex gap-2 mb-4">
          <button className="bg-white text-black px-4 py-2 rounded-lg w-full font-medium hover:bg-gray-100">
            Student
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-lg w-full font-medium hover:bg-gray-100">
            Guardian
          </button>
        </div>
        <form className="space-y-3">
          <div>
            <label className="block text-sm">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full px-3 py-2 text-black bg-white rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full px-3 py-2 text-black bg-white rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-black bg-white rounded-lg focus:outline-none"
            />
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg">
            NEXT
          </button>
        </form>
      </div>
    </div>
  );
}