import { finishDrawingSSO } from "../../../../lib/drawing-sso";
export const dynamic = "force-dynamic";
export async function GET(request) { return finishDrawingSSO(request); }
