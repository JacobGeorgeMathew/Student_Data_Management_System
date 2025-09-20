import React from 'react';
import { GraduationCap, Users, BarChart3, Shield, Clock, Database, ChevronRight, BookOpen, UserCheck } from 'lucide-react';
import { Link } from 'react-router';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100" data-theme="forest">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-base-content">EduTrack</span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a className="hover:text-primary">Features</a></li>
            <li><a className="hover:text-primary">About</a></li>
            <li><a className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              <li><a>Features</a></li>
              <li><a>About</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="hero-content text-center max-w-6xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-base-content mb-6">
              Student Data
              <span className="text-primary block">Management System</span>
            </h1>
            <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-3xl mx-auto">
              Transform your manual attendance registers into a powerful digital solution. 
              Secure, efficient, and built for modern education.
            </p>
            
            {/* Authentication Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              {/* Student Portal */}
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h2 className="card-title text-2xl mb-2">Student Portal</h2>
                  <p className="text-base-content/70 mb-6">
                    Access your attendance records, view your academic progress, and stay updated with your educational journey.
                  </p>
                  <div className="card-actions justify-center w-full space-y-3">
                    <Link to="/student/login"><button className="btn btn-primary btn-wide">
                      <Users className="w-5 h-5 mr-2" />
                      Student Login
                    </button>
                    </Link>
                    <Link to="/student/register">
                    <button className="btn btn-outline btn-wide">
                      Student Register
                    </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Teacher Portal */}
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-secondary text-secondary-content rounded-full w-16">
                      <UserCheck className="w-8 h-8" />
                    </div>
                  </div>
                  <h2 className="card-title text-2xl mb-2">Teacher Portal</h2>
                  <p className="text-base-content/70 mb-6">
                    Manage student records, mark attendance, generate reports, and streamline your classroom administration.
                  </p>
                  <div className="card-actions justify-center w-full space-y-3">
                    <button className="btn btn-secondary btn-wide">
                      <Shield className="w-5 h-5 mr-2" />
                      Teacher Login
                    </button>
                    <button className="btn btn-outline btn-secondary btn-wide">
                      Teacher Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Built with modern technology and designed for educational excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <Database className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">MySQL Database</h3>
                <p className="text-base-content/70">
                  Normalized relational database with foreign keys ensuring data integrity and optimized querying.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <BarChart3 className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">Real-time Analytics</h3>
                <p className="text-base-content/70">
                  Automatic attendance percentage calculation and comprehensive reporting features.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">Role-based Security</h3>
                <p className="text-base-content/70">
                  Secure login system with different access levels for teachers and students.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <Clock className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">Efficient Tracking</h3>
                <p className="text-base-content/70">
                  Quick attendance marking and instant access to historical records.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">Student Management</h3>
                <p className="text-base-content/70">
                  Comprehensive student and subject management with easy data organization.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <ChevronRight className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">Scalable Architecture</h3>
                <p className="text-base-content/70">
                  Built with Go Fiber and React.js for future expansion and optimal performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-base-content/70">
              Full-stack solution using industry-leading frameworks
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="badge badge-lg badge-primary p-4 text-lg">Go Fiber Backend</div>
            <div className="badge badge-lg badge-secondary p-4 text-lg">React.js Frontend</div>
            <div className="badge badge-lg badge-accent p-4 text-lg">MySQL Database</div>
            <div className="badge badge-lg badge-neutral p-4 text-lg">Tailwind CSS</div>
            <div className="badge badge-lg badge-primary p-4 text-lg">DaisyUI</div>
            <div className="badge badge-lg badge-secondary p-4 text-lg">Lucide React</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-content mb-4">
            Ready to Digitize Your Attendance?
          </h2>
          <p className="text-xl text-primary-content/80 mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions already using our system
          </p>
          <button className="btn btn-lg bg-white text-primary hover:bg-base-100">
            Get Started Today
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <aside>
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">EduTrack</span>
          </div>
          <p className="font-bold">
            Student Data Management System
          </p>
          <p>Transforming education through digital innovation</p>
          <p>Copyright © 2025 - All rights reserved</p>
        </aside>
      </footer>
    </div>
  );
}