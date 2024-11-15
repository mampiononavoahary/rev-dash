import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Login = () => {
    return (
        <div className="grid w-full max-w-sm items-center gap-4">
          <Label htmlFor="username">Username</Label>
          <Input type="username" id="email" placeholder="Username" />
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Password" />
          <Button>Log In</Button>
        </div>
      )
}

export default Login

