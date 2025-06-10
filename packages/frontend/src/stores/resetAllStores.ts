import { useAppStore } from "./app"

// Automatically imports all store files under /features/**/store/
const storeModules = import.meta.glob('../features/**/store/*', {
  eager: true,
})

export function resetAllStores() {
  for (const modulePath in storeModules) {
    const mod = storeModules[modulePath] as Record<string, any>

    for (const exportName in mod) {
      const maybeStoreCreator = mod[exportName]

      if (typeof maybeStoreCreator === 'function') {
        try {
          const store = maybeStoreCreator()

          if (typeof store.reset === 'function') {
            store.reset()
          }
          else if (typeof store.$reset === 'function') {
            store.$reset()
          }
          else {
            console.warn(
              `[resetAllStores] Store "${exportName}" from "${modulePath}" has no reset() or $reset() method.`,
            )
          }
        }
        catch (e) {
          console.warn(
            `[resetAllStores] Failed to instantiate store "${exportName}" from "${modulePath}". Possibly not usable outside setup().`,
            e,
          )
        }
      }
    }

    const appstore = useAppStore()
    appstore.reset()
  }
}
