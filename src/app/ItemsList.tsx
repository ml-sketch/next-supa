'use client';
import { Table } from '@/types';
import Link from 'next/link';
import { useInfiniteItems } from './utils/react-query-hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfiniteScroll from 'react-infinite-scroll-component';

export const ItemsList = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteItems({ limit: 5 });

  dayjs.extend(relativeTime);

  return (
    <div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        Items
      </h1>
      {data && (
        <InfiniteScroll
          dataLength={data.pages.reduce(
            (acc, curr) => acc + curr.data.length,
            0
          )}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          className="space-y-8"
        >
          {data.pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="list-none space-y-2 m-0 pb-3 bg-white"
            >
              {page.data.map((item) => (
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
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};
