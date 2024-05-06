// Importing icons from lucide-react
import {
  BarChartHorizontalBig,
  CircleDollarSign,
  Divide,
  Network,
  ScrollText,
  Users,
} from "lucide-react";

// Importing Navbar component
import Navbar from "../components/Navbar";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="z-0">
        <section className="hero bg-midnight-100 text-primary dark:bg-zinc-800 py-60">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-bold mb-4">
              Welcome to Splitwise
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-card dark:text-white">
              Manage your expenses effortlessly with friends & family.
            </p>
            <button className="hover:bg-zinc-100 hover:text-card  dark:hover:text-white dark:hover:bg-card py-6 my-10 px-8 rounded-lg font-bold uppercase tracking-wide shadow-lg">
              <Link to="/groups/create">Create Group</Link>
            </button>
          </div>
        </section>

        <section className="features bg-zinc-100 dark:bg-zinc-700 py-12">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl dark:text-white text-card  font-bold mb-8">
              Features
            </h2>
            <p className="text-lg md:text-2xl mb-8">
              Splitwise, Effortless expense tracking and bill sharing for you
              and your loved ones.
            </p>
          </div>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-4 shadow-md">
                <Users className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Groups</h3>
                <p className="text-gray-600">
                  Create a group for a travel, an event, a gift.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-6 shadow-md">
                <ScrollText className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Expenses</h3>
                <p className="text-gray-600">
                  Create and list expenses in your group.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-6 shadow-md">
                <Network className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Categories</h3>
                <p className="text-gray-600">
                  Assign categories to your expenses.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-6 shadow-md">
                <Divide className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Advanced split</h3>
                <p className="text-gray-600">
                  Split expenses by percentage, shares or amount.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-6 shadow-md">
                <BarChartHorizontalBig className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Balances</h3>
                <p className="text-gray-600">
                  Visualize how much each participant spent.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white dark:bg-zinc-300 rounded-lg p-6 shadow-md">
                <CircleDollarSign className="h-8 w-8 m-2" />
                <h3 className="text-xl font-semibold mb-2">Reimbursements</h3>
                <p className="text-gray-600">
                  Optimize money transfers between participants..
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials bg-midnight-100 dark:bg-zinc-600 py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-center dark:text-white text-card mb-8">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg dark:bg-zinc-200 shadow-lg p-6">
                <p className="text-lg mb-4">
                  "I've been using Splitwise for years now, and it has made
                  splitting expenses with my roommates a breeze. Highly
                  recommended!"
                </p>
                <p className="text-gray-600">- John Doe</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg dark:bg-zinc-200 shadow-lg p-6">
                <p className="text-lg mb-4">
                  "Splitwise has been a game-changer for managing expenses in
                  our travel group. It's so easy to use, and the app interface
                  is fantastic."
                </p>
                <p className="text-gray-600">- Jane Smith</p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-lg dark:bg-zinc-200 shadow-lg p-6">
                <p className="text-lg mb-4">
                  "Thanks to Splitwise, organizing group expenses for events has
                  become hassle-free. I love how it keeps everything organized
                  and transparent."
                </p>
                <p className="text-gray-600">- Alex Johnson</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-100 text-card dark:bg-zinc-800 dark:text-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">About Us</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  nec aliquam purus.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                <p>123 Street Name, City, Country</p>
                <p>Email: example@example.com</p>
                <p>Phone: +1234567890</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                <ul className="flex space-x-4">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
