alter table admin_attempt add column if not exists client_key text;

create index if not exists admin_attempt_client_idx on admin_attempt (client_key, created_at);
