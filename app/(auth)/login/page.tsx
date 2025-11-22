import { login } from "./actions";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <LoginForm action={login}/>
  )
}
