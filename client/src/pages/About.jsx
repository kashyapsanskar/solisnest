import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-200 text-gray-800">
     
      <nav className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-indigo-600">SolisNest</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition duration-300">Home</Link>
          <Link to="/register" className="text-gray-700 hover:text-indigo-600 transition duration-300">Register</Link>
          <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
            Login
          </Link>
        </div>
      </nav>

      <section className="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-5xl font-extrabold">About SolisNest</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Empowering businesses and individuals with an intuitive marketplace designed for growth and success.
        </p>
      </section>

      <section className="py-16 px-8 max-w-6xl mx-auto text-center">
        <h3 className="text-4xl font-bold text-gray-900">Our Story</h3>
        <p className="text-lg text-gray-600 mt-4">
          What started as a simple idea has grown into a thriving ecosystem where buyers and sellers connect effortlessly.
          Our mission is to create a seamless, user-friendly experience that fosters business growth and success.
        </p>
      </section>


      <section className="py-16 bg-gray-100">
        <h3 className="text-4xl font-bold text-center text-gray-900">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-10">
          {[
            { name: "John Doe", role: "CEO & Founder", img: "https://i.pravatar.cc/150?img=1" },
            { name: "Jane Smith", role: "CTO & Developer", img: "https://i.pravatar.cc/150?img=2" },
            { name: "Emily Johnson", role: "Lead Designer", img: "https://i.pravatar.cc/150?img=3" },
          ].map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition duration-300">
              <img src={member.img} alt={member.name} className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-500" />
              <h4 className="text-xl font-bold mt-4">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

   
      <section className="py-16 text-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <h3 className="text-3xl font-bold">Join Us Today</h3>
        <p className="text-lg mt-2">Be a part of the SolisNest journey and grow with us.</p>
        <Link to="/register" className="mt-6 inline-block bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default About;
