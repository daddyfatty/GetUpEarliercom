import { Star } from "lucide-react";
import davidImage from "@assets/678ae0317069e15526c3487a_download (23)_1751313478409.png";
import mikeImage from "@assets/678ceb00a3ca26bcb4e7e32a_de_1751313391609.jpg";
import michelleImage from "@assets/678ae0311e6f644579d9217f_unnamed (4)_1751313553597.png";
import ericaImage from "@assets/download - 2025-06-30T155603.648_1751313520463.png";
import terranceImage from "@assets/678ae031dc0ec5a880b0909f_unnamed (6)_1751313391610.png";
import chadImage from "@assets/download - 2025-06-30T155611.484_1751313511100.png";
import steveImage from "@assets/678ae0313289077684c96176_unnamed (3)_1751313529635.png";

const reviews = [
  {
    id: 1,
    name: "David Salinas",
    location: "Milford, CT",
    rating: 5,
    review: "Needed a kick start back to life and got that from Michael. He's knowledgeable, adapts to your preferences and optimized. Highly recommended. 10/10",
    avatar: davidImage
  },
  {
    id: 2,
    name: "Mike Richetelli",
    location: "Orange, CT",
    rating: 5,
    review: "Mike is very dedicated to health and wellness, including having a strong knowledge base about nutrition. I have trained with him for several months and have attained my fitness goals. He's taught me many alternative ways to workout, deviating from traditional exercises.",
    avatar: mikeImage
  },
  {
    id: 3,
    name: "Michelle Tenney",
    location: "Orange, CT",
    rating: 5,
    review: "Shout out to Michael J Baker! Listen, even Certified Personal Trainers can use some good advice, motivation and need a sounding board to reach their goals. He's a stand up guy who is knowledgeable, a family man and just a great mentor for anyone trying to love their best life! Thanks Mike! You're the best!",
    avatar: michelleImage
  },
  {
    id: 4,
    name: "Erica Baker",
    location: "Orange, CT",
    rating: 5,
    review: "Mike has inspired me to do so many things over the years including yoga, weight lifting, running and overall guidance on food. I am pretty sure I was his first client and he really knows how to motivate and get great results!",
    avatar: ericaImage
  },
  {
    id: 5,
    name: "Terrance Arroyo",
    location: "Bellows Falls, VT",
    rating: 5,
    review: "Mike has been amazing to work with. Someone to give advice and keep me accountable without ever talking down to me or making me feel bad about my choices or decisions. He has helped me with Diet and Exercise, understands my goals and my situation, helps me through at my pace. He is invested in me doing better. Give him a shot.",
    avatar: terranceImage
  },
  {
    id: 6,
    name: "Chad Bedell",
    location: "Milford, CT",
    rating: 5,
    review: "I started with MB Wellness in early March 2023. The passion Michael brings to every session is second to none, whether it is a cardio day, stretch/yoga day, or strength day he is always encouraging me and talking through some 'roadblocks' I may have had the previous week. If you are a 40+ male and looking to get back in shape in a private one-on-one setting, Michael is your man. He will guide you physically and mentally getting you to your goals and beyond.",
    avatar: chadImage
  },
  {
    id: 7,
    name: "Steve Magi",
    location: "Orange, CT",
    rating: 5,
    review: "Working with Mike has been a game-changer. From day one, it was clear that I had stumbled upon a true gem in the world of personal training. First and foremost, Mike has a remarkable setup at his home for one-on-one training. It's the perfect blend of a comfortable, private space and a fully-equipped gym, creating an ideal environment for focused workouts. The moment I stepped in, I felt at ease and motivated to push my limits.",
    avatar: steveImage
  }
];

export function ClientReviews() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Don't just take our word for it
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Hear from some of my amazing clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                "{review.review}"
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {review.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}