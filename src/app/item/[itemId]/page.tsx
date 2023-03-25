import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '../../utils/supabase-queries';
import createClient from '../../utils/supabase-server';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ro';

export default async function Item({
  params,
}: {
  params: {
    itemId: string;
  };
}) {
  const supabase = createClient();
  const { itemId } = params;
  dayjs.extend(relativeTime);
  dayjs.locale('ro');
  try {
    const item = await getItem(supabase, itemId);
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm">
          {' '}
          Back to dashboard
        </Link>
        <h1>{item.name}</h1>
        <h3>{dayjs().to(item.created_at)}</h3>
        <p>{item.description}</p>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
