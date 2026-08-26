/**
 * Label, control, and field error in the arrangement the console uses.
 * The error id matches the `aria-describedby` each control sets, so the
 * message is announced with the field rather than read on its own.
 */
export function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-900 dark:text-gray-50"
      >
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1 text-sm text-red-600 dark:text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  )
}
