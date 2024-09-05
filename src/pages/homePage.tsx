import { BiHomeAlt2 } from "react-icons/bi"
import { BsArrowDownCircleFill, BsArrowUpCircleFill } from "react-icons/bs"
import { GiGardeningShears } from "react-icons/gi"
import { TbGardenCart } from "react-icons/tb"
import { Link } from "react-router-dom"

export const HomePage = () => {

    return (
        <div>
            <div id="start" className="hero min-h-screen shadow-2xl" style={{ backgroundImage: "url(./bg.jpg)", }}>
                <div className="hero-overlay bg-opacity-40 "></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Olá</h1>
                        <p className="mb-5">Seja bem vindo ao Meu Pequeno jardim, um compacto jardim automatizado!</p>
                        <div className="flex flex-row justify-evenly">
                            <button className="btn btn-primary" onClick={() => document.getElementById('saibaMais')?.scrollIntoView()}>Saiba mais</button>
                            <Link to="/login">
                                <button className="btn btn-neutral  sm:w-auto mb-3">Acessar meu jardim</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div id="saibaMais" className="hero bg-base-200 min-h-screen pt-16">
                <div className="hero-content flex flex-col justify-evenly">
                    <button className="btn btn-secondary mb-3 btn-circle col-12" onClick={() => document.getElementById('start')?.scrollIntoView()}><BsArrowUpCircleFill className="w-4 h-4" /></button>
                    <div className="flex justify-center items-center gap-2 p-2 flex-col lg:flex-row">
                        <img
                            src="IsometricGarden.jpg"
                            className="max-w-[16rem] sm:max-w-sm rounded-lg shadow-2xl" />
                        <div className="p-4 flex flex-col justify-center items-center">
                            <h1 className="text-5xl font-bold">Meu Pequeno Jardim!</h1>
                            <p className="py-6">O "Meu Pequeno Jardim" é um sistema de plantio compacto e inteligente, ideal para quem deseja cultivar hortaliças, plantas e flores dentro de casa. Totalmente automatizado, este produto permite o cultivo heterogêneo, acomodando diferentes tipos de plantas em um único espaço. Com controle online, você pode monitorar e gerenciar a umidade do solo e o tempo de exposição à luz, garantindo o ambiente perfeito para o crescimento saudável das suas plantas, tudo com a conveniência e praticidade que o "Meu Pequeno Jardim" oferece.</p>
                            <div className="flex flex-col sm:flex-row justify-evenly w-11/12 gap-3">
                                <button className="btn btn-primary  sm:w-auto h-max"><TbGardenCart className="w-7 h-7 " /> Solicitar Seu pequeno jardim</button>
                                <button className="btn btn-neutral  sm:w-auto "><Link to="/login " className="flex flex-row items-center gap-2"><GiGardeningShears className="w-7 h-7" /> Acessar meu jardim</Link></button>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-secondary mb-3 btn-circle col-12" onClick={() => document.getElementById('oProduto')?.scrollIntoView()}><BsArrowDownCircleFill className="w-4 h-4" /></button>
                </div>
            </div>

            <div id="oProduto" className="hero bg-base-200 min-h-screen pt-16">
                <div className="hero-content flex flex-col justify-evenly ">
                    <button className="btn btn-secondary mb-3 btn-circle col-12" onClick={() => document.getElementById('saibaMais')?.scrollIntoView()}><BsArrowUpCircleFill className="w-4 h-4" /></button>
                    <div className="flex justify-center items-center gap-2 p-2 flex-col lg:flex-row-reverse">
                        <img
                            src="Project person.jpg"
                            className="max-w-[16rem] sm:max-w-sm rounded-lg shadow-2xl" />
                        <div className="p-4 flex flex-col justify-center items-center">
                            <h1 className="text-5xl font-bold">Seu Pequeno Jardim!</h1>
                            <p className="py-6">Para realizar sua conexão é simples, acesse a rede wifi do seu pequeno jardim, ligue ele em uma rede wifi em sua casa e a partir plante sua horta e tenha em prontidão sua horta monitorada.</p>
                            <div className="flex flex-col sm:flex-row justify-evenly gap-3 w-11/12">
                                <button className="btn btn-primary  sm:w-auto h-max"><TbGardenCart className="w-7 h-7" /> Solicitar Seu pequeno jardim</button>
                                <button className="btn btn-neutral  sm:w-auto "><Link to="/login " className="flex flex-row items-center gap-2"><GiGardeningShears className="w-7 h-7" /> Acessar meu jardim</Link></button>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-secondary mb-3 btn-circle col-12" onClick={() => document.getElementById('start')?.scrollIntoView()}><BiHomeAlt2 className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    )
}