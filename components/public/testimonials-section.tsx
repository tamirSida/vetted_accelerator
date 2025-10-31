'use client';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  image?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-white via-white to-gray-400">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mr-4 shadow-lg">
              <i className="fas fa-quote-left text-2xl text-gray-700"></i>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Hear From Our Community
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-16 h-0.5 bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-gray-600 p-8 transform transition-all duration-300 hover:scale-105 hover:border-gray-400 group relative overflow-hidden"
            >
              {/* Quote Background Pattern */}
              <div className="absolute top-4 right-4 opacity-10">
                <i className="fas fa-quote-right text-6xl text-white"></i>
              </div>

              {/* Quote Content */}
              <div className="relative z-10 mb-8">
                <div className="flex items-start mb-6">
                  <div className="text-5xl text-white mr-4 leading-none">"</div>
                  <p className="text-xl text-gray-100 leading-relaxed font-medium">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
              
              {/* Author Info */}
              <div className="relative z-10 flex items-center pt-6 border-t border-gray-600">
                {/* Profile Image */}
                <div className="relative">
                  {testimonial.image ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 shadow-lg border-2 border-white group-hover:border-gray-300 transition-colors">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 shadow-lg border-2 border-gray-300 group-hover:border-gray-400 transition-colors">
                      <span className="text-lg font-bold text-gray-700">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  
                  {/* Veteran Badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-800 flex items-center justify-center shadow-lg">
                    <i className="fas fa-star text-gray-800 text-xs"></i>
                  </div>
                </div>

                {/* Author Details */}
                <div className="flex-1">
                  <p className="font-bold text-white text-lg group-hover:text-gray-200 transition-colors">
                    {testimonial.author}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center px-3 py-1 bg-white rounded-full">
                      <i className="fas fa-briefcase mr-2 text-gray-700 text-sm"></i>
                      <p className="text-sm text-gray-700 font-semibold">
                        {testimonial.title}{testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gray-500 opacity-30"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gray-500 opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full border-2 border-gray-600 shadow-lg">
            <i className="fas fa-medal mr-3 text-white text-xl"></i>
            <span className="text-white font-semibold text-lg">Veteran Success Stories</span>
            <i className="fas fa-medal ml-3 text-white text-xl"></i>
          </div>
        </div>
      </div>
    </section>
  );
}