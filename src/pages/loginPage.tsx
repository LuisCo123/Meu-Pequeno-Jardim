import { useContext, useEffect, useState } from "react"
import { authService } from "../services/authService";
import { UserContext } from "../context/userContext";

export const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const authservice = authService;
    const logar = (e: any) => {
        e.preventDefault();
        authservice.authUser().then((response) => {
            if (response) {
                setUser({ logged: true });
            }
        })
    }

    const handleCadastrarLogin = () => {
        let item: HTMLFormElement | null = document.getElementById("loginForm") as HTMLFormElement;
        item.reset();
        setIsLogin(!isLogin);
    }

    useEffect(() => {
        console.log(user);
    }, [user])
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div id="start" className="hero min-h-screen shadow-2xl" style={{ backgroundImage: "url(./bglogin.jpg)", }}>
            </div>
            <div className="hero-overlay bg-opacity-50 "></div>
            <div className=" h-[80%] w-screen gap-7 lg:gap-0 items-center justify-center lg:self-end card-body lg:items-end lg:justify-end flex flex-col lg:flex-row-reverse">
                {
                    isLogin ?
                        <div className="min-h-max lg:min-h-[100%] card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <form id="loginForm" className="card-body" onSubmit={(e) => logar(e)}>
                                <h3 className="text-3xl font-bold">Login</h3>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">senha</span>
                                    </label>
                                    <input type="password" placeholder="senha" className="input input-bordered" required />
                                    <label className="label">
                                        <a href="#" className="label-text-alt link link-hover">Esqueceu senha?</a>
                                    </label>
                                </div>
                                <div className="form-control mt-6 gap-4">
                                    <button className="btn btn-primary">Login</button>
                                    <div className="btn btn-neutral" onClick={() => handleCadastrarLogin()}> Cadastrar</div>
                                </div>
                            </form>
                        </div>
                        :
                        <div className="min-h-max lg:min-h-[100%] card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <form id="loginForm" className="card-body">
                                <h3 className="text-3xl font-bold">Cadastro</h3>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nome</span>
                                    </label>
                                    <input type="nome" placeholder="nome" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">senha</span>
                                    </label>
                                    <input type="password" placeholder="senha" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Confirmar senha</span>
                                    </label>
                                    <input type="password" placeholder="Confirmar senha" className="input input-bordered" required />
                                </div>
                                <div className="form-control mt-6 gap-4">
                                    <button className="btn btn-primary">Confirmar</button>
                                    <div className="btn btn-neutral" onClick={() => handleCadastrarLogin()}>Login</div>
                                </div>
                            </form>
                        </div>
                }

            </div >
        </div >
    )
}