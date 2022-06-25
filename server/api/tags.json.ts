import { default as data } from "~/assets/api/tags.json";
import { ProblemTagSummary } from "~~/types/problems";

export default defineEventHandler((event) => {
  return data as Record<string, ProblemTagSummary>;
});
