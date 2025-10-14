import { motion } from "framer-motion";
import { useState } from "react";

export default function FileDrawer() {
    const [messages, setMessages] = useState<string[]>([]);

    return (
        <div className="mt-6 text-sm text-gray-500 relative h-[400px] flex flex-col">
            <div className="mb-2 text-xl text-[#27a082] font-semibold">Pièces jointes</div>
            <div className="flex-1 relative flex items-center justify-center bg-white border-gray-200 rounded-lg p-4 overflow-hidden">
                {messages.length === 0 ? (
                    <motion.div
                        className="flex flex-col items-center justify-center text-gray-400"
                    >
                        <img
                            src="data:image/svg+xml,%3csvg%20width='162'%20height='120'%20viewBox='0%200%20162%20120'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M160.671%2095.8694C155.789%20108.294%20137.299%20108.969%20114.224%20102.912C91.1482%2096.8544%2048.3962%20136.118%2022.2498%20112.192C-0.118767%2090.6467%2025.6845%2062.3185%2015.8448%2045.7481C3.00236%2025.9897%2014.904%2013.0642%2019.5428%208.52858C28.3707%201.07938%2043.6982%20-2.14389%2054.6177%201.50993C65.5372%205.16376%2073.8977%2022.2061%2093.5208%2015.3703C113.144%208.53448%20130.102%20-0.580915%20139.352%2019.8439C144.843%2036.5058%20135.004%2037.7385%20144.343%2055.1996C153.683%2072.6607%20165.552%2083.4423%20160.671%2095.8694Z'%20fill='%23F9FAFC'/%3e%3cpath%20d='M52.6455%2096.5007L59.7196%2068.4465L67.436%2034.8538C68.7501%2029.1253%2073.8825%2025.3795%2078.8403%2026.53L146.358%2042.1491C151.316%2043.2966%20154.296%2048.9241%20152.979%2054.6497L145.266%2088.2423C143.951%2093.9709%20138.819%2097.7166%20133.861%2096.5661L81.2881%2084.3777L52.6455%2096.5007Z'%20fill='%23E3E5E9'/%3e%3c/svg%3e"
                            alt="placeholder"
                            className="w-20 mb-3"
                        />
                        <p>Aucune pièce jointe n'a encore été ajoutée à la demande.</p>
                    </motion.div>
                ) : (

                    <motion.div
                        className="w-full h-full overflow-auto space-y-3"
                    >
                        {messages.map((msg, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded border border-gray-100">
                                <p>{msg}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
