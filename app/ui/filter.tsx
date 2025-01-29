
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Filter({ datePlaceholder, locationPlaceholder,dateDebutPlaceholder,dateFinPlaceholder }: { datePlaceholder: string, locationPlaceholder: string, dateDebutPlaceholder:string, dateFinPlaceholder:string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = useDebouncedCallback((key: string, value: string) => {
    console.log(`Filtering by ${key}: ${value}`);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className="flex flex-col gap-2 mb-2 bg-gray-100 px-4 py-2">
        {/* Filter by Location */}
        <h4 className='flex justify-center text-center'>Filtrer par point de vente et date de transaction</h4>
        <div className="relative flex flex-1 flex-shrink-0">
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={locationPlaceholder}
            onChange={(e) => {
              handleFilterChange('location', e.target.value);
            }}
            defaultValue={searchParams.get('location')?.toString()}
          />
        </div>

        {/* Filter by Date */}
        <div className="relative flex flex-1 flex-shrink-0">
          <label htmlFor="date" className="sr-only">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={datePlaceholder}
            onChange={(e) => {
              handleFilterChange('date', e.target.value.toString());
            }}
            defaultValue={searchParams.get('date')?.toString()}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2 mb-2 bg-gray-100 px-4 py-2'>
        <h4 className='flex justify-center text-center'>Filtrer à l'interval de deux date</h4>
        <div className='flex flex-row'>
          <h5 className='text-fuchsia-700'>Début: </h5>
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="dateDebut" className="sr-only">
              Date
            </label>
            <input
              id="dateDebut"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder={dateDebutPlaceholder}
              onChange={(e) => {
                handleFilterChange('dateDebut', e.target.value.toString());
              }}
              defaultValue={searchParams.get('dateDebut')?.toString()}
            />
          </div>
        </div>
        <div className='flex flex-row'>
          <h5 className='text-pink-600'>Fin: </h5>
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="dateFin" className="sr-only">
              Date
            </label>
            <input
              id="dateFin"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder={dateFinPlaceholder}
              onChange={(e) => {
                handleFilterChange('dateFin', e.target.value.toString());
              }}
              defaultValue={searchParams.get('dateFin')?.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

