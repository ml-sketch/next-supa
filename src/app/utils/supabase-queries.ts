import { AppSupabaseClient, Table, PaginationOptions } from '@/types';

export const getAllItems = async (
  supabase: AppSupabaseClient
): Promise<Array<Table<'items'>>> => {
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

export const getAllItemsPaginated = async (
  supabase: AppSupabaseClient,
  options: PaginationOptions
): Promise<{ data: Array<Table<'items'>>; totalCount: number }> => {
  const { page, limit } = options;

  const { data, error, count } = await supabase
    .from('items')
    .select('*', { count: 'exact' })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.log(error);
    throw error;
  }

  return { data, totalCount: count };
};

export const insertItem = async (
  supabase: AppSupabaseClient,
  item: { name: string; description: string }
): Promise<Table<'items'>> => {
  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateItem = async (
  supabase: AppSupabaseClient,
  item: { id: string; name: string; description: string }
) => {
  const { data, error } = await supabase.from('items').update(item).single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteItem = async (supabase: AppSupabaseClient, id: string) => {
  const { error } = await supabase.from('items').delete().match({ id });

  if (error) {
    throw error;
  }

  return true;
};

export const getItem = async (
  supabase: AppSupabaseClient,
  id: string
): Promise<Table<'items'>> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
