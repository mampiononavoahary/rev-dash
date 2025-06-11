'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce";

export default function BilanFilter() {
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
    <div>
      <div className='flex flex-col gap-2 mb-2 bg-gray-100 px-4 py-2 mt-6'>
        <h4 className='flex justify-center text-center'>Filtrer à l'interval de deux date</h4>
        <div className='flex flex-row'>
          <h5 className='text-fuchsia-700'>Début: </h5>
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="startDate" className="sr-only">
              Date
            </label>
            <input
              id="startDate"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              onChange={(e) => {
                handleFilterChange('startDate', e.target.value.toString());
              }}
              defaultValue={searchParams.get('startDate')?.toString()}
            />
          </div>
        </div>
        <div className='flex flex-row'>
          <h5 className='text-pink-600'>Fin: </h5>
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="endDate" className="sr-only">
              Date
            </label>
            <input
              id="endDate"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              onChange={(e) => {
                handleFilterChange('endDate', e.target.value.toString());
              }}
              defaultValue={searchParams.get('endDate')?.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
