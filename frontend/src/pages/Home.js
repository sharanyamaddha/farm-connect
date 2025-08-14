import React from 'react'
import Navbar from '../components/Navbar';
import CategoryDropdown from '../components/CategoryDropdown';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <CategoryDropdown/>
      <Carousel/>

      <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    
    {/* Why Choose Us */}
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Why Choose Us?</h2>
      <p className="text-gray-700 max-w-2xl mx-auto">
        Our platform connects farmers directly with buyers, eliminating middlemen, ensuring fair prices, and promoting sustainable practices. Whether you're a farmer or a customer, experience transparency, trust, and convenience like never before.
      </p>
    </div>

    {/* How It Works */}
    <div className="text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-10">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="text-green-600 text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Register</h3>
          <p className="text-gray-600">Sign up as a Farmer or Buyer to get started with your journey.</p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="text-green-600 text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold mb-2">List or Browse Products</h3>
          <p className="text-gray-600">Farmers can list their fresh produce, and buyers can explore categories and order directly.</p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
          <div className="text-green-600 text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold mb-2">Deliver & Earn</h3>
          <p className="text-gray-600">Products are delivered using trusted logistics, ensuring timely and safe transactions.</p>
        </div>
      </div>
    </div>
  </div>
</div>
<Footer/>
    </div>
  )
}

export default Home;
