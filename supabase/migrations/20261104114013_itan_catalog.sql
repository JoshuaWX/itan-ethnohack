create table public.itan_taxa (
  id text primary key,
  name text not null,
  common text not null,
  aliases text[] not null default '{}',
  source text not null,
  published boolean not null default false
);
create table public.itan_sources (
  id text primary key,
  url text not null,
  title text not null,
  published boolean not null default false
);
create table public.itan_evidence (
  id text primary key,
  taxon_id text not null references public.itan_taxa(id),
  source_id text not null references public.itan_sources(id),
  study_type text not null,
  plant_part text not null,
  preparation text not null,
  published boolean not null default false
);
create table public.itan_photos (
  taxon_id text primary key references public.itan_taxa(id),
  path text not null,
  source_url text not null,
  author text not null,
  license text not null,
  license_url text not null,
  plant_part text not null,
  edits text not null,
  published boolean not null default false
);
create table public.itan_interactions (
  id text primary key,
  taxon_id text not null references public.itan_taxa(id),
  source_id text not null references public.itan_sources(id),
  medicine text,
  summary text not null,
  limitation text not null,
  published boolean not null default false
);
alter table public.itan_taxa enable row level security;
alter table public.itan_sources enable row level security;
alter table public.itan_evidence enable row level security;
alter table public.itan_photos enable row level security;
alter table public.itan_interactions enable row level security;
revoke all on public.itan_taxa, public.itan_sources, public.itan_evidence, public.itan_photos, public.itan_interactions from anon, authenticated;
grant select on public.itan_taxa, public.itan_sources, public.itan_evidence, public.itan_photos, public.itan_interactions to anon, authenticated;
create policy public_published on public.itan_taxa for select to anon, authenticated using (published);
create policy public_published on public.itan_sources for select to anon, authenticated using (published);
create policy public_published on public.itan_evidence for select to anon, authenticated using (published);
create policy public_published on public.itan_photos for select to anon, authenticated using (published);
create policy public_published on public.itan_interactions for select to anon, authenticated using (published);
insert into public.itan_taxa (id,name,common,aliases,source,published) values
('hibiscus','Sabdariffa gossypiifolia','Hibiscus',array['Hibiscus sabdariffa','hibiscus (calyces of hibiscus sabdariffa)','roselle'],'https://powo.science.kew.org/taxon/326388-2',true),
('ginger','Zingiber officinale','Ginger',array['organic ginger'],'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:798372-1',true),
('cinnamon-verum','Cinnamomum verum','Ceylon cinnamon',array['cinnamon'],'https://powo.science.kew.org/taxon/463752-1',true),
('cinnamon-cassia','Cinnamomum burmanni','Java cinnamon',array['cinnamon'],'https://powo.science.kew.org/taxon/463328-1',true),
('guava','Psidium guajava','Guava',array[]::text[],'https://powo.science.kew.org/taxon/600841-1',true);
insert into public.itan_sources (id,url,title,published) values
('ema-ginger','https://www.ema.europa.eu/en/medicines/herbal/zingiberis-rhizoma','EMA ginger assessment',true),
('guava-lab','https://pmc.ncbi.nlm.nih.gov/articles/PMC2911405/','Guava laboratory study',true),
('roselle-simvastatin','https://pubmed.ncbi.nlm.nih.gov/28925046/','Roselle and simvastatin pharmacokinetic study',true);
insert into public.itan_evidence (id,taxon_id,source_id,study_type,plant_part,preparation,published) values
('ginger-traditional','ginger','ema-ginger','traditional use','rhizome','specified powdered or tincture preparations',true),
('guava-in-vitro','guava','guava-lab','in vitro','leaf','hot aqueous extract',true);
insert into public.itan_interactions (id,taxon_id,source_id,medicine,summary,limitation,published) values
('roselle-simvastatin','hibiscus','roselle-simvastatin','simvastatin','A small crossover study in six healthy volunteers found reduced simvastatin exposure with an aqueous roselle calyx beverage.','The studied beverage and single dose may differ from other products and circumstances.',true);
insert into public.itan_photos (taxon_id,path,source_url,author,license,license_url,plant_part,edits,published) values
('hibiscus','/plants/hibiscus.webp','https://commons.wikimedia.org/wiki/File:Roselle_Calyces.jpg','SarKaLay','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','calyces','resized and converted to WebP',true),
('ginger','/plants/ginger.webp','https://commons.wikimedia.org/wiki/File:Zingiber_officinale_rhizome.jpg','Kayleemariev','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','rhizome','resized and converted to WebP',true),
('cinnamon-verum','/plants/cinnamon-verum.webp','https://commons.wikimedia.org/wiki/File:Starr_070906-8568_Cinnamomum_verum.jpg','Forest & Kim Starr','CC BY 3.0','https://creativecommons.org/licenses/by/3.0/','leaf','resized and converted to WebP',true),
('cinnamon-cassia','/plants/cinnamon-cassia.webp','https://commons.wikimedia.org/wiki/File:Starr_070403-6416_Cinnamomum_burmanni.jpg','Forest & Kim Starr','CC BY 3.0','https://creativecommons.org/licenses/by/3.0/','leaves','resized and converted to WebP',true),
('guava','/plants/guava.webp','https://commons.wikimedia.org/wiki/File:Starr_050818-4173_Psidium_guajava.jpg','Forest & Kim Starr','CC BY 3.0','https://creativecommons.org/licenses/by/3.0/','leaves','resized and converted to WebP',true);
