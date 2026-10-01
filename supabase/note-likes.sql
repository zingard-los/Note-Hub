create table public.note_likes (
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (note_id, user_id)
);

alter table public.note_likes enable row level security;

create policy "Authenticated users can view note likes"
on public.note_likes
for select
to authenticated
using (true);

create policy "Users can like public notes"
on public.note_likes
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.notes
    where public.notes.id = note_id
      and public.notes.is_public = true
      and public.notes.user_id <> auth.uid()
  )
);

create policy "Users can remove their note likes"
on public.note_likes
for delete
to authenticated
using (auth.uid() = user_id);