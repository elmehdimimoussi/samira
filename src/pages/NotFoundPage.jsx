import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <FileQuestion size={32} className="text-slate-400" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Page introuvable
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
      </div>
      <Link to="/">
        <Button variant="outline">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
