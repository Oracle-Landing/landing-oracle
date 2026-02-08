import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const oracles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/oracles" }),
  schema: z.object({
    name: z.string(),
    number: z.string().optional(),
    domain: z.string().optional(),
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    stack: z.array(z.string()).optional(),
    screenshot: z.string().optional(),
    status: z.enum(["live", "known"]),
  }),
});

export const collections = { oracles };
