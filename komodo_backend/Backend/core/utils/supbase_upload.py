from supabase import create_client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_to_supabase(file, path):
    try:
        file_content = file.read()
        file.seek(0)  # Reset file pointer

        response = supabase.storage.from_("media").upload(
            path,
            file,
            {"content-type": file.content_type}
        )

        if response.get("error"):
            raise Exception(response["error"])

        public_url = supabase.storage.from_("media").get_public_url(path)
        return public_url["publicURL"]

    except Exception as e:
        print("Upload failed:", e)
        return None