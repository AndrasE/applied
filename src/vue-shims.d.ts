// This shim allows TypeScript to understand .vue files as valid modules.
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
