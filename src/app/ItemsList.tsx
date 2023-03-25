'use client';
import { Table } from '@/types';
import Link from 'next/link';
import { useItems } from './utils/react-query-hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const ItemsList = ({
  initialItems,
}: {
  initialItems: Table<'items'>[];
}) => {
  const { data: items } = useItems(initialItems);
  dayjs.extend(relativeTime);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-baseline">
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Stiri
        </h1>
        <div>
          <Link
            className="text-white bg-blue-600 rounded px-3 py-2"
            href="/new"
          >
            New Item
          </Link>
        </div>
      </div>
      {items.length ? (
        <div className="list-none space-y-2 m-0 pb-3 bg-white">
          {items.map((item) => (
            <Link
              href={`/item/${item.id}`}
              className="px-3 block cursor-pointer pt-4 pb-3 text-left text-sm font-semibold text-gray-900"
              key={item.id}
            >
              <div className="space-y-2">
                <p className="text-blue-600">{item.name}</p>
                <h3>{dayjs().to(item.created_at)}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No Items</p>
      )}
    </div>
  );
};
