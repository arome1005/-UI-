"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { CangJingModule } from "@/components/modules/cangjing-module"
import { ShengHuiModule } from "@/components/modules/shenghui-module"
import { LuoBiModule } from "@/components/modules/luobi-module"
import { TuiYanModule } from "@/components/modules/tuiyan-module"
import { LiubaiModule } from "@/components/modules/liubai-module"
import { LiuguangModule } from "@/components/modules/liuguang-module"
import { WenCeModule } from "@/components/modules/wence-module"
import { SettingsModule } from "@/components/modules/settings-module"
import { EmptyModule } from "@/components/modules/empty-module"

export default function Home() {
  const [activeModule, setActiveModule] = useState("liubai")

  const renderModule = () => {
    switch (activeModule) {
      case "liubai":
        return <LiubaiModule />
      case "tuiyan":
        return <TuiYanModule />
      case "liuguang":
        return <LiuguangModule />
      case "wence":
        return <WenCeModule />
      case "luobi":
        return <LuoBiModule />
      case "shenghui":
        return <ShengHuiModule />
      case "cangjing":
        return <CangJingModule />
      case "settings":
        return <SettingsModule />
      default:
        return <EmptyModule moduleId={activeModule} />
    }
  }

  return (
    <AppShell activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </AppShell>
  )
}
