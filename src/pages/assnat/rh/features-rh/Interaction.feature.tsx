import { motion } from "framer-motion";
import DrawerAddInteractions from "../../../../components/admin/Drawer-add-interaction";
import { useState } from "react";
import { Star } from "lucide-react";
import '../css/image.css'

interface Product {
    id: number;
    name: string;
    image: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    rating?: number;
}

const products: Product[] = [
    {
        id: 1,
        name: "Réfrigérateur 2 Battants - SMART TECHNOLOGY - ST...",
        image: "https://djokstore.ci/cdn/shop/files/Sans-titre-1bnhg.jpg?v=1734365679&width=360",
        price: "104,900 FCFA",
        oldPrice: "165,000 FCFA",
        discount: "-37%",
    },
    {
        id: 2,
        name: "Fer à Repasser à Sec STARTECH - 1300W - STDI...",
        image: "https://djokstore.ci/cdn/shop/files/Sans-titre-1bnhg.jpg?v=1734365679&width=360",
        price: "4,500 FCFA",
        oldPrice: "10,800 FCFA",
        discount: "-55%",
        rating: 4,
    }
];

export default function InteractionRhFeatures() {
    const [isOpen, setIsOpen] = useState(false)
    // const tableauData = ["ddd"]
    return (
        <>
            <motion.div className="h-full flex flex-col bg-white"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                <div className="flex items-center p-2 border-b border-[#ccc]">
                    <button
                        onClick={() => { setIsOpen(true) }}
                        className="flex items-center justify-center hover:bg-gray-20 cursor-pointer text-xl w-8 h-8 bg-[#27a082] text-white">
                        <svg data-tooltip-id="add" data-tooltip-content="add" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv lui_icon_1uqg37zrid"><g id="a-d/add"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M13 11L13 4L11 4L11 11L4.00001 11L4.00001 13H11L11 20H13L13 13H20L20 11H13Z" fill="currentColor"></path></g></svg>
                    </button>
                    <h1 className="ml-3 text-lg font-medium">Interaction</h1>
                </div>
                <div className="p-6 font-sans text-gray-800 h-screen overflow-y-auto ">
                    <RecommendedProducts />
                </div>

                {/* <NotInteraction /> */}
            </motion.div>

            <DrawerAddInteractions
                isOpen={isOpen} onClose={() => setIsOpen(false)}
            />
        </>
    );
}


function NotInteraction() {
    return (
        <motion.div className="flex  flex-col items-center justify-center h-[80vh] text-center text-gray-600"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <div className="relative">
                <div className="w-[520px] h-[220px] flex items-center justify-center">
                    <img src="data:image/svg+xml,%3csvg%20width='272'%20height='214'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_652_30126)'%3e%3cpath%20d='M55.1728%2085.1073L53.7656%2083.7002L35.6002%20101.866L37.0074%20103.273L55.1728%2085.1073Z'%20fill='white'/%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3cpath%20d='M208.269%200.0898438H62.8086V198.66H208.269V0.0898438Z'%20fill='%23E9ECEF'/%3e%3cpath%20d='M200.968%204.86035H192.078V194.53H200.968V4.86035Z'%20fill='%23DFE4E8'/%3e%3cpath%20d='M77.5484%206.29004H65.3984V195.96H77.5484V6.29004Z'%20fill='%23DFE4E8'/%3e%3cpath%20d='M199.222%209.04004H70.5117L77.5517%2014.56H192.052L199.222%209.04004Z'%20fill='%23D8DDE2'/%3e%3cpath%20d='M199.222%20189.83H70.5117L77.5517%20178.79H192.052L199.222%20189.83Z'%20fill='white'/%3e%3cpath%20d='M199.211%20140.83H70.5312V145.24H199.211V140.83Z'%20fill='white'/%3e%3cpath%20d='M199.222%20140.78H70.5117L77.5517%20135.28H192.052L199.222%20140.78Z'%20fill='%23DFE4E8'/%3e%3cpath%20d='M199.221%2096.48H70.5612L70.5312%2090.96H199.211V96.48H199.221Z'%20fill='white'/%3e%3cpath%20d='M199.241%2096.4902H70.5508L77.5308%2097.8902L192.081%2097.8402L199.241%2096.4902Z'%20fill='%23DFE4E8'/%3e%3cpath%20d='M199.25%2042.8799H70.5703V47.2899H199.25V42.8799Z'%20fill='white'/%3e%3cpath%20d='M199.292%2047.3799H70.6016L77.5816%2051.7099H192.062L199.292%2047.3799Z'%20fill='%23DFE4E8'/%3e%3cpath%20d='M42.0112%2098.6703C38.0112%2099.5703%2034.0212%2097.0103%2033.1212%2093.0203C32.2212%2089.0303%2034.7912%2085.0403%2038.7812%2084.1403C42.7812%2083.2403%2046.7712%2085.8003%2047.6712%2089.7903C48.5412%2093.7803%2046.0012%2097.7703%2042.0112%2098.6703Z'%20fill='%23D8DDE2'/%3e%3cpath%20d='M42.7219%2089.1704L41.4619%2088.4004L38.1719%2093.7604L39.4319%2094.5304L42.7219%2089.1704Z'%20fill='white'/%3e%3cpath%20d='M42.7098%2093.7202L43.4398%2092.5302L38.0698%2089.2402L37.3398%2090.4302L42.7098%2093.7202Z'%20fill='white'/%3e%3cpath%20d='M227.909%20133.68C224.999%20133.68%20222.629%20131.31%20222.629%20128.4C222.629%20125.49%20224.999%20123.12%20227.909%20123.12C230.819%20123.12%20233.189%20125.49%20233.189%20128.4C233.189%20131.31%20230.819%20133.68%20227.909%20133.68ZM227.909%20126.12C226.649%20126.12%20225.629%20127.14%20225.629%20128.4C225.629%20129.66%20226.649%20130.68%20227.909%20130.68C229.169%20130.68%20230.189%20129.66%20230.189%20128.4C230.189%20127.15%20229.169%20126.12%20227.909%20126.12Z'%20fill='%23DCE2EA'/%3e%3cpath%20d='M241.651%20111.24C235.091%20112.69%20228.501%20108.52%20227.041%20101.97C225.581%2095.4195%20229.761%2088.8395%20236.331%2087.3895C242.891%2085.9395%20249.481%2090.1095%20250.941%2096.6595C252.421%20103.21%20248.241%20109.76%20241.651%20111.24Z'%20fill='%23D8DDE2'/%3e%3cpath%20d='M242.842%2095.6098L240.762%2094.3398L235.352%20103.15L237.432%20104.42L242.842%2095.6098Z'%20fill='white'/%3e%3cpath%20d='M251.001%20130.3C252.401%20130.3%20253.541%20129.16%20253.541%20127.76C253.541%20126.36%20252.401%20125.22%20251.001%20125.22C249.601%20125.22%20248.461%20126.36%20248.461%20127.76C248.461%20129.17%20249.591%20130.3%20251.001%20130.3Z'%20fill='%23E8EAED'/%3e%3cpath%20d='M208.29%200H203H199.27H70.5495H63.4795H61.5195V198.57H61.5495V198.75H207.65V198.57H208.28V0H208.29ZM199.26%209.01V189.78H70.5495V9.01H199.26Z'%20fill='%23E8EAED'/%3e%3cpath%20d='M77.6016%2051.7998L78.7916%2052.5398L79.3516%2081.1898L77.6016%2081.2998V51.7998Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M78.2008%2052.91L77.5508%2051.75H106.891L106.941%2052.9L78.2008%2052.91Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M79.2422%2053.5099L79.7222%2052.6299L106.922%2060.6899L106.342%2062.1699L79.2422%2053.5099Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M78.9727%2053.9499L79.0727%2052.6699L100.493%2069.8099L99.5927%2070.9699L78.9727%2053.9499Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M79.11%2054.91L79.6%2053.11C79.66%2052.12%2088.48%2079.73%2088.4%2079.75L87.11%2080.42C87.04%2080.45%2079.03%2054.93%2079.11%2054.91Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M81.5417%2054.4197C80.7917%2055.3697%2079.4617%2056.4797%2078.6117%2056.4797C77.7617%2056.4797%2077.9517%2053.6397%2077.9517%2052.8297C77.9517%2052.0197%2082.0217%2052.3497%2082.0217%2052.3497C82.0217%2052.3497%2082.3017%2053.4697%2081.5417%2054.4197Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M88.3522%2052.0597C88.1422%2053.6897%2087.6622%2055.3197%2086.8722%2056.8697C84.9422%2060.6997%2081.6522%2063.1497%2078.1922%2063.7897C78.1622%2064.2597%2078.0922%2064.7297%2077.9922%2065.1797C81.8422%2064.6897%2085.6522%2061.9197%2087.8822%2057.4997C88.7822%2055.7097%2089.3322%2053.8197%2089.5522%2051.9697C89.1622%2052.0097%2088.7622%2052.0397%2088.3522%2052.0597Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M95.1811%2052.2196C94.8511%2054.6796%2094.8611%2056.0096%2091.9311%2061.2396C87.1711%2067.8196%2083.9511%2069.6296%2078.4311%2070.5996C78.3811%2071.3196%2078.2711%2071.3696%2078.1211%2072.0496C84.2511%2071.3096%2090.3111%2067.1196%2093.8711%2060.4296C95.3111%2057.7196%2096.1811%2054.8696%2096.5311%2052.0596C95.9011%2052.1396%2095.8311%2052.1896%2095.1811%2052.2196Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M101.821%2052.4703C101.371%2055.6503%20100.821%2060.8403%2094.8713%2068.0603C90.7513%2072.8003%2085.1712%2075.5303%2079.4512%2076.4903C79.3812%2077.4203%2079.2313%2077.2503%2079.0312%2078.1303C87.2812%2077.1703%2095.4512%2071.7603%20100.241%2063.1003C102.181%2059.5903%20103.351%2055.9103%20103.831%2052.2803C102.981%2052.3703%20102.691%2052.4303%20101.821%2052.4703Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M191.979%2098.21L191.349%2099.23L166.719%2099.71L166.629%2098.21H191.979Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M191.027%2098.7202L192.027%2098.1602V123.38L191.037%20123.43L191.027%2098.7202Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M190.52%2099.6201L191.27%20100.03L184.34%20123.41L183.07%20122.91L190.52%2099.6201Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M190.14%2099.3799L191.24%2099.4699L176.5%20117.88L175.5%20117.1L190.14%2099.3799Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M189.309%2099.5004L190.859%2099.9304C191.709%2099.9804%20167.979%20107.56%20167.959%20107.5L167.379%20106.39C167.359%20106.32%20189.289%2099.4404%20189.309%2099.5004Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M189.727%20101.59C188.907%20100.94%20187.957%2099.8002%20187.957%2099.0702C187.957%2098.3402%20190.397%2098.5002%20191.097%2098.5002C191.797%2098.5002%20191.507%20102%20191.507%20102C191.507%20102%20190.547%20102.24%20189.727%20101.59Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M191.76%20107.44C190.36%20107.26%20188.96%20106.84%20187.62%20106.17C184.33%20104.51%20182.23%20101.68%20181.67%2098.71C181.26%2098.68%20180.87%2098.62%20180.48%2098.54C180.9%20101.85%20183.28%20105.12%20187.08%20107.04C188.62%20107.82%20190.24%20108.28%20191.84%20108.48C191.8%20108.14%20191.78%20107.79%20191.76%20107.44Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M191.628%20113.32C189.518%20113.03%20188.368%20113.05%20183.868%20110.53C178.208%20106.44%20176.658%20103.67%20175.828%2098.9204C175.208%2098.8704%20175.158%2098.7804%20174.578%2098.6504C175.218%20103.92%20178.808%20109.13%20184.568%20112.19C186.898%20113.43%20189.348%20114.17%20191.758%20114.48C191.688%20113.94%20191.648%20113.88%20191.628%20113.32Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M191.408%20119.02C188.678%20118.63%20184.208%20118.16%20178.008%20113.04C173.938%20109.5%20171.588%20104.7%20170.758%2099.7897C169.958%2099.7297%20170.108%2099.5997%20169.348%2099.4297C170.178%20106.52%20174.828%20113.55%20182.268%20117.66C185.288%20119.33%20188.448%20120.33%20191.568%20120.75C191.488%20120.02%20191.438%20119.77%20191.408%20119.02Z'%20fill='%23FEFEFE'/%3e%3cpath%20d='M243.189%20103.41L244.459%20101.33L235.649%2095.9199L234.379%2097.9999L243.189%20103.41Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_652_30126'%3e%3crect%20width='271.98'%20height='213.38'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e" alt="" />
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-gray-700 text-lg mt-6">
                    Aucune demande historique
                </h2>
            </div>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
                Il n'y a actuellement aucune demande historique. Toutes les Demandes historiques seront affichées ici.
            </p>
        </motion.div>
    )
}


const RecommendedProducts: React.FC = () => {
    const tableauData = ["ddd"]
    return (
        <>
            {tableauData.length > 0 ? (
                <>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Recherche de demande"
                            className="border border-[#ccc] px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-green-200"
                        />

                        <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2">
                            <span className="text-gray-500 "><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/date"><g id="Frame 4"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M8 3H6V5H5.11765C3.9481 5 3 5.95513 3 7.13333V18.8667C3 20.0449 3.9481 21 5.11765 21H18.8824C20.0519 21 21 20.0449 21 18.8667V7.13333C21 5.95513 20.0519 5 18.8824 5H18V3H16V5H8V3ZM5.11765 18.8667L5.11765 11H18.8824V18.8667H5.11765ZM7 16V14H9V16H7ZM11 14H13V16H11V14Z" fill="currentColor"></path></g></g></svg></span>
                            <span>Date: Tous</span>
                        </button>

                        <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 rounded  gap-2 text-sm text-gray-700 border-[#ccc] px-3 py-2">
                            <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/status"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12ZM19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" fill="currentColor"></path></g></svg></span>
                            <span>Statut: Quelconque</span>
                        </button>

                        <button className="flex items-center gap-2 bg-[#f6f7f9] text-sm hover:bg-gray-50 rounded text-gray-700 border-[#ccc] px-3 py-2">
                            <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/palm"><g id="palm"><path id="Vector" d="M18.7303 10.5533C17.8577 9.6315 16.7769 9.27469 15.7654 9.18548L18.1254 8.46194L18.5221 7.45097L19.1964 8.18442L20.5449 7.61946C20.5449 7.61946 19.5434 4.82441 16.291 5.46866C15.2895 5.66689 14.5656 6.13273 14.0599 6.68778C13.9508 5.91468 13.6236 5.11185 12.9096 4.34866C10.5992 1.87078 8.22932 3.56565 8.22932 3.56565L9.01268 4.83432L9.96461 4.63609L9.73654 5.69663L11.3132 7.76814C10.391 7.12389 9.13167 6.73734 7.48562 7.27256C4.82814 8.15468 3.86629 10.5434 3.90596 11.4057L5.25453 11.2669L5.75033 10.4542L6.19654 11.0885L7.98142 10.9795L8.51688 9.94867L8.92343 10.7912L11.6999 10.3848C10.6091 11.6733 9.41923 13.7745 9.3994 16.7975C9.42915 16.7876 9.45889 16.7876 9.49856 16.7777C9.8952 16.7182 10.3018 16.6885 10.7083 16.6885C11.2636 16.6885 11.809 16.748 12.3444 16.857C12.3742 16.8669 12.394 16.8669 12.4238 16.8768C12.3048 15.3901 12.4733 12.6446 13.6038 10.6524L16.172 13.1402L16.9554 12.8726L16.9355 13.8637L18.3733 15.0729L19.0675 14.7855L18.9286 15.6974L20.0491 16.6885C20.7532 15.1225 21.0903 13.0312 18.7303 10.5533Z" fill="currentColor"></path><path id="Vector_2" d="M10.6982 17.2432C10.3115 17.2432 9.9347 17.2729 9.56781 17.3324C7.23756 17.6892 5.34361 19.1164 4.58008 20.9996H16.8164C16.1024 19.2255 14.377 17.8577 12.2352 17.4017C11.7493 17.2927 11.2337 17.2432 10.6982 17.2432Z" fill="currentColor"></path></g></g></svg></span>
                            <span>Type d'absence: Quelconque</span>
                        </button>
                    </div>
                    <section className="bg-gray-50 py-6">
                        {/* <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-sm font-semibold text-yellow-500 mb-4">
                                PRODUITS RECOMMANDÉS
                            </h2>

                            <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0 w-[230px] p-4 relative"
                                    >
                                        {product.discount && (
                                            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                                                {product.discount}
                                            </span>
                                        )}

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-36 object-contain mb-3"
                                        />

                                        <h3 className="text-sm font-medium text-gray-800 leading-tight mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {product.rating && (
                                            <div className="flex items-center mb-1">
                                                {[...Array(product.rating)].map((_, i) => (
                                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-gray-900">
                                                {product.price}
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-gray-400 text-sm line-through">
                                                    {product.oldPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </section>
                </>
            ) : (
                <NotInteraction />
            )}
        </>
    );
};