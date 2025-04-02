from supabase import create_client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_to_supabase(file, path):
    try:
        file.seek(0)
        file_content = file.read()

        response = supabase.storage.from_("media").upload(
            path,
            file_content,  
            {"content-type": file.content_type}
        )

        if response.error:
            raise Exception(f"Upload failed: {response.error.message}")

        public_url = supabase.storage.from_("media").get_public_url(path)
        return public_url.get("publicURL")  

    except Exception as e:
        print("Upload failed:", e)
        return None