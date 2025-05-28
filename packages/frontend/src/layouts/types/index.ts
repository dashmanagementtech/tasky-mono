import type { Component } from "vue"

export interface IRoutes {
  uri: string
  title: string
  icon: Component
  acl?: string[]
}
