/*import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('customer');
  return (
    <div className='min-h-screen flex items-center justify-center  bg-gray-300'>
      <div className='bg-white p-10 rounded shadow-md w-full max-w-md  '>
      <h2 className="text-xl font-semibold mb-6 text-center">Sign in to your account</h2>
      <form>
          <div>
            <label className='block mb-3 font-medium'>Login as:</label>
            <div className='flex gap-4'>
              <label className='flex items-center'>
              <input type='radio' name="role" value="farmer" checked={role==='farmer'}
              onChange={()=>setRole('farmer')}/>
                Farmer</label>

                <label className='flex items-center'>
              <input type='radio' name="role" value="customer" checked={role==='customer'}
              onChange={()=>setRole('customer')}/>
                Customer</label>

                <label className='flex items-center'>
              <input type='radio' name="role" value="admin" checked={role==='admin'}
              onChange={()=>setRole('admin')}/>
                Admin</label>
                
            </div> 
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
      </form>
      </div>
      <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600  hover:text-blue-900">
              Register here
            </Link>
          </p>
        </div>
      </form>
      </div>

      
    </div>
  )
}

export default Login*/



import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FarmerLogin from './FarmerLogin';
import CustomerLogin from './CustomerLogin';

function Login() {
  const [loginType, setLoginType] = useState('');
  const location = useLocation(); // detects current path

  // whenever URL changes to /login, reset to choose screen
  useEffect(() => {
    if (location.pathname === '/login') {
      setLoginType('');
    }
  }, [location]);

  if (loginType === 'farmer') {
    return <FarmerLogin onBack={() => setLoginType('')} />;
  }
  if (loginType === 'customer') {
    return <CustomerLogin onBack={() => setLoginType('')} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          Choose Your Login Type
        </h2>

        <div className="flex flex-col space-y-8">
          {/* Farmer Login Button */}
          <button
            onClick={() => setLoginType('farmer')}
            className="bg-green-600 text-white py-5 rounded-xl text-center text-xl font-semibold transition-transform transform hover:scale-105 hover:bg-green-700 shadow-lg"
          >
            <span className="block mb-2 text-3xl font-bold">🌾</span>
            <span className="block text-xl">Farmer Login</span>
          </button>

          {/* Customer Login Button */}
          <button
            onClick={() => setLoginType('customer')}
            className="bg-green-600 text-white py-5 rounded-xl text-center text-xl font-semibold transition-transform transform hover:scale-105 hover:bg-green-700 shadow-lg"
          >
            <span className="block mb-2 text-3xl font-bold">🍽️</span>
            <span className="block text-xl">Customer Login</span>
          </button>
        </div>

        {/* Extra links */}
        <div className="mt-8 flex flex-col items-center space-y-4 text-green-700 text-sm font-medium">
          <p>
            New User?{' '}
            <Link
              to="/register"
              className="text-green-900 hover:underline font-semibold"
            >
              Register Now
            </Link>
          </p>
          <Link
            to="/forgotpassword"
            className="text-green-900 hover:underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
