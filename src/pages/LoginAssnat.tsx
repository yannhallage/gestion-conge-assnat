import React, { useState } from 'react';
import img from './../assets/36281.png'
import { ArrowLeft, Eye, EyeOff, Facebook } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
// import { useToast } from "@/components/ui/use-toast";

const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.41 44 30.561 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19.3,4.35a4.3,4.3,0,0,0-2.82-1.23,4.69,4.69,0,0,0-3.73,2,4.47,4.47,0,0,0-1.49-2A4.82,4.82,0,0,0,7.5,3.1a4.57,4.57,0,0,0-3.15,5.27,9.75,9.75,0,0,0,2.13,3.78,11.2,11.2,0,0,0,3.32,2.82,10.5,10.5,0,0,0,2.44,1.14,10.2,10.2,0,0,0,2.13-.1,1,1,0,0,0,.5-.29,14.28,14.28,0,0,0,2.91-3.33A5.2,5.2,0,0,0,19.3,4.35Zm-5.32.53a2.63,2.63,0,0,1,1.54-2.12,2.36,2.36,0,0,1,2.33.78,2.3,2.3,0,0,1-.78,3.24,2.44,2.44,0,0,1-1.63.49A2.36,2.36,0,0,1,14,4.88Z"></path>
    </svg>
);


const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isButton, setIsButton] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // const { toast } = useToast();

    const handleFeatureClick = () => {
        // toast({
        //     title: "🚧 Fonctionnalité en cours de développement !",
        //     description: "Ne vous inquiétez pas, vous pourrez la demander dans votre prochain message ! 🚀",
        // });
        setIsButton(true)
    };

    const cliploader = () => {
        setIsButton(true);
        setTimeout(() => {
            setIsButton(false);
        }, 2000);
    }
    return (
        <div className="min-h-screen bg-white font-sans">
            <header className="p-4 border-b border-gray-200">
                <div className="container mx-auto flex items-center justify-between">
                    <button className="text-gray-600 hover:text-gray-900" onClick={handleFeatureClick}>
                        {/* <ArrowLeft size={24} /> */}
                    </button>
                    <img src="https://www.assnat.ci/imgsite/logo-anci4.png" alt="Logo" className="h-10" />
                    <div className="w-6"></div>
                </div>
            </header>

            <div className="container mx-auto p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-5xl md:grid md:grid-cols-2 md:gap-16 md:ml-11 items-center">
                    <div className="w-full max-w-md mx-auto">
                        <h1 className="text-2xl font-bold text-center text-gray-800">ASSNAT</h1>
                        <p className="text-gray-500 text-center mt-2 mb-6">Accédez à votre espace de travail institutionnel pour profiter de toutes nos fonctionnalités</p>

                        <div className="flex border border-gray-200 rounded-md p-1 mb-6 bg-gray-50">
                            <button
                                className={`w-1/2 py-2 text-sm font-semibold rounded-md ${isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Connexion
                            </button>
                            <button
                                className={`w-1/2 py-2 text-sm font-semibold rounded-md ${!isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Admin
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            <button onClick={handleFeatureClick} className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"><AppleIcon />Apple</button>
                            <button onClick={handleFeatureClick} className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"><GoogleIcon />Google</button>
                            <button onClick={handleFeatureClick} className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"><Facebook size={16} className="mr-2 text-[#1877F2]" />Facebook</button>
                        </div>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-200" />
                            <span className="mx-4 text-xs font-medium text-gray-400">OU</span>
                            <hr className="flex-grow border-gray-200" />
                        </div>

                        <form>
                            <div className="mb-4">
                                <input type="email" placeholder={isLogin ? `Adresse email` : `Adresse email administrateur`} className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div className="relative mb-4">
                                <input type={showPassword ? "text" : "password"} placeholder={isLogin ? `Mot de passe` : 'Mot de passe administrateur'} className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="text-right mb-6">
                                <button type="button" className="text-sm font-medium text-[#27a082] hover:underline">Mot de passe oublié</button>
                            </div>

                            <button onClick={cliploader} type="button" className="w-full cursor-pointer bg-[#27a082] text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors">
                                {isButton ? (
                                    <ClipLoader
                                        color="#fff"
                                        loading={true}
                                        size={20}
                                        speedMultiplier={2}
                                        aria-label="Chargement..."
                                    />
                                ) : (
                                    "Se connecter"
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <button  className="text-sm font-medium text-[#27a082] hover:underline">Je n'ai pas de mot de passe</button>
                        </div>

                        <div className="flex items-center justify-center pt-4">
                            <div className="flex items-center border-[#ccc] space-x-2 px-4 py-2 bg-secondary/5 border border-secondary/10 rounded-full">
                                {/* <Icon
                                    name="Award"
                                    size={14}
                                    color="var(--color-secondary)"
                                /> */}
                                <span className="text-xs font-caption text-[#555] text-secondary font-medium">
                                    Gouvernement de Côte d'Ivoire
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className="hidden md:block">
                        <img className="rounded-lg object-cover w-100 h-100"
                            alt="Family enjoying a road trip next to their car in a sunny field"
                            src={img} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;