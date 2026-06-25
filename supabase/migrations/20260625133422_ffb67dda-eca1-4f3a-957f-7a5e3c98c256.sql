-- ENUMS
create type public.app_role as enum ('author', 'reviewer', 'soc', 'admin');
create type public.abstract_status as enum ('submitted', 'accepted_oral', 'accepted_poster', 'rejected');
create type public.assignment_status as enum ('pending', 'done', 'declined_coi');
create type public.review_recommendation as enum ('accept_oral', 'accept_poster', 'reject', 'revise');

-- updated_at helper
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- TABLES

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  affiliation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.abstracts (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  topic_id uuid references public.topics(id) on delete set null,
  background text,
  methods text,
  results text,
  conclusion text,
  word_count int,
  file_path text,
  status public.abstract_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.abstract_authors (
  id uuid primary key default gen_random_uuid(),
  abstract_id uuid not null references public.abstracts(id) on delete cascade,
  name text not null,
  affiliation text,
  email text,
  is_presenting boolean not null default false,
  author_order int not null default 0
);

create table public.review_assignments (
  id uuid primary key default gen_random_uuid(),
  abstract_id uuid not null references public.abstracts(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  status public.assignment_status not null default 'pending',
  assigned_at timestamptz not null default now(),
  unique (abstract_id, reviewer_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null unique references public.review_assignments(id) on delete cascade,
  score_novelty int check (score_novelty between 1 and 5),
  score_methods int check (score_methods between 1 and 5),
  score_relevance int check (score_relevance between 1 and 5),
  recommendation public.review_recommendation,
  comments_for_authors text,
  comments_for_soc text,
  submitted_at timestamptz not null default now()
);

-- INDEXES
create index abstracts_submitted_by_idx on public.abstracts(submitted_by);
create index abstracts_topic_id_idx on public.abstracts(topic_id);
create index abstracts_status_idx on public.abstracts(status);
create index abstract_authors_abstract_id_idx on public.abstract_authors(abstract_id);
create index review_assignments_reviewer_id_idx on public.review_assignments(reviewer_id);
create index review_assignments_abstract_id_idx on public.review_assignments(abstract_id);

-- GRANTS
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

grant select on public.topics to anon, authenticated;
grant all on public.topics to service_role;

grant select, insert, update, delete on public.abstracts to authenticated;
grant all on public.abstracts to service_role;

grant select, insert, update, delete on public.abstract_authors to authenticated;
grant all on public.abstract_authors to service_role;

grant select, insert, update, delete on public.review_assignments to authenticated;
grant all on public.review_assignments to service_role;

grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.topics enable row level security;
alter table public.abstracts enable row level security;
alter table public.abstract_authors enable row level security;
alter table public.review_assignments enable row level security;
alter table public.reviews enable row level security;

-- has_role security-definer function (avoids recursive RLS on user_roles)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- POLICIES: profiles
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

create policy "SOC and admins read all profiles"
  on public.profiles for select to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

-- POLICIES: user_roles
create policy "Users read own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create policy "Admins read all roles"
  on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins insert roles"
  on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins update roles"
  on public.user_roles for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete roles"
  on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- POLICIES: topics
create policy "Anyone reads topics"
  on public.topics for select to anon, authenticated
  using (true);

create policy "SOC and admins manage topics"
  on public.topics for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'soc'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'soc'));

-- POLICIES: abstracts
create policy "Authors read own abstracts"
  on public.abstracts for select to authenticated
  using (submitted_by = auth.uid());

create policy "Authors insert own abstracts"
  on public.abstracts for insert to authenticated
  with check (submitted_by = auth.uid());

create policy "Authors update own abstracts while submitted"
  on public.abstracts for update to authenticated
  using (submitted_by = auth.uid() and status = 'submitted');

create policy "Reviewers read assigned abstracts"
  on public.abstracts for select to authenticated
  using (
    exists (
      select 1 from public.review_assignments ra
      where ra.abstract_id = abstracts.id and ra.reviewer_id = auth.uid()
    )
  );

create policy "SOC and admins read all abstracts"
  on public.abstracts for select to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

create policy "SOC and admins update abstracts"
  on public.abstracts for update to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

-- POLICIES: abstract_authors (blinding — reviewers cannot read these)
create policy "Authors read own abstract authors"
  on public.abstract_authors for select to authenticated
  using (
    exists (
      select 1 from public.abstracts a
      where a.id = abstract_authors.abstract_id and a.submitted_by = auth.uid()
    )
  );

create policy "Authors insert own abstract authors"
  on public.abstract_authors for insert to authenticated
  with check (
    exists (
      select 1 from public.abstracts a
      where a.id = abstract_authors.abstract_id and a.submitted_by = auth.uid()
    )
  );

create policy "Authors update own abstract authors"
  on public.abstract_authors for update to authenticated
  using (
    exists (
      select 1 from public.abstracts a
      where a.id = abstract_authors.abstract_id and a.submitted_by = auth.uid()
    )
  );

create policy "Authors delete own abstract authors"
  on public.abstract_authors for delete to authenticated
  using (
    exists (
      select 1 from public.abstracts a
      where a.id = abstract_authors.abstract_id and a.submitted_by = auth.uid()
    )
  );

create policy "SOC and admins read all abstract authors"
  on public.abstract_authors for select to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

-- POLICIES: review_assignments
create policy "Reviewers read own assignments"
  on public.review_assignments for select to authenticated
  using (reviewer_id = auth.uid());

create policy "Reviewers update own assignment status"
  on public.review_assignments for update to authenticated
  using (reviewer_id = auth.uid());

create policy "SOC and admins read all assignments"
  on public.review_assignments for select to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

create policy "SOC and admins insert assignments"
  on public.review_assignments for insert to authenticated
  with check (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

create policy "SOC and admins update assignments"
  on public.review_assignments for update to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

create policy "SOC and admins delete assignments"
  on public.review_assignments for delete to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

-- POLICIES: reviews
create policy "Reviewers read own reviews"
  on public.reviews for select to authenticated
  using (
    exists (
      select 1 from public.review_assignments ra
      where ra.id = reviews.assignment_id and ra.reviewer_id = auth.uid()
    )
  );

create policy "Reviewers insert own reviews"
  on public.reviews for insert to authenticated
  with check (
    exists (
      select 1 from public.review_assignments ra
      where ra.id = reviews.assignment_id and ra.reviewer_id = auth.uid()
    )
  );

create policy "Reviewers update own reviews"
  on public.reviews for update to authenticated
  using (
    exists (
      select 1 from public.review_assignments ra
      where ra.id = reviews.assignment_id and ra.reviewer_id = auth.uid()
    )
  );

create policy "SOC and admins read all reviews"
  on public.reviews for select to authenticated
  using (public.has_role(auth.uid(), 'soc') or public.has_role(auth.uid(), 'admin'));

-- BLINDED VIEW for reviewers: omits author info, respects RLS via security_invoker
create view public.reviewer_abstract_view
with (security_invoker = true) as
select
  a.id,
  a.title,
  a.topic_id,
  t.name as topic_name,
  a.background,
  a.methods,
  a.results,
  a.conclusion,
  a.word_count,
  a.file_path,
  a.status,
  a.submitted_at
from public.abstracts a
left join public.topics t on t.id = a.topic_id;

grant select on public.reviewer_abstract_view to authenticated;

-- updated_at triggers
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_abstracts_updated_at
  before update on public.abstracts
  for each row execute function public.update_updated_at_column();