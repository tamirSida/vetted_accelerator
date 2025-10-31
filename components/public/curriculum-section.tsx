'use client';

interface CurriculumItem {
  id: string;
  title: string;
  description: string;
}

interface CurriculumSectionProps {
  items: CurriculumItem[];
}

export default function CurriculumSection({ items }: CurriculumSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            The Alpha-Bet Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A Practical MBA for Founders
          </p>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-900 text-white rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">10-Week Program</h3>
          <p className="text-gray-300">
            Rigorous, practical training designed to turn your idea into a viable business
          </p>
        </div>
      </div>
    </section>
  );
}