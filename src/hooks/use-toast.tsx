
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

const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Create a toast context
const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => void
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<ToasterToast>) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  updateToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = React.useCallback(
    (toast: Omit<ToasterToast, "id">) => {
      setToasts((currentToasts) => {
        const id = Math.random().toString(36).substring(2, 9)
        return [...currentToasts, { id, ...toast }]
      })
    },
    []
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  const updateToast = React.useCallback(
    (id: string, toast: Partial<ToasterToast>) => {
      setToasts((currentToasts) =>
        currentToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
      )
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function toast(props: Omit<ToasterToast, "id">) {
  // This is a fallback for when we're not within the provider context
  // For instance, when used outside of React components
  const id = Math.random().toString(36).substring(2, 9)
  
  // Try to use the context if available
  try {
    const { addToast } = useToast()
    addToast(props)
    
    return {
      id,
      dismiss: () => {
        const { removeToast } = useToast()
        removeToast(id)
      },
      update: (props: Partial<ToasterToast>) => {
        const { updateToast } = useToast()
        updateToast(id, props)
      },
    }
  } catch (e) {
    // If outside of React context, just return these no-op functions
    console.warn("Toast used outside of ToastProvider. Toast will not be displayed.")
    return {
      id,
      dismiss: () => {},
      update: () => {},
    }
  }
}

export { type ToasterToast, type ToastActionElement, type ToastProps }
