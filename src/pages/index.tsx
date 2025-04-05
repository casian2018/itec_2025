export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col pt-20 bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white py-2 border-0 w-full fixed top-0 left-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
          <a href="#" className="flex items-center">
            <img
              src="./images/logo.png"
              className="h-12 w-12 mr-3"
              alt="Academix Logo"
            />
            <span className="text-xl font-bold text-black">Academix</span>
          </a>

          <div className="flex items-center space-x-4">
            <button
              className="px-5 py-2 rounded-full bg-green-700 text-white font-medium shadow hover:bg-green-800 transition"
              onClick={() => {}}
            >
              Explore More
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20 px-6 text-center ">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">
          Collaborate, Learn, Succeed
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto">
          Welcome to Academix! Take your group learning experience to the next level.
          Host interactive study sessions, collaborate on curricula, and stay organized
          with seamless event scheduling.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="bg-white text-green-900 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Is Online School for You?
          </a>
        </div>
      </div>

      <div className="bg-white py-16 px-6 text-center">
  <h2 className="text-3xl font-semibold text-gray-800 mb-8">
    Why Choose Academix?
  </h2>
  <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
    Academix offers more than just a platform for learning. It's an all-in-one solution that makes studying collaborative, interactive, and organized. Check out some of the key features that make us the best choice for online education.
  </p>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-screen-xl mx-auto">
    <div className="flex flex-col items-center">
      <img
        src="/images/feature_collaboration.png"
        alt="Collaboration"
        className="h-24 w-24 mb-4"
      />
      <h3 className="text-xl font-semibold text-green-900 mb-2">Collaborative Learning</h3>
      <p className="text-gray-600">Work together with peers, share notes, and engage in live study sessions to enhance your learning experience.</p>
    </div>

    <div className="flex flex-col items-center">
      <img
        src="/images/feature_scheduling.png"
        alt="Scheduling"
        className="h-24 w-24 mb-4"
      />
      <h3 className="text-xl font-semibold text-green-900 mb-2">Effortless Scheduling</h3>
      <p className="text-gray-600">Plan study sessions, set deadlines, and stay on top of your academic tasks with our seamless event scheduling.</p>
    </div>

    <div className="flex flex-col items-center">
      <img
        src="/images/feature_resources.png"
        alt="Resources"
        className="h-24 w-24 mb-4"
      />
      <h3 className="text-xl font-semibold text-green-900 mb-2">Access to Resources</h3>
      <p className="text-gray-600">Gain access to a wide range of curated resources including study guides, lectures, and expert content to help you excel.</p>
    </div>
  </div>

  <div className="mt-8">
    <a
      href="#"
      className="bg-green-900 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-green-800 transition"
    >
      Explore All Features
    </a>
  </div>
</div>  

      {/* Spacer */}
      <div className="py-12" />

      {/* Sponsors */}
      <div className="px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trusted By</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <img src="/images/haufe.png" alt="Sponsor 1" className="h-40 grayscale hover:grayscale-0 transition" />
          <img src="/images/nokia.png" alt="Sponsor 2" className="h-40 grayscale hover:grayscale-0 transition" />
          <img src="/images/pebune.png" alt="Sponsor 3" className="h-40 grayscale hover:grayscale-0 transition" />
          <img src="/images/oncegen.png" alt="Sponsor 4" className="h-40 grayscale hover:grayscale-0 transition" />
        </div>
      </div>

      {/* Spacer */}
      <div className="py-16" />

      {/* User Reviews */}
      <div className="bg-white py-16 px-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex flex-row items-center">
            <img src="/images/testimonial_1.png" alt="User 1" className="h-12 w-12 mr-4 rounded-full mx-auto" />
            <p className="text-gray-700 italic">
              "Academix completely changed how our study group prepares for exams. It's simple, clean, and powerful."
            </p>
            </div>
            
            
            <div className="mt-4 font-semibold text-green-900">— Sarah M., University Student</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex flex-row items-center">
            <img src="/images/testimonial_2.png" alt="User 2" className="h-12 w-12 mr-4 rounded-full mx-auto" />
            <p className="text-gray-700 italic">
              "The collaborative features and event scheduling are a game-changer. Highly recommend it to all students!"
            </p>
            </div>
            <div className="mt-4 font-semibold text-green-900">— Leo T., Group Tutor</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex flex-row items-center">
            <img src="/images/testimonial_3.png" alt="User 3" className="h-12 w-12 mr-4 rounded-full mx-auto" />
            <p className="text-gray-700 italic">
              "I use it every day. Academix keeps my academic life structured and stress-free with it's intuitive interface."
            </p>
            </div>
            <div className="mt-4 font-semibold text-green-900">— Jamila R., High Schooler</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 mt-16">
  <div className="w-full max-w-screen-xl mx-auto p-6 text-center">
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      <span className="text-sm text-white">
        © 2025 <span className=" hover:text-green-400 cursor-pointer">Academix™</span>. All Rights Reserved.
      </span>

      <div className="flex space-x-6 text-sm text-gray-300">
        <a href="/terms" className="hover:text-green-400 transition cursor-pointer">
          Terms & Conditions
        </a>
        <a href="/privacy" className="hover:text-green-400 transition cursor-pointer">
          Privacy Policy
        </a>
        <a href="/contact" className="hover:text-green-400 transition cursor-pointer">
          Contact Us
        </a>
      </div>

      <div className="flex space-x-6 text-gray-300">
        <a href="https://www.instagram.com" className="hover:text-green-400 transition cursor-pointer">
          Instagram
        </a>
        <a href="https://www.facebook.com" className="hover:text-green-400 transition cursor-pointer">
          Facebook
        </a>
        <a href="https://twitter.com" className="hover:text-green-400 transition cursor-pointer">
          Twitter
        </a>
      </div>
    </div>

    <div className="mt-4">
      <a href="mailto:support@academix.com" className="text-sm text-gray-300 hover:text-green-400 transition cursor-pointer">
        support@academix.com
      </a>
    </div>
  </div>
</footer>

    </div>
  );
}
