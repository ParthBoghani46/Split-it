import { SunMoon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  // Retrieve theme preference from local storage or default to "light" theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    // Apply theme class to the document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme preference to local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    // Toggle between "light" and "dark" themes
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [isTransparent, setIsTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full dark:bg-transparent bg-midnight-800 h-20 py-2 `}
        style={{
          backdropFilter: isTransparent ? "none" : "blur(10px)",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <div className="mx-auto  px-2 sm:px-6 lg:px-8">
          <div className="relative py-2 flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                className="block h-12 w-auto"
                src="/split-it.png"
                alt="Split-it Logo"
              />
              <span className="self-center ml-2 font-semibold whitespace-nowrap text-primary text-4xl">
                Split-it
              </span>
            </Link>

            {/* Menu Items */}
            <div className="sm:flex sm:ml-6 py-2">
              <div className="flex space-x-4">
                <Link
                  to="/groups"
                  className={`text-primary hover:bg-zinc-100 hover:text-card  dark:hover:text-white dark:hover:bg-card rounded-md px-3 py-2 text-2xl font-medium`}
                >
                  Groups
                </Link>
                <button
                  className="flex items-center hover:bg-zinc-100   dark:hover:bg-card justify-center w-12 h-12  border-none rounded-full focus:outline-none"
                  onClick={handleThemeSwitch}
                >
                  <SunMoon className="w-10 h-10 text-primary hover:text-card dark:hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px mt-2  bg-slate-200 dark:bg-slate-600"></div>
      </nav>
    </>
  );
}

export default Navbar;
