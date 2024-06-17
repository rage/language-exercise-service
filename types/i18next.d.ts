import "i18next"

import ownTranslations from "@/locales/en/exercise-service.json"
import sharedModule from "@/shared-module/common/locales/en/shared-module.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "exercise-service"
    fallbackNS: "shared-module"
    resources: {
      "exercise-service": typeof ownTranslations
      "shared-module": typeof sharedModule
    }
    allowObjectInHTMLChildren: true
  }

  type Trans = string // typeof Reacti18Next.Trans
}
