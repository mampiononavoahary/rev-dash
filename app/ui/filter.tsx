
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Filter({ datePlaceholder, locationPlaceholder }: { datePlaceholder: string, locationPlaceholder: string }) {
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
  }, 100);

  return (
    <div className="flex gap-2 mb-2">
      {/* Filter by Location */}
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
  );
}

