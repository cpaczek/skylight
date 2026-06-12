import { resolve } from "node:path";

export default {
  resolve: {
    alias: { "@shared": resolve(__dirname, "shared/src") },
  },
  test: {
    include: [
      "shared/test/**/*.test.ts",
      "tracker/test/**/*.test.ts",
      "server/test/**/*.test.ts",
      "web/test/**/*.test.ts",
    ],
  },
};
