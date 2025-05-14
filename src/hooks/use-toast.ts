
import { useToast as useToastShadcn } from "@/components/ui/use-toast"
import { toast as toastShadcn } from "@/components/ui/toast"

export { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

export function useToast() {
  return useToastShadcn()
}

export const toast = toastShadcn
