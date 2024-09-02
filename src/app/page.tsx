import { sql } from 'drizzle-orm';

import { db } from '@/db';

import { Button } from '@/components/ui/button';

export default async function Home() {
  const now = await db.execute(sql<string>`select now()`);
  return (
    <div>
      <pre>{JSON.stringify(now, undefined, 2)}</pre>
      <Button>Hello</Button>
    </div>
  );
}
