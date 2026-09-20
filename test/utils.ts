export function clearEndpointRegistry() {
  if (typeof window === 'undefined') return

  const win = window as unknown as {
    __app: { _registeredEndpointRegistry: Record<string, unknown> }
    __registry: Set<string>
  }

  if (win.__app) {
    win.__app._registeredEndpointRegistry = {}
  }

  if (win.__registry) {
    const manifests = [...win.__registry.values()].slice(0, 2)
    win.__registry.clear()
    for (const manifest of manifests) {
      win.__registry.add(manifest)
    }
  }
}
