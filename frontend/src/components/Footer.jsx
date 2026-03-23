import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Blogger
            </h2>
            <p className="text-foreground/70 mb-6 max-w-sm">
              Votre plateforme ultime pour découvrir, partager et créer des articles inspirants sur le développement, le design et la technologie.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="https://github.com/Senpai7Adim/Bloger.git" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-foreground/70 hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/articles" className="text-foreground/70 hover:text-primary transition-colors">Articles</Link></li>
              <li><Link to="/login" className="text-foreground/70 hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link to="/register" className="text-foreground/70 hover:text-primary transition-colors">S'inscrire</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Légal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-foreground/70 hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="#" className="text-foreground/70 hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="#" className="text-foreground/70 hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} Blogger. Tous droits réservés.
          </p>
          <p className="text-foreground/50 text-sm flex items-center gap-1">
            Fait avec <span className="text-red-500 animate-pulse">❤️</span> pour la communauté.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
