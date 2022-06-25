import { default as data } from "~/assets/api/newProblems.json";
import { ProblemListItem } from "~~/types/problems";

export default defineEventHandler((event) => {
  return data as ProblemListItem[];
});
