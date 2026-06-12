-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'management')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Files table
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  storage_path text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  content_type text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS policies for files (all authenticated users can view, only uploader can modify)
CREATE POLICY "select_files" ON files FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_files" ON files FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "update_files" ON files FOR UPDATE
  TO authenticated USING (auth.uid() = uploaded_by) WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "delete_files" ON files FOR DELETE
  TO authenticated USING (auth.uid() = uploaded_by);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'staff'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-files', 'shop-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "anyone_can_upload" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'shop-files');
CREATE POLICY "anyone_can_download" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'shop-files');
CREATE POLICY "uploader_can_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'shop-files');
