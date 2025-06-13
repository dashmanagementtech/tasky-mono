import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'auth' | 'app',
    parent?: string,
    acl?: string[],
    protected?: boolean,
    name?: string,
    side?: boolean
  }
}
