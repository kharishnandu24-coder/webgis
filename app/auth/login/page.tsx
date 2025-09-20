import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FRA Atlas</h1>
          <p className="text-muted-foreground">Forest Rights Decision Support System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
