




import Photo from './ui/Photo';
import Login from './ui/form/login';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-4 overflow-x-hidden !overflow-y-auto">
      <div className="flex grow flex-col gap-4 md:flex-row md:overflow-auto">
        {/* Section gauche */}
        <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-2 py-8 md:w-2/5 bg-custom-bg bg-cover bg-center">
          <h1 className="flex justify-center text-3xl font-semibold text-center">
            Bienvenue chez Mi-Kôlecta
          </h1>
          <Photo />
          <p className="flex justify-center text-center">
            Cette application va vous aider à gérer la gestion de stock, la vente et l'achat.
          </p>
        </div>

        {/* Section droite */}
        <div className="flex flex-col items-center justify-center p-4 md:w-3/5 rounded-lg gap-4 bg-custom-bg2 bg-cover bg-center bg-opacity-50">
          <h2 className="bg-gray-900 bg-opacity-50 p-4 rounded-lg text-white">Connectez-vous</h2>
          <Login />
        </div>
      </div>
    </main>
  );
}

