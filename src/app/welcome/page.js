'use client'
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 animate-pulse">
          Welcome to Epic Planner
        </h1>
        <p className="text-lg font-light">
          The ultimate project management platform for teams and managers.
        </p>
      </div>

      {/* Image/Illustration */}
      <div className="mt-8">
        <img
          src="https://cdn.pixabay.com/photo/2018/08/12/01/43/system-3599932_640.jpg"
          alt="Teamwork Illustration"
        className="rounded-lg shadow-lg w-[80%] max-w-xl mx-auto"
        />
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-12 flex space-x-4">
        <button onClick={()=>redirect("/auth")} className="px-6 py-3 bg-indigo-800 hover:bg-indigo-900 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
          Get Started
        </button>
        {/* <button className="px-6 py-3 bg-purple-800 hover:bg-purple-900 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
          Learn More
        </button> */}
      </div>
    </div>
  );
}
