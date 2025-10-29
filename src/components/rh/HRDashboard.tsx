import React, { useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import TurnoverByType from "./TurnoverByType";
import TurnoverChart from "./TurnoverChart";
import FilterSelect from "./FilterSelect";

interface Filters {
  year: string;
  establishment: string;
  genre: string;
  poste: string;
  contrat: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean | null;
}

const HRDashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    year: "Année glissante",
    establishment: "Tous",
    genre: "Genre",
    poste: "Poste",
    contrat: "Contrat",
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const stats: Stat[] = [
    { label: "EFFECTIFS", value: "29", change: "+6", isPositive: true },
    { label: "ARRIVÉES", value: "3", change: "+1", isPositive: true },
    { label: "DÉPARTS", value: "2", change: "-1", isPositive: false },
    { label: "TURNOVER", value: "168,75%", change: "", isPositive: null },
    { label: "TAUX DE DÉPARTS", value: "37,50%", change: "", isPositive: null },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Effectifs</h1>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
      >
        <FilterSelect
          value={filters.year}
          onChange={(value) => handleFilterChange("year", value)}
          options={["Année glissante", "2023", "2024", "2025"]}
          label="Date"
        />
        <FilterSelect
          value={filters.establishment}
          onChange={(value) => handleFilterChange("establishment", value)}
          options={["Tous", "Restaurant", "Hôtel", "Boulangerie", "Magasin"]}
          label="Établissement"
        />
        <FilterSelect
          value={filters.genre}
          onChange={(value) => handleFilterChange("genre", value)}
          options={["Genre", "Homme", "Femme", "Autre"]}
          label="Genre"
        />
        <FilterSelect
          value={filters.poste}
          onChange={(value) => handleFilterChange("poste", value)}
          options={["Poste", "Manager", "Employé", "Stagiaire"]}
          label="Poste"
        />
        <FilterSelect
          value={filters.contrat}
          onChange={(value) => handleFilterChange("contrat", value)}
          options={["Contrat", "CDI", "CDD", "Stage"]}
          label="Contrat"
        />
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <TurnoverChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <TurnoverByType />
        </motion.div>
      </div>
    </div>
  );
};

export default HRDashboard;
