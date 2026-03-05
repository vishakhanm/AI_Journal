// TODO: check visual parsing
import { z } from "zod";

export const EmotionSchema = z.object({
    primaryEmotion: z.string(),
    secondaryEmotion: z.array(z.string()),
    intensity: z.number().min(1).max(10),
    tone: z.string(),
    keywords: z.array(z.string()).max(5),
});

export const VisualSchema = z.object({
    color_palette: z
        .array(z.string().regex(/^#([0-9A-Fa-f]{6})$/))
        .min(3)
        .max(5),
    motion_style: z.string(),
    shape_style: z.string(),
    contrast: z.enum(["low", "medium", "high"]),
    density: z.number().min(0).max(1),
});
