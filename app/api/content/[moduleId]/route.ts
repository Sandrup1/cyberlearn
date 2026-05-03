import clientPromise from "../../../lib/mongodb";
import {
  CourseContent,
  getDefaultCourseContent,
} from "../../../lib/course-content";

export const dynamic = "force-dynamic";

function sanitizeContent(content: CourseContent): CourseContent {
  return {
    ...content,
    moduleId: content.moduleId,
    sections: content.sections || [],
    labs: content.labs || [],
  };
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await context.params;

  try {
    const client = await clientPromise;
    const db = client.db("cyberlearn");
    const content = await db
      .collection<CourseContent>("courseContents")
      .findOne({ moduleId: moduleId, published: true });

    if (content) {
      // Remove _id from db result
      const { _id, ...cleanContent } = content as any;
      return Response.json(sanitizeContent(cleanContent as CourseContent));
    }
  } catch (error) {
    console.error("Course content lookup failed:", error);
  }

  // Fallback
  const fallbackContent = getDefaultCourseContent(moduleId);
  if (!fallbackContent) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }

  return Response.json(sanitizeContent(fallbackContent));
}
