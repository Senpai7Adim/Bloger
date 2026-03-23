import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, PenSquare, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 w-full md:backdrop-blur-md bg-white dark:bg-slate-900 md:bg-background/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
              <span className="text-2xl">Blogger</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Accueil</Link>
              <Link to="/articles" className="text-foreground/80 hover:text-primary transition-colors">Articles</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/write" className="hidden md:flex items-center space-x-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  <PenSquare size={16} />
                  <span>Écrire</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-primary/20" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 text-sm">
                      <UserIcon size={16} />
                      <span>Mon Tableau de Bord</span>
                    </Link>
                    <button onClick={logout} className="w-full text-left flex items-center space-x-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-sm">
                      <LogOut size={16} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-sm">
                <Link to="/login" className="text-foreground/80 hover:text-primary transition-colors font-medium">Connexion</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm font-medium">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
