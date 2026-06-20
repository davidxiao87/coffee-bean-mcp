"use client"

import { useState } from "react"

import { BeansList } from "@/components/beans-list"
import { CreateBeanDialog } from "@/components/beans/create-bean-dialog"

export function BeansView() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <BeansList refreshKey={refreshKey} />
      <CreateBeanDialog onCreated={() => setRefreshKey((k) => k + 1)} />
    </>
  )
}