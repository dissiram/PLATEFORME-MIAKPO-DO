import { useEffect, useState } from "react";
import {
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 20,
    activeUsers: 32,
    newUsers: 50,
    totalOffers: 30,
    pendingOffers: 25,
    newOffers: 40,
  });

  const offersByCategory = [
    { category: "Stage", total: 45 },
    { category: "CDI", total: 70 },
    { category: "CDD", total: 30 },
  ];

  useEffect(() => {
    // Remplacer par ton backend plus tard
    /*
    axios
      .get("http://localhost:5000/api/admin")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error(err));
    */
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* 🔹 HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-white px-4 py-3 shadow-sm rounded-lg">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Salut, Admin 
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <div className="relative w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, entreprise, lieu..."
              className="w-full rounded-full border border-gray-300 pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer">
              <BellIcon className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>
            <div className="relative cursor-pointer">
              <EnvelopeIcon className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>
            </div>
            <UserCircleIcon className="h-8 w-8 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* 🔹 STATISTIQUES */}
      <div className="flex flex-wrap gap-2 justify-between">
        <Card className="flex-1 bg-blue-50 min-w-[140px] shadow-none border-none p-2">
          <CardHeader className="flex items-center justify-between pb-1">
            <CardTitle className="text-xs">Utilisateurs</CardTitle>
            <UsersIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-1">
            <p className="text-lg font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500">{stats.activeUsers} actifs</p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[140px] bg-green-50 shadow-none border-none p-2">
          <CardHeader className="flex items-center justify-between pb-1">
            <CardTitle className="text-xs">Offres</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-1">
            <p className="text-lg font-bold">{stats.totalOffers}</p>
            <p className="text-xs text-gray-500">{stats.newOffers} nouvelles ce mois</p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[140px] bg-orange-50 shadow-none border-none p-2">
          <CardHeader className="flex items-center justify-between pb-1">
            <CardTitle className="text-xs">En attente</CardTitle>
            <ClockIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-1">
            <p className="text-lg font-bold">{stats.pendingOffers}</p>
            <p className="text-xs text-gray-500">à valider</p>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-purple-50 min-w-[140px] shadow-none border-none p-2">
          <CardHeader className="flex items-center justify-between pb-1">
            <CardTitle className="text-xs">Nouveaux inscrits</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-1">
            <p className="text-lg font-bold">{stats.newUsers}</p>
            <p className="text-xs text-gray-500">ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 HISTOGRAMME */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm md:text-base font-semibold mb-2">Offres par catégorie</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={offersByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
