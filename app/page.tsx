import Photo from './ui/Photo';
import Login from './ui/form/login';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-4 overflow-x-hidden !overflow-y-auto bg-gray-100">
      <div className="flex grow flex-col gap-4 md:flex-row md:overflow-auto">
        {/* Section gauche */}
        <div className="flex flex-col justify-center items-center gap-4 rounded-lg bg-white px-6 py-10 md:w-2/5 shadow-lg bg-custom-bg bg-cover bg-center">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">
            Bienvenue chez <span className="text-blue-600">Mi-Kôlecta</span>
          </h1>
          <Photo />
          <p className="text-center text-gray-700 max-w-sm">
            Cette application va vous aider à gérer la gestion de stock, la vente et l'achat.
          </p>
        </div>

        {/* Section droite */}
        <div className="flex flex-col items-center justify-center p-6 md:w-3/5 rounded-lg bg-custom-bg2 bg-cover bg-center relative">
          {/* Effet de verre (Glassmorphism) */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-xl p-6 w-full max-w-sm md:max-w-md">
            <h2 className="text-lg font-semibold text-center text-green-800 mb-4">Connectez-vous</h2>
            <Login />
          </div>
        </div>
      </div>
    </main>
  );
}

