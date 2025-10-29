// Server Action (app/api/uploadthing/delete/route.ts)
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    // Extract file key from URL
    const fileKey = url.split('/').pop();
    
    await utapi.deleteFiles(fileKey);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete' }, { status: 500 });
  }
}