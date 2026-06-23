describe('reactive', () => {
  describe('toReactive', () => {
    describe('object', () => {
      const getRef = () =>
        ref({
          name: 'name',
          price: 100,
          createdAt: new Date(1999, 0, 1),
        })

      it('init', () => {
        const value = getRef()
        const proxy = toReactive(value)
        expect(proxy).toEqual(value.value)
      })

      it('init(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        expect(proxy).toEqual({})
      })

      it('modify ref', () => {
        const value = getRef()
        const proxy = toReactive(value)
        value.value.name = 'proxy'
        value.value.price = 900
        value.value.createdAt = new Date(2000, 0, 1)
        expect(proxy).toEqual({
          name: 'proxy',
          price: 900,
          createdAt: new Date(2000, 0, 1),
        })
        expect(value.value).toEqual(proxy)
      })

      it('replace ref', () => {
        const value = getRef()
        const proxy = toReactive(value)
        value.value = {
          name: 'proxy',
          price: 900,
          createdAt: new Date(2000, 0, 1),
        }
        expect(proxy).toEqual({
          name: 'proxy',
          price: 900,
          createdAt: new Date(2000, 0, 1),
        })
        expect(value.value).toEqual(proxy)
      })

      it('replace ref(null)', () => {
        const value = getRef()
        const proxy = toReactive(value)
        value.value = null!
        expect(proxy).toEqual({})
      })

      it('modify proxy', () => {
        const value = getRef()
        const proxy = toReactive(value)
        proxy.name = 'proxy'
        proxy.price = 900
        proxy.createdAt = new Date(2000, 0, 1)
        expect(proxy).toEqual({
          name: 'proxy',
          price: 900,
          createdAt: new Date(2000, 0, 1),
        })
        expect(value.value).toEqual(proxy)
      })

      it('modify proxy(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        proxy.name = 'proxy'
        proxy.price = 900
        proxy.createdAt = new Date(2000, 0, 1)
        expect(proxy).toEqual({})
        expect(value.value).toEqual(null)
      })

      it('in', () => {
        const value = getRef()
        const proxy = toReactive(value)
        expect('name' in proxy).toBe(true)
        expect('price' in proxy).toBe(true)
        expect('createdAt' in proxy).toBe(true)
        expect('none' in proxy).toBe(false)
      })

      it('in(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        expect('name' in proxy).toBe(false)
        expect('price' in proxy).toBe(false)
        expect('createdAt' in proxy).toBe(false)
        expect('none' in proxy).toBe(false)
      })

      it('Object.keys', () => {
        const value = getRef()
        const proxy = toReactive(value)
        expect(Object.keys(proxy)).toEqual(Object.keys(value.value))
      })

      it('Object.keys(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        expect(Object.keys(proxy)).toEqual([])
      })

      it('Object.entries', () => {
        const value = getRef()
        const proxy = toReactive(value)
        expect(Object.entries(proxy)).toEqual(Object.entries(value.value))
      })

      it('Object.entries(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        expect(Object.entries(proxy)).toEqual([])
      })

      it('delete', () => {
        const value = getRef()
        const proxy = toReactive(value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (proxy as any).name
        expect(Object.keys(proxy)).not.contain('name')
      })

      it('delete(null)', () => {
        const value = getRef()
        value.value = null!
        const proxy = toReactive(value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (proxy as any).name
        expect(Object.keys(proxy)).not.contain('name')
      })
    })

    describe('class', () => {
      class Klass {
        constructor(
          public firstName: string,
          public lastName: string,
        ) {}

        get name() {
          return [this.firstName, this.lastName].join(' ')
        }

        set name(name: string) {
          this.setName(name)
        }

        getName() {
          return this.name
        }

        setName(name: string) {
          const [firstName, lastName] = name.split(' ')
          this.firstName = firstName ?? ''
          this.lastName = lastName ?? ''
        }
      }

      it('init', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        expect(proxy).toEqual(value.value)
      })

      it('get name()', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        expect(proxy.name).toEqual(value.value.name)
      })

      it('set name(name)', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        proxy.name = 'c d'
        expect(proxy.name).toEqual('c d')
        expect(value.value.name).toEqual('c d')
      })

      it('getName()', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        expect(proxy.getName()).toEqual(value.value.getName())
      })

      it('setName(name)', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        proxy.setName('c d')
        expect(proxy.name).toEqual('c d')
        expect(value.value.name).toEqual('c d')
      })

      it('instanceof', () => {
        const value = ref(new Klass('a', 'b'))
        const proxy = toReactive(value)
        expect(proxy instanceof Klass).toBe(true)
      })

      it('prototype', () => {
        const value = ref({ firstName: 'a', lastName: 'b' })
        const proxy = toReactive(value)
        Object.setPrototypeOf(proxy, Klass.prototype)
        expect(proxy).toEqual(new Klass('a', 'b'))
      })

      it('prototype(null)', () => {
        const value = ref({ firstName: 'a', lastName: 'b' })
        value.value = null!
        const proxy = toReactive(value)
        Object.setPrototypeOf(proxy, Klass.prototype)
        expect(proxy).toEqual({})
      })
    })
  })
})
