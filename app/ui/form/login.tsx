import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Login = () => {
    return (
        <div className="grid w-full max-w-sm items-center gap-4">
          <Label htmlFor="nom_d_utilisateur">Nom d'utilisateur</Label>
          <Input type="nom_d_utilisateur" id="nom_d_utilisateur" placeholder="Nom d'utilisateur" />
          <Label htmlFor="mot_de_passe">Mot de passe</Label>
          <Input type="mot_de_passe" id="mot_de_passe" placeholder="Mot de passe" />
          <Button>Se connecter</Button>
        </div>
      )
}

export default Login

