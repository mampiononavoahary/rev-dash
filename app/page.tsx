import Photo from './ui/Photo';
import Login from './ui/form/login';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20 bg-[url('https://media.istockphoto.com/id/943331302/fr/photo/concept-de-finance-et-dinvestissement.jpg?s=612x612&w=0&k=20&c=Bu_81R9T7A_GwzqSxHgTHxhdGctgcGPabH1nzuk3QxY=')] bg-cover bg-center">
          <h1 className='flex justify-center text-3xl font-semibold text-center'>Bienvenue chez Mi-Kôlecta</h1>
            <Photo/>
          <p className='flex justify-center text-center'>Cette application va vous aider à gérer la gestion de stock, la vente et l'achat.</p>
      <div/>
      </div>
        <div className="flex flex-col items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 rounded-lg gap-4 bg-[url('https://www.facilium.fr/wp-content/uploads/2020/12/facilium-0010-logistique-gestionnaire-de-stock.jpg')] bg-cover bg-center bg-opacity-50">
          {/* Add Hero Images Here */}
          <h2 className='bg-gray-900 p-4 rounded-lg text-white'>Connectez vous</h2>
          <Login/>
        </div>
      </div>
    </main>
  );
}
