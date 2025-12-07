import ComptabiliteHeader from "../../../../components/comptabilite/ComptabiliteHeader";
import PaiementsTable from "../../../../components/comptabilite/PaiementsTable";

export default function ComptabiliteFeature() {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <ComptabiliteHeader />
            <main className="flex-1 overflow-y-auto">
                <PaiementsTable />
            </main>
        </div>
    );
}

