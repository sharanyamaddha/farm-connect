// Create a new file Carousel.js
import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: 'Fresh Fruits',
      description: 'Get the freshest fruits from local farms',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 2,
      title: 'Organic Vegetables',
      description: 'Pesticide-free vegetables for your family',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 3,
      title: 'Whole Grains',
      description: 'Nutritious grains for a healthy diet',
      image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
     {
    id: 4,
    title: 'Dry Fruits',
    description: 'Premium quality dry fruits for your daily needs',
    image: 'https://media.istockphoto.com/id/1280376466/photo/various-nuts-in-wooden-bowl.jpg?s=612x612&w=0&k=20&c=KOhr2_BWBuP1JoX44vSFep0GIBf-zqAUFjjfbx516aM='
  }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;




/*import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Farmer in Field',
      description: 'A farmer working in a lush green field under a clear sky.',
      image: 'https://images.pexels.com/photos/8658541/pexels-photo-8658541.jpeg'
    },
    {
      id: 2,
      title: 'Fresh Vegetables',
      description: 'A vibrant assortment of fresh vegetables at a local market.',
      image: 'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg'
    },
    {
      id: 3,
      title: 'Organic Market',
      description: 'A colorful display of organic produce at a bustling market.',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'
    },
    {
      id: 4,
      title: 'Grain Sacks',
      description: 'Sacks filled with various grains neatly arranged in a rustic setting.',
      image: 'https://images.pexels.com/photos/13612369/pexels-photo-13612369.jpeg'
    },
    {
      id: 5,
      title: 'Farmer Holding Soil',
      description: 'A farmer examining rich soil in his hands, symbolizing a connection to the earth.',
      image: 'https://images.pexels.com/photos/7728016/pexels-photo-7728016.jpeg'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;*/