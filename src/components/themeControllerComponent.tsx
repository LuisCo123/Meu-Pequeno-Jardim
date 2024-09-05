import { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
export const ThemeController = () => {
    const [theme, setTheme] = useState('lemonade');
    const toggleTheme = () => {
      setTheme(theme === 'lemonade' ? 'forest' : 'lemonade');
    };
    // initially set the theme and "listen" for changes to apply them to the HTML tag
    useEffect(() => {
      document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);
    return (
        <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" className="theme-controller" onClick={()=>toggleTheme()}/>

            {/* sun icon */}
            <FaSun className="swap-on h-7 w-7 fill-current"/>

            {/* moon icon */}
            <FaMoon className="swap-off h-7 w-7 fill-current"/>
        </label>
    )
}