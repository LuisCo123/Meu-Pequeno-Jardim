import { ThemeController } from "./themeControllerComponent"
import { GiGardeningShears } from "react-icons/gi"
import { FaUser } from "react-icons/fa6"
import { FaBars } from "react-icons/fa6"
import { useState } from "react"
import { Link } from "react-router-dom"
export const NavbarComponent = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return (
        <div className="navbar shadow-2xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <FaBars className="h-7 w-7" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-max p-2 shadow">
                        <li><a href="#">Inicio</a></li>
                        <li><a href="#saibaMais">Sobre nós</a></li>
                        <li><a>Seu pequeno Jardim</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center hidden sm:flex">
                <Link to={"/"} className="btn btn-ghost text-base sm:text-xl ">
                    <div className="sm:w-10 sm:h-10 w-6 h-6">
                        <img src="logo.png" alt="logo" className="rounded-full" />
                    </div> Meu Pequeno Jardim
                    <div className="sm:w-10 sm:h-10 w-6 h-6">
                        <img src="logo.png" alt="logo" className="rounded-full" />
                    </div>
                </Link>
            </div>
            <div className="navbar-center sm:hidden">
                <Link to={"/"} className="btn btn-ghost text-base sm:text-xl ">
                    <div className="sm:w-10 sm:h-10 w-6 h-6">
                        <img src="logo.png" alt="logo" className="rounded-full" />
                    </div> Meu Pequeno Jardim
                </Link>
            </div>
            <div className="navbar-end">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle md:hidden">
                        <FaBars className="h-7 w-7" />
                    </div>
                    {/* <div className="hidden w-full md:block md:w-auto navbar-end" id="navbar-default"> */}
                    <div className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3  p-2 shadow flex dropdown right-0 ">
                        <button className="btn btn-ghost btn-circle ">
                            <ThemeController />
                        </button>
                        <Link to="/login">
                            <button className="btn btn-ghost btn-circle ">
                                <GiGardeningShears className="h-7 w-7 fill-current" />
                            </button>
                        </Link>
                        <button className="btn btn-ghost btn-circle ">
                            <FaUser className="h-7 w-7 fill-current" />
                        </button>
                    </div>
                </div>
                <div className="flex-row hidden md:flex ">
                    <button className="btn btn-ghost btn-circle ">
                        <ThemeController />
                    </button>
                    <Link to="/login">
                        <button className="btn btn-ghost btn-circle ">
                            <GiGardeningShears className="h-7 w-7 fill-current" />
                        </button>
                    </Link>
                    <button className="btn btn-ghost btn-circle ">
                        <FaUser className="h-7 w-7 fill-current" />
                    </button>
                </div>
            </div>
        </div>
    )
}