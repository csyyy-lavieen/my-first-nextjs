-- Create documents table safely (only if not exists)
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (safe to run multiple times)
alter table documents enable row level security;

-- Drop existing policies to avoid conflicts when recreating
drop policy if exists "Users can manipulate their own documents" on documents;

-- Create policies
create policy "Users can manipulate their own documents"
  on documents for all
  using (auth.uid() = user_id);

-- Enable Realtime safely
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'documents') then
    alter publication supabase_realtime add table documents;
  end if;
end $$;
