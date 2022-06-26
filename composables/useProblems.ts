import {
  ProblemDetail,
  ProblemListItem,
  ProblemTagSummary,
  TagInfo,
} from "~~/types/problems";

import { GameSetting } from "~/libs/TypingGame";

class UseProblems {
  private _problems: ProblemListItem[] = [];
  private _newProblems: ProblemListItem[] = [];
  private _tagSummary: ProblemTagSummary[] = [];
  private _setting = shallowReactive(new GameSetting());

  constructor() {}

  get setting() {
    return this._setting;
  }

  get problems() {
    return [...this._problems];
  }

  get newProblems() {
    return [...this._newProblems];
  }

  get tagSummary() {
    return [...this._tagSummary];
  }

  async retrieveItems() {
    await Promise.all([
      useFetch("/api/problems.json").then(({ data }) => {
        this._problems = data.value.problems;
      }),
      useFetch("/api/problems/news.json").then(({ data }) => {
        this._newProblems = data.value;
      }),
      useFetch("/api/tags.json").then(({ data }) => {
        this._tagSummary = Object.entries(data.value).map(([name, tag]) => ({
          ...tag,
          name,
        }));
      }),
    ]);
  }

  async retrieveTag({ id }: { id: string }) {
    const { data: tag, error } = await useFetch(`/api/tags/${id}.json`);
    if (error.value instanceof Error) {
      throwError(error.value);
    }
    return tag.value as TagInfo;
  }

  async retrieveProblemDetail({ id }: { id: string }) {
    const { data: detail, error } = await useFetch(`/api/problems/${id}.json`);
    if (error.value instanceof Error) {
      throwError(error.value);
    }
    return detail.value as ProblemDetail;
  }

  async lazyProblemDetail({ id }: { id: string }) {
    return (await fetch(`/api/problems/${id}.json`, {
      method: "get",
    }).then((res) => res.json())) as ProblemDetail;
  }

  problemTagFilter({
    problems,
    tagId,
    qtags = [],
  }: {
    problems?: ProblemListItem[];
    tagId?: string;
    qtags?: string[];
  }) {
    if (!qtags || qtags.length === 0) {
      return problems ?? this.problems;
    } else {
      const ids = tagId ? [tagId, ...qtags] : qtags;
      return (problems ?? this.problems).filter((p) => {
        const tids = new Set(p.tags.map((tag) => tag.id));
        return ids.every((id) => tids.has(id));
      });
    }
  }
}

const useProblemState = new UseProblems();

export function useProblems() {
  return useProblemState;
}
