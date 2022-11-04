-- Table: public.admins_mapping

-- DROP TABLE IF EXISTS public.admins_mapping;

CREATE TABLE IF NOT EXISTS public.admins_mapping
(
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT admins_mapping_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.admins_mapping
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.admins_mapping TO anon;

GRANT ALL ON TABLE public.admins_mapping TO postgres;

GRANT ALL ON TABLE public.admins_mapping TO supabase_admin;

GRANT ALL ON TABLE public.admins_mapping TO authenticated;

GRANT ALL ON TABLE public.admins_mapping TO service_role;

COMMENT ON TABLE public.admins_mapping
    IS 'Maps All userids as admins';