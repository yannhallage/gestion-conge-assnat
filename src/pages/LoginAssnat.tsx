import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const LoginAssnat: React.FC = () => {
    const [loader,setLoader] = useState(false)
    const [email,setEmail] = useState<string>('')
    const [password, SetPassword] = useState<string>('')
    const [textError, setTextError] = useState<string>()
    
    const HandleClickLoginAssnat = () => {
        if (password && email) {
            setLoader(true)
            setTimeout(() => {
                setLoader(false)
            }, 300)
        } else {
            setTextError('veuillez verifier les champs de saisis')
            
        }
    }
    return (
        <div className="flex h-screen bg-gray-100">
            {/* SECTION GAUCHE - IMAGE / CONTENU INSTITUTIONNEL */}
            <div className="hidden lg:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-10 relative">
                <div className="absolute top-8 left-8 text-2xl font-bold tracking-wide">
                    Assnat · Service Public
                </div>

                <div className="max-w-md text-center">
                    <h1 className="text-4xl font-semibold mb-4">
                        Portail Administratif
                    </h1>
                    <p className="text-gray-200 text-lg leading-relaxed">
                        Accédez à votre espace pour gérer vos dossiers, congés et informations
                        internes de manière sécurisée et simplifiée.
                    </p>
                </div>

                <div className="absolute bottom-8 text-sm text-gray-300">
                    © 2025 Ministère des Affaires Administratives
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
                <div className="max-w-md w-full p-8">
                    {/* Logo institution */}
                    <div className="flex justify-center mb-8">
                        <img
                            src="https://www.assnat.ci/imgsite/logo-anci4.png"
                            alt="Logo Institution"
                            className="w-20 h-20"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Connexion à votre compte
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            
                        }}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Adresse e-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                 onChange={(e) => setEmail(e.target.value)} 
                                placeholder="exemple@institution.ci"
                                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => SetPassword(e.target.value)} 
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="">
                            <p className="mt-6 text-center text-sm text-red-500">
                                {textError}
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2 accent-blue-600"
                                />
                                Se souvenir de moi
                            </label>
                            <a href="#" className="text-blue-700 hover:underline">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-700 cursor-pointer text-white py-2  hover:bg-blue-800 transition font-medium"
                            onClick={HandleClickLoginAssnat}
                        >
                            {loader ? <ClipLoader
                                color="#2563EB"
                                loading={loader}
                                size={16}
                                speedMultiplier={3}
                                aria-label="Chargement..."
                                data-testid="loader"
                            /> : 'Se connecter'} 
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Besoin d’aide ? Contactez le service informatique.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginAssnat;
