import { NextResponse } from "next/server";

function handler() {
  return NextResponse.json({
    names: {
      zach: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
      _: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
    },
  });
}

export { handler as GET, handler as POST };
