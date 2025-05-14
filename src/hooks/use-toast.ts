
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"
import { useToast as useToastShadcn } from "@/components/ui/use-toast"

const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const toastState = {
  toasts: [] as ToasterToast[],
}

export function useToast() {
  return useToastShadcn()
}

export function toast({
  ...props
}: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).substring(2, 9)
  const { toasts } = useToastShadcn()
  
  // Update the toast state
  toastState.toasts = [
    ...toasts,
    { id, ...props },
  ]
  
  // Return helpers to dismiss or update the toast
  return {
    id,
    dismiss: () => {},
    update: (props: ToasterToast) => {},
  }
}

export { type ToasterToast, type ToastActionElement, type ToastProps }
