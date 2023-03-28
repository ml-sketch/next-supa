import { Table, PaginationOptions } from '@/types';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  deleteItem,
  getAllItems,
  getAllItemsPaginated,
  getItem,
  insertItem,
  updateItem,
} from './supabase-queries';
import supabaseClient from './supabase-browser';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useInfiniteItems = (options: PaginationOptions) => {
  const { limit } = options;
  const maxItems = 500; // Hard floor to avoid abuse. Set the maximum number of items

  return useInfiniteQuery<Array<Table<'items'>>, Error>(
    ['items'],
    async ({ pageParam = 1 }) => {
      return getAllItemsPaginated(supabaseClient, { page: pageParam, limit });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalFetchedItems = allPages.reduce(
          (acc, curr) => acc + curr.length,
          0
        );
        if (totalFetchedItems < maxItems && lastPage.length === limit) {
          return allPages.length + 1;
        }
        return false;
      },
    }
  );
};
export const useItems = (initialData: Array<Table<'items'>>) => {
  return useQuery<Array<Table<'items'>>>(
    ['items'],
    async () => {
      return getAllItems(supabaseClient);
    },
    {
      initialData,
    }
  );
};

export const useItemsPaginated = (
  initialData: Array<Table<'items'>>,
  options: PaginationOptions
) => {
  const { page, limit } = options;

  return useQuery<Array<Table<'items'>>>(
    ['items', page, limit],
    async () => {
      return getAllItemsPaginated(supabaseClient, { page, limit });
    },
    {
      initialData,
    }
  );
};

export const useInsertItem = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async (item: { name: string; description: string }) => {
      return insertItem(supabaseClient, item);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Creating item');
        toastRef.current = toastId;
      },

      onSuccess: () => {
        toast.success('Item created', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
        onSuccess?.();
      },
      onError: () => {
        toast.error('Failed to create item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  const toastRef = useRef<string | null>(null);

  return useMutation(
    async (item: { id: string; name: string; description: string }) => {
      return updateItem(supabaseClient, item);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Updating item');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        toast.success('Item updated', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
      },
      onError: () => {
        toast.error('Failed to update item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async (id: string) => {
      return deleteItem(supabaseClient, id);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Deleting item');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        toast.success('Item deleted', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
      },
      onError: () => {
        toast.error('Failed to delete item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useGetItem = (id: string) => {
  return useQuery<Promise<Table<'items'>>>(['items', id], async () => {
    return getItem(supabaseClient, id);
  });
};
