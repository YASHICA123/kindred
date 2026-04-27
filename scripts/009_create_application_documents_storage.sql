-- Create the storage bucket used for admission document uploads.
insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', true)
on conflict (id) do update
set public = excluded.public;

-- Allow authenticated users to upload documents into their own folder.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Allow authenticated uploads for application documents'
  ) then
    create policy "Allow authenticated uploads for application documents"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'application-documents'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
end $$;
