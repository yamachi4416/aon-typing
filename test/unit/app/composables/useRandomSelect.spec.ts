import { describe, expect, it } from 'vitest'

describe('useRandomSelect', () => {
  const createValue = <T>(init?: T) => {
    const changes: T[] = []
    const v = ref(init)
    const value = computed({
      get: () => v.value,
      set: (value) => {
        changes.push(value)
        v.value = value
      },
    })

    return {
      value,
      changes,
    }
  }
  it('valuesが空ならvalueを変更しない', () => {
    const { value, changes } = createValue(1)
    const values = ref([])
    const { select } = useRandomSelect(value, values)

    expect(select()).toBeUndefined()
    expect(value.value).toBe(1)
    expect(changes).toEqual([])
  })

  it('valuesにvalueしか含まれない場合はvalue変更しない', () => {
    const { value, changes } = createValue(1)
    const values = ref([1])
    const { select } = useRandomSelect(value, values)

    expect(select()).toBeUndefined()
    expect(value.value).toBe(1)

    expect(select()).toBeUndefined()
    expect(value.value).toBe(1)

    expect(changes).toEqual([])
  })

  it('現在のvalueの値以外をvaluesから選択する', () => {
    const { value, changes } = createValue(1)
    const values = ref([1, 2])

    const { select } = useRandomSelect(value, values)

    expect(select()).toBe(2)
    expect(value.value).toBe(2)
    expect(changes).toEqual([2])
  })

  it('現在のvalueの値以外をvaluesから均等に選択する', () => {
    const { value, changes } = createValue(1)
    const values = ref([1, 2, 3])

    const { select } = useRandomSelect(value, values)

    for (let i = 0; i < 2; i++) select()

    expect(changes.toSorted()).toEqual([2, 3])
  })

  it('valuesから均等に選択する（初期値なし）', () => {
    const { value, changes } = createValue()
    const values = ref([1, 2, 3])

    const { select } = useRandomSelect(value, values)

    for (let i = 0; i < 3; i++) {
      select()
    }

    expect(changes.toSorted()).toEqual([1, 2, 3])
  })

  it('valuesから均等に選択する', () => {
    const { value, changes } = createValue<number>()
    const values = ref([1, 2, 3])

    const { select } = useRandomSelect(value, values)

    for (let i = 0; i < 100; i++) {
      select()
    }

    expect(changes.length).toBe(100)

    const counts = Map.groupBy(changes, (v) => v)
      .values()
      .map((v) => v.length)
      .toArray()
      .toSorted()

    expect(counts).toEqual([33, 33, 34])
  })

  it('valuesの変更は選択にも適応される', async () => {
    const { value, changes } = createValue(1)
    const values = ref([1, 2, 3])
    const { select } = useRandomSelect(value, values)

    values.value = [4]

    expect(select()).toBe(4)
    expect(value.value).toBe(4)
    expect(changes).toEqual([4])
  })
})
